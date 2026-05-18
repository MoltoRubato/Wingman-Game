/**
 * lib/game/resolution.ts
 * Pure resolution function — Section 2 of the build plan.
 * No I/O, no randomness. Takes a RoundSnapshot, returns RoundResult.
 * Covered by Vitest (see spec §11 item 1).
 */

import {
  ROUTES, OBSTACLES, RECIPIENTS, TONES,
  CONFIDANT_CARDS, SUITOR_CARDS, RIVAL_TRAITS,
  type RouteKey, type ObstacleKey, type RecipientKey, type ToneKey,
} from "./content";

export type RoundSnapshot = {
  recipientKey: RecipientKey;
  intention: string;
  /** All 3 routes this round. */
  routes: Array<{
    key: RouteKey;
    baseTime: number;
    obstacles: ObstacleKey[];        // resolved (after Confidant cancellations)
    originalObstacles: ObstacleKey[];// for narrative
  }>;
  rivalRouteKey: RouteKey;
  rivalTraitKey: keyof typeof RIVAL_TRAITS;
  /** Confidant cards played this round, by key. */
  confidantPlayed: string[];
  /** Suitor card played this round, or null. */
  suitorPlayed: string | null;
  suitorToneKey: ToneKey;
  /** Suitor's chosen route. */
  suitorChosenRouteKey: RouteKey;
  /** Earned so far (BEFORE this round resolves). */
  heartsEarnedSoFar: number;
  rumoursSoFar: number;
  /** Did Confidant clear Gossip on the Rival's route? (For Rival LP bonus). */
  gossipOnRivalRoute: boolean;
};

export type RoundOutcome = "success" | "fail" | "fail_blocking";

export type RoundResult = {
  outcome: RoundOutcome;
  heartsDelta: number;
  rumoursDelta: number;
  suitorTravelTime: number;
  rivalTravelTime: number;
  suitorLetterPower: number;
  rivalLetterPower: number;
  reason: string;
  /** Step-by-step trace — for the Resolution view. */
  trace: string[];
};

