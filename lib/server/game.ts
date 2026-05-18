/**
 * Server-side game logic. Imported only from API routes.
 * All mutations go through here. Uses service-role client so it bypasses RLS.
 */

import { serverClient } from "@/lib/supabase/server";
import { createRound, type RoundInstance } from "@/lib/game/createRound";
import {
  resolveRound,
  type RoundResult,
  type RoundSnapshot,
} from "@/lib/game/resolution";
import {
  HEARTS_TO_WIN,
  RUMOURS_TO_LOSE,
  type RecipientKey,
  type RouteKey,
  type ToneKey,
} from "@/lib/game/content";

/* ---------- Room code generator ---------- */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXY23456789"; // no 0/1/O/I/Z
function genCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

export async function createRoom(sessionId: string): Promise<{ code: string }> {
  const db = serverClient();
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = genCode();
    const { data: room, error } = await db
      .from("rooms")
      .insert({ code })
      .select("id, code")
      .single();
    if (error) {
      if (error.code === "23505") continue; // unique violation — try another code
      throw error;
    }
    await db.from("players").insert({ room_id: room.id, slot: 1, session_id: sessionId });
    return { code: room.code };
  }
  throw new Error("Could not generate a unique room code");
}

export async function joinRoom(code: string, sessionId: string): Promise<{ ok: true; slot: number } | { error: string }> {
  const db = serverClient();
  const { data: room } = await db.from("rooms").select("id, status").eq("code", code).maybeSingle();
  if (!room) return { error: "no_such_room" };

  // If already in this room, return existing slot.
  const { data: existing } = await db
    .from("players")
    .select("slot")
    .eq("room_id", room.id)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (existing) return { ok: true, slot: existing.slot };

  const { data: occupants } = await db
    .from("players")
    .select("slot")
    .eq("room_id", room.id);
  if ((occupants?.length ?? 0) >= 2) return { error: "room_full" };

  const usedSlots = new Set((occupants ?? []).map((p) => p.slot));
  const slot = usedSlots.has(1) ? 2 : 1;
  const { error: insErr } = await db
    .from("players")
    .insert({ room_id: room.id, slot, session_id: sessionId });
  if (insErr) throw insErr;

  // Once two players are present, start the game.
  if ((occupants?.length ?? 0) + 1 === 2 && room.status === "lobby") {
    await startGame(room.id);
  }
  return { ok: true, slot };
}

/* ---------- Game lifecycle ---------- */
async function startGame(roomId: string): Promise<void> {
  const db = serverClient();
  const { data: game } = await db
    .from("games")
    .insert({ room_id: roomId })
    .select("id")
    .single();
  if (!game) throw new Error("Failed to create game");
  await db.from("rooms").update({ status: "in_game" }).eq("id", roomId);
  await createNextRound(game.id, 1, 1, 0, 0);
}

async function createNextRound(
  gameId: string,
  number: number,
  suitorSlot: number,
  hearts: number,
  rumours: number,
  recipient?: RecipientKey,
): Promise<void> {
  const db = serverClient();
  const seed = Math.floor(Math.random() * 1_000_000);
  const round: RoundInstance = createRound(seed, { recipient, hearts, rumours });
  await db.from("rounds").insert({
    game_id: gameId,
    number,
    suitor_slot: suitorSlot,
    current_phase: "confidant", // confidant goes first
    recipient: round.recipientKey,
    intention: round.intention,
    routes: round.routes,
    rival_route: round.rivalRouteKey,
    rival_trait: round.rivalTraitKey,
    clues: round.clues,
    confidant_hand: round.confidantHand,
    suitor_hand: round.suitorHand,
  });
}

/* ---------- Action handlers ---------- */
type ActionResult = { ok: true } | { error: string };

async function loadActiveRound(roomCode: string) {
  const db = serverClient();
  const { data: room } = await db.from("rooms").select("id").eq("code", roomCode).maybeSingle();
  if (!room) return { error: "no_such_room" } as const;
  const { data: game } = await db.from("games").select("*").eq("room_id", room.id).maybeSingle();
  if (!game) return { error: "no_game" } as const;
  const { data: round } = await db
    .from("rounds")
    .select("*")
    .eq("game_id", game.id)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!round) return { error: "no_round" } as const;
  return { ok: true as const, roomId: room.id, game, round };
}

async function requireSession(roomCode: string, sessionId: string) {
  const db = serverClient();
  const { data: room } = await db.from("rooms").select("id").eq("code", roomCode).maybeSingle();
  if (!room) return { error: "no_such_room" } as const;
  const { data: player } = await db
    .from("players")
    .select("slot")
    .eq("room_id", room.id)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (!player) return { error: "not_in_room" } as const;
  return { ok: true as const, slot: player.slot };
}

