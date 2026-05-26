/**
 * Server-side game logic. Imported only from API routes.
 * All mutations go through here. Uses service-role client so it bypasses RLS.
 */

import { serverClient } from "@/lib/supabase/server";
import { createRound, type RoundInstance } from "@/lib/game/createRound";
import { resolveRound, type RoundResult, type RoundSnapshot } from "@/lib/game/resolution";
import {
  HEARTS_TO_WIN,
  RUMOURS_TO_LOSE,
  type ConfidantAction,
  type RouteKey,
  type Signal,
  type ToneKey,
} from "@/lib/game/content";
import { ActionSchema } from "@/lib/game/schema";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXY23456789";

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
      if (error.code === "23505") continue;
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

  const { data: existing } = await db
    .from("players")
    .select("slot")
    .eq("room_id", room.id)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (existing) return { ok: true, slot: existing.slot };

  const { data: occupants } = await db.from("players").select("slot").eq("room_id", room.id);
  if ((occupants?.length ?? 0) >= 2) return { error: "room_full" };

  const usedSlots = new Set((occupants ?? []).map((p) => p.slot));
  const slot = usedSlots.has(1) ? 2 : 1;
  const { error: insertError } = await db.from("players").insert({ room_id: room.id, slot, session_id: sessionId });
  if (insertError) throw insertError;

  if ((occupants?.length ?? 0) + 1 === 2 && room.status === "lobby") {
    await startGame(room.id);
  }
  return { ok: true, slot };
}

async function startGame(roomId: string): Promise<void> {
  const db = serverClient();
  const { data: game } = await db.from("games").insert({ room_id: roomId }).select("id").single();
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
): Promise<void> {
  const db = serverClient();
  const seed = Math.floor(Math.random() * 1_000_000);
  const round: RoundInstance = createRound(seed, { hearts, rumours });

  await db.from("rounds").insert({
    game_id: gameId,
    number,
    suitor_slot: suitorSlot,
    current_phase: "confidant",
    recipient: round.recipientName,
    intention: round.intention,
    routes: round.routes,
    mood_key: round.moodKey,
    danger_route: round.dangerRouteKey,
    rival_route: round.rivalRouteKey,
    clues: round.clues,
    signals: [],
    confidant_action: null,
    suitor_tone: null,
    chosen_route: null,
    result: null,
    rival_trait: "none",
    confidant_hand: [],
    suitor_hand: [],
    played_cards: [],
    question: null,
    suitor_card_played: null,
  });
}

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
  const parsed = ActionSchema.safeParse(payload);
  if (!parsed.success) return { error: "bad_action" };

  const session = await requireSession(code, sessionId);
  if ("error" in session) return session;

  const db = serverClient();
  const ctx = await loadActiveRound(code);
  if ("error" in ctx) return ctx;
  const { round, game } = ctx;

  const isSuitor = session.slot === round.suitor_slot;
  const isConfidant = !isSuitor;
  const action = parsed.data;

  switch (action.type) {
    case "confidant_commit": {
      if (!isConfidant) return { error: "wrong_role" };
      if (round.current_phase !== "confidant") return { error: "wrong_phase" };
      await db
        .from("rounds")
        .update({
          signals: action.signals,
          confidant_action: action.action,
          current_phase: "suitor",
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "suitor_choose": {
      if (!isSuitor) return { error: "wrong_role" };
      if (round.current_phase !== "suitor") return { error: "wrong_phase" };

      const signals = (round.signals ?? []) as Signal[];
      const confidantAction = round.confidant_action as ConfidantAction | null;
      if (!confidantAction) return { error: "missing_confidant_action" };

      const snap: RoundSnapshot = {
        moodKey: round.mood_key as ToneKey,
        dangerRouteKey: round.danger_route as RouteKey,
        rivalRouteKey: round.rival_route as RouteKey,
        confidantAction,
        signals,
        suitorToneKey: action.tone,
        suitorChosenRouteKey: action.route,
        heartsEarnedSoFar: game.hearts,
        rumoursSoFar: game.rumours,
      };
      const result: RoundResult = resolveRound(snap);

      await db
        .from("rounds")
        .update({
          suitor_tone: action.tone,
          chosen_route: action.route,
          result,
          current_phase: "resolution",
        })
        .eq("id", round.id);
      return { ok: true };
    }

    case "next_round": {
      if (round.current_phase !== "resolution") return { error: "wrong_phase" };
      const result = round.result as RoundResult | null;
      if (!result) return { error: "missing_result" };

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