/* ────────────────────────────────────────────────────────────────────── */
export function resolveRound(s: RoundSnapshot): RoundResult {
  const trace: string[] = [];
  const tone = TONES[s.suitorToneKey];
  const recipient = RECIPIENTS[s.recipientKey];
  const rivalTrait = RIVAL_TRAITS[s.rivalTraitKey];

  const chosenRoute = s.routes.find(r => r.key === s.suitorChosenRouteKey)!;
  const rivalRoute  = s.routes.find(r => r.key === s.rivalRouteKey)!;

  /* ── STEP 1: blocking obstacles ───────────────────────────────────── */
  const hasLocked       = chosenRoute.obstacles.includes("locked_door");
  const hasFalseAddress = chosenRoute.obstacles.includes("false_address");
  const hasFindKey      = s.confidantPlayed.includes("find_key");
  const hasCorrectAddr  = s.confidantPlayed.includes("correct_address");
  const blocked =
    (hasLocked && !hasFindKey) ||
    (hasFalseAddress && !hasCorrectAddr);

  if (blocked) {
    trace.push(`Unresolved blocking obstacle on ${ROUTES[chosenRoute.key].label}.`);
    return finishFail(
      "fail_blocking",
      "The Suitor cannot reach the recipient.",
      trace,
      s, /* tts */ 99, 0, 0, 0,
    );
  }

  /* ── STEP 2: compute Travel Times ─────────────────────────────────── */
  let suitorTT = chosenRoute.baseTime + tone.travelDelta;
  trace.push(`Base ${chosenRoute.baseTime} + tone (${tone.label}) ${signed(tone.travelDelta)} = ${suitorTT}.`);

  const usedBraveShortcut = s.suitorPlayed === "brave_shortcut";

  for (const ob of chosenRoute.obstacles) {
    const meta = OBSTACLES[ob];
    if (ob === "guard" && (s.confidantPlayed.includes("distract_guard") && !usedBraveShortcut)) {
      trace.push(`Guard distracted (no penalty).`);
      continue;
    }
    if (ob === "crowded_hall" && s.suitorPlayed === "wait_right_moment") {
      trace.push(`Crowded Hall negated by Wait for the Right Moment.`);
      continue;
    }
    if (meta.travelDelta) {
      suitorTT += meta.travelDelta;
      trace.push(`Active obstacle ${meta.label}: ${signed(meta.travelDelta)} TT.`);
    }
  }

  // R13 — Brave Shortcut: -1 TT, but voids 4 support cards.
  if (usedBraveShortcut) {
    suitorTT -= 1;
    trace.push(`Brave Shortcut −1 TT (Safe Passage / Distract Guard / Clear Gossip / Find Key voided).`);
  }
  // Support cards (only if NOT Brave Shortcut)
  if (!usedBraveShortcut) {
    if (s.confidantPlayed.includes("safe_passage") && chosenRoute.obstacles.length > 0) {
      suitorTT -= 1;
      trace.push(`Safe Passage cancels first obstacle (−1 TT).`);
    }
  }
  if (s.confidantPlayed.includes("secret_map")) {
    suitorTT -= 1;
    trace.push(`Secret Map −1 TT.`);
  }
  if (s.suitorPlayed === "wait_right_moment") {
    suitorTT += 1;
    trace.push(`Wait for the Right Moment +1 TT.`);
  }
  if (suitorTT < 1) suitorTT = 1;

  /* Rival TT */
  let rivalTT = rivalRoute.baseTime;
  if (s.confidantPlayed.includes("delay_rival")) { rivalTT += 1; trace.push("Delay the Rival +1 Rival TT."); }
  if (s.suitorPlayed === "direct_confession") { rivalTT -= 1; trace.push("Direct Confession −1 Rival TT."); }
  if (rivalTrait.tag === "rt_minus_1") { rivalTT -= 1; trace.push(`Rival trait Fast Courier −1.`); }
  if (rivalTT < 1) rivalTT = 1;

  trace.push(`Suitor TT = ${suitorTT}, Rival TT = ${rivalTT}.`);

  /* ── STEP 3/4: compare ────────────────────────────────────────────── */
  if (suitorTT < rivalTT) {
    return finishSuccess(s, "The Suitor arrives first.", trace, suitorTT, rivalTT, ...lpCompute(s, rivalTrait, false));
  }
  if (suitorTT > rivalTT) {
    // Could still be saved by Sealed Promise? No — Sealed Promise is tiebreak ONLY.
    return finishFail("fail", "The Rival's letter arrives first.", trace, s, suitorTT, rivalTT, ...lpCompute(s, rivalTrait, false));
  }

  /* ── STEP 5: tied — compare Letter Power ──────────────────────────── */
  const [suitorLP, rivalLP] = lpCompute(s, rivalTrait, /*forTiebreak*/ true);
  trace.push(`Tied on TT. Suitor LP = ${suitorLP}, Rival LP = ${rivalLP}.`);

  if (suitorLP > rivalLP) return finishSuccess(s, "Tied speed; Suitor's letter is more compelling.", trace, suitorTT, rivalTT, suitorLP, rivalLP);
  if (suitorLP < rivalLP) {
    if (s.suitorPlayed === "sealed_promise") {
      trace.push("Sealed Promise wins the tie despite weaker LP.");
      return finishSuccess(s, "A sealed promise outweighs all reason.", trace, suitorTT, rivalTT, suitorLP, rivalLP);
    }
    return finishFail("fail", "Tied speed; the Rival's letter rings truer.", trace, s, suitorTT, rivalTT, suitorLP, rivalLP);
  }

  /* ── STEP 5c: LP also tied — apply tone tiebreak ──────────────────── */
  let suitorWins = false;
  switch (s.suitorToneKey) {
    case "tender":
      suitorWins = true;
      trace.push("Tone tiebreak: Tender wins.");
      break;
    case "bold":
      suitorWins = false;
      trace.push("Tone tiebreak: Bold loses.");
      break;
    case "honest": {
      const gossipCleared = s.confidantPlayed.includes("clear_gossip");
      suitorWins = gossipCleared;
      trace.push(`Tone tiebreak: Honest ${gossipCleared ? "wins (Gossip cleared)" : "loses (Gossip uncleared)"}.`);
      break;
    }
    case "playful": {
      const noted = s.confidantPlayed.includes("encouraging_note");
      suitorWins = noted;
      trace.push(`Tone tiebreak: Playful ${noted ? "wins (Encouraging Note played)" : "loses (no Note)"}.`);
      break;
    }
  }
  if (suitorWins) {
    return finishSuccess(s, "Tone carries the day.", trace, suitorTT, rivalTT, suitorLP, rivalLP);
  }
  if (s.suitorPlayed === "sealed_promise") {
    trace.push("Sealed Promise overrides tone tiebreak loss.");
    return finishSuccess(s, "The seal stands.", trace, suitorTT, rivalTT, suitorLP, rivalLP);
  }
  return finishFail("fail", "Tied throughout — the Rival wins by default.", trace, s, suitorTT, rivalTT, suitorLP, rivalLP);
}