export async function handleAction(
  code: string,
  sessionId: string,
  payload: { type: string; [k: string]: unknown },
): Promise<ActionResult> {
  const session = await requireSession(code, sessionId);
  if ("error" in session) return session;

  const db = serverClient();
  const ctx = await loadActiveRound(code);
  if ("error" in ctx) return ctx;
  const { round, game } = ctx;

  const isSuitor = session.slot === round.suitor_slot;
  const isConfidant = !isSuitor;

  switch (payload.type) {
    case "confidant_commit": {
      if (!isConfidant) return { error: "wrong_role" };
      if (round.current_phase !== "confidant") return { error: "wrong_phase" };
      const signals = payload.signals as unknown[];
      const played = payload.played as unknown[];
      await db
        .from("rounds")
        .update({
          signals,
          played_cards: played,
          current_phase: "tone",
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "suitor_tone": {
      if (!isSuitor) return { error: "wrong_role" };
      if (round.current_phase !== "tone") return { error: "wrong_phase" };
      const tone = payload.tone as ToneKey;
      await db
        .from("rounds")
        .update({ suitor_tone: tone, current_phase: "question" })
        .eq("id", round.id);
      return { ok: true };
    }

    case "ask_question": {
      if (!isSuitor) return { error: "wrong_role" };
      if (round.current_phase !== "question") return { error: "wrong_phase" };
      const route = payload.route as RouteKey;
      await db
        .from("rounds")
        .update({
          question: { route, answer: null },
          current_phase: "answer",
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "answer_question": {
      if (!isConfidant) return { error: "wrong_role" };
      if (round.current_phase !== "answer") return { error: "wrong_phase" };
      const answer = payload.answer as "Trust" | "Danger" | "Unsure";
      const q = (round.question ?? {}) as { route?: RouteKey };
      await db
        .from("rounds")
        .update({
          question: { route: q.route, answer },
          current_phase: "route",
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "skip_question": {
      if (!isSuitor) return { error: "wrong_role" };
      if (round.current_phase !== "question") return { error: "wrong_phase" };
      await db.from("rounds").update({ current_phase: "route" }).eq("id", round.id);
      return { ok: true };
    }

    case "choose_route": {
      if (!isSuitor) return { error: "wrong_role" };
      if (round.current_phase !== "route") return { error: "wrong_phase" };
      const chosen = payload.route as RouteKey;
      const suitorCard = (payload.suitor_card as string | null) ?? null;

      // Apply Confidant card targeting to obstacles
      const routes = (round.routes as RoundSnapshot["routes"]).map((r) => ({
        ...r,
        obstacles: [...r.obstacles],
      }));
      for (const p of (round.played_cards as Array<{ key: string; routeTarget: RouteKey | null }>)) {
        if (!p.routeTarget) continue;
        const tgt = routes.find((r) => r.key === p.routeTarget);
        if (!tgt) continue;
        if (p.key === "distract_guard") tgt.obstacles = tgt.obstacles.filter((o) => o !== "guard");
        if (p.key === "clear_gossip") tgt.obstacles = tgt.obstacles.filter((o) => o !== "gossip");
        if (p.key === "find_key") tgt.obstacles = tgt.obstacles.filter((o) => o !== "locked_door");
        if (p.key === "correct_address") tgt.obstacles = tgt.obstacles.filter((o) => o !== "false_address");
      }

      const snap: RoundSnapshot = {
        recipientKey: round.recipient as RecipientKey,
        intention: round.intention,
        routes,
        rivalRouteKey: round.rival_route as RouteKey,
        rivalTraitKey: round.rival_trait as RoundSnapshot["rivalTraitKey"],
        confidantPlayed: (round.played_cards as Array<{ key: string }>).map((p) => p.key),
        suitorPlayed: suitorCard as RoundSnapshot["suitorPlayed"],
        suitorToneKey: round.suitor_tone as ToneKey,
        suitorChosenRouteKey: chosen,
        heartsEarnedSoFar: game.hearts,
        rumoursSoFar: game.rumours,
        gossipOnRivalRoute: routes
          .find((rt) => rt.key === round.rival_route)!
          .obstacles.includes("gossip"),
      };
      const result: RoundResult = resolveRound(snap);

      await db
        .from("rounds")
        .update({
          chosen_route: chosen,
          suitor_card_played: suitorCard,
          result,
          current_phase: "resolution",
          routes,
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "next_round": {
      if (round.current_phase !== "resolution") return { error: "wrong_phase" };
      const result = round.result as RoundResult;
      const newHearts = game.hearts + result.heartsDelta;
      const newRumours = game.rumours + result.rumoursDelta;

      if (newHearts >= HEARTS_TO_WIN || newRumours >= RUMOURS_TO_LOSE) {
        await db
          .from("games")
          .update({
            hearts: newHearts,
            rumours: newRumours,
            status: newHearts >= HEARTS_TO_WIN ? "won" : "lost",
          })
          .eq("id", game.id);
        await db.from("rounds").update({ current_phase: "gameover" }).eq("id", round.id);
        return { ok: true };
      }

      const nextNumber = round.number + 1;
      const nextSuitorSlot = round.suitor_slot === 1 ? 2 : 1;
      await db
        .from("games")
        .update({
          hearts: newHearts,
          rumours: newRumours,
          round_number: nextNumber,
        })
        .eq("id", game.id);
      await createNextRound(game.id, nextNumber, nextSuitorSlot, newHearts, newRumours);
      return { ok: true };
    }

    default:
      return { error: "unknown_action" };
  }
}

export async function getRoomView(code: string, sessionId: string): Promise<unknown> {
  const db = serverClient();
  const { data, error } = await db.rpc("get_room_view", {
    p_code: code,
    p_session_id: sessionId,
  });
  if (error) throw error;
  return data;
}
