/**
 * Pure deterministic resolver for the simplified Rival Hearts ruleset.
 */

import {
  CONFIDANT_ACTIONS,
  ROUTES,
  TONES,
  type ConfidantAction,
  type MoodKey,
  type RouteKey,
  type Signal,
  type ToneKey,
} from "./content";

export type RoundSnapshot = {
  moodKey: MoodKey;
  dangerRouteKey: RouteKey;
  rivalRouteKey: RouteKey;
  confidantAction: ConfidantAction;
  signals: Signal[];
  suitorToneKey: ToneKey;
  suitorChosenRouteKey: RouteKey;
  heartsEarnedSoFar: number;
  rumoursSoFar: number;
};

export type RoundOutcome = "success" | "fail";

export type RoundResult = {
  outcome: RoundOutcome;
  token: "heart" | "rumour";
  heartsDelta: number;
  rumoursDelta: number;
  reason: string;
  trace: string[];
  reveal: {
    moodKey: MoodKey;
    dangerRouteKey: RouteKey;
    rivalRouteKey: RouteKey;
    confidantAction: ConfidantAction;
    suitorToneKey: ToneKey;
    suitorChosenRouteKey: RouteKey;
  };
};

export function resolveRound(s: RoundSnapshot): RoundResult {
  const choseDanger = s.suitorChosenRouteKey === s.dangerRouteKey;
  const choseRival = s.suitorChosenRouteKey === s.rivalRouteKey;
  const dangerProtected = s.confidantAction === "clear_danger";
  const rivalProtected = s.confidantAction === "delay_rival";
  const toneFits = s.suitorToneKey === s.moodKey || s.confidantAction === "strengthen_letter";

  const trace = [
    `Mood was ${TONES[s.moodKey].label}.`,
    `Danger was on the ${ROUTES[s.dangerRouteKey].label}.`,
    `Rival watched the ${ROUTES[s.rivalRouteKey].label}.`,
    `Confidant action was ${CONFIDANT_ACTIONS[s.confidantAction].label}.`,
    `Suitor chose ${ROUTES[s.suitorChosenRouteKey].label} with a ${TONES[s.suitorToneKey].label} letter.`,
  ];

  if (choseDanger && !dangerProtected) {
    trace.push("The chosen route still held danger, so a Rumour spreads.");
    return finishFail(s, "The letter crossed a dangerous route that was not cleared.", trace);
  }

  if (choseRival && !rivalProtected && !toneFits) {
    trace.push("The Rival was on that route, and the letter did not fit the mood.");
    return finishFail(s, "The Rival intercepted the moment and the wrong tone gave them room.", trace);
  }

  if (choseDanger && dangerProtected) {
    trace.push("Clear Danger protected the chosen route.");
  }
  if (choseRival && rivalProtected) {
    trace.push("Delay Rival protected the route from the Rival.");
  }
  if (s.confidantAction === "strengthen_letter" && s.suitorToneKey !== s.moodKey) {
    trace.push("Strengthen Letter made the tone count as fitting the mood.");
  }
  if (s.suitorToneKey === s.moodKey) {
    trace.push("The tone matched the recipient's mood.");
  }
  if (!choseDanger && !choseRival) {
    trace.push("The chosen route avoided both hidden threats.");
  }

  return finishSuccess(s, "The letter reaches the right heart before scandal can form.", trace);
}

function reveal(s: RoundSnapshot): RoundResult["reveal"] {
  return {
    moodKey: s.moodKey,
    dangerRouteKey: s.dangerRouteKey,
    rivalRouteKey: s.rivalRouteKey,
    confidantAction: s.confidantAction,
    suitorToneKey: s.suitorToneKey,
    suitorChosenRouteKey: s.suitorChosenRouteKey,
  };
}

function finishSuccess(s: RoundSnapshot, reason: string, trace: string[]): RoundResult {
  return {
    outcome: "success",
    token: "heart",
    heartsDelta: 1,
    rumoursDelta: 0,
    reason,
    trace,
    reveal: reveal(s),
  };
}

function finishFail(s: RoundSnapshot, reason: string, trace: string[]): RoundResult {
  return {
    outcome: "fail",
    token: "rumour",
    heartsDelta: 0,
    rumoursDelta: 1,
    reason,
    trace,
    reveal: reveal(s),
  };
}