/* ─── helpers ────────────────────────────────────────────────────────── */
function signed(n: number) { return n >= 0 ? `+${n}` : `${n}`; }

function lpCompute(s: RoundSnapshot, rivalTrait: typeof RIVAL_TRAITS[keyof typeof RIVAL_TRAITS], _forTiebreak: boolean): [number, number] {
  const tone = TONES[s.suitorToneKey];
  const recipient = RECIPIENTS[s.recipientKey];

  let suitorLP = 4 + tone.powerDelta;

  let prefDelta = 0;
  if (recipient.likes.includes(s.suitorToneKey)) prefDelta = 1;
  else if (recipient.dislikes.includes(s.suitorToneKey)) prefDelta = -1;
  // Court Favourite halves preference effect (round toward 0).
  if (rivalTrait.tag === "recipient_pref_neutralised") prefDelta = Math.trunc(prefDelta / 2);
  suitorLP += prefDelta;

  if (s.confidantPlayed.includes("encouraging_note")) suitorLP += 1;
  if (s.suitorPlayed === "direct_confession") suitorLP += 2;

  /* Rival LP */
  let rivalLP = 3 + s.heartsEarnedSoFar;
  if (s.gossipOnRivalRoute && s.suitorToneKey !== "honest") {
    rivalLP += 1;
  }
  if (rivalTrait.tag === "lp_plus_1") rivalLP += 1;
  if (rivalTrait.tag === "lp_plus_hearts" && s.heartsEarnedSoFar >= 2) rivalLP += 1;

  return [suitorLP, rivalLP];
}

function finishSuccess(s: RoundSnapshot, reason: string, trace: string[],
                       suitorTT: number, rivalTT: number, suitorLP: number, rivalLP: number): RoundResult {
  return {
    outcome: "success",
    heartsDelta: 1,
    rumoursDelta: 0,
    suitorTravelTime: suitorTT, rivalTravelTime: rivalTT,
    suitorLetterPower: suitorLP, rivalLetterPower: rivalLP,
    reason, trace,
  };
}
function finishFail(kind: "fail"|"fail_blocking", reason: string, trace: string[],
                    s: RoundSnapshot, suitorTT: number, rivalTT: number,
                    suitorLP: number, rivalLP: number): RoundResult {
  let rumoursDelta = 1;
  // Cover Story (stretch) converts the Rumour to no token, applied at step 7.
  if (s.confidantPlayed.includes("cover_story")) {
    rumoursDelta = 0;
    trace.push("Cover Story converted the Rumour to nothing.");
  }
  return {
    outcome: kind,
    heartsDelta: 0,
    rumoursDelta,
    suitorTravelTime: suitorTT, rivalTravelTime: rivalTT,
    suitorLetterPower: suitorLP, rivalLetterPower: rivalLP,
    reason, trace,
  };
}
