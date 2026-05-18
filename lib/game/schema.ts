/**
 * lib/game/schema.ts
 * Zod schemas — validate every RPC payload and serialized RoundSnapshot.
 * Mirrors content.ts types; one source of truth for the API boundary.
 */

import { z } from "zod";

export const RouteKeySchema       = z.enum(["garden", "gallery", "corridor"]);
export const ObstacleKeySchema    = z.enum(["gossip", "guard", "locked_door", "crowded_hall", "false_address", "secret_passage"]);
export const RecipientKeySchema   = z.enum(["celeste", "aureon", "mira", "heir"]);
export const ToneKeySchema        = z.enum(["tender", "bold", "honest", "playful"]);
export const SignalTypeSchema     = z.enum(["heart", "thorn", "eye", "clock", "mask", "key"]);
export const QuestionAnswerSchema = z.enum(["Trust", "Danger", "Unsure"]);

export const ConfidantCardKeySchema = z.enum([
  "trace_footsteps","read_the_seal","distract_guard","clear_gossip","find_key","safe_passage",
  "delay_rival","misdirect_messenger","encouraging_note","secret_map","correct_address","cover_story",
]);
export const SuitorCardKeySchema = z.enum([
  "brave_shortcut","careful_rewrite","sealed_promise","second_thoughts","direct_confession","wait_right_moment",
]);
export const RivalTraitKeySchema = z.enum([
  "fast_courier","silver_tongue","court_favourite","hidden_seal","false_trail","jealous_rival",
]);
export const PhaseSchema = z.enum([
  "lobby","setup","tone_choice","confidant_phase","question_phase","route_choice","resolution","interround","gameover",
]);

/* ── Signal placement ─────────────────────────────────────────── */
export const SignalSchema = z.object({
  type: SignalTypeSchema,
  /** Targetable surfaces. Free-form to support stretch surfaces. */
  target: z.string().regex(/^(route:(garden|gallery|corridor)|tone|intention)$/),
});

/* ── Played card payloads ─────────────────────────────────────── */
export const PlayedCardSchema = z.object({
  card: ConfidantCardKeySchema,
  /** Some cards target a route; nullable otherwise. */
  routeTarget: RouteKeySchema.nullable(),
  apCost: z.union([z.literal(1), z.literal(2)]),
});

/* ── Actions sent from client to server ───────────────────────── */
export const ActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("choose_tone"),    tone: ToneKeySchema }),
  z.object({ type: z.literal("play_card"),      card: ConfidantCardKeySchema, routeTarget: RouteKeySchema.nullable() }),
  z.object({ type: z.literal("place_signal"),   signal: SignalSchema }),
  z.object({ type: z.literal("ask_question"),   route: RouteKeySchema }),
  z.object({ type: z.literal("answer_question"),answer: QuestionAnswerSchema }),
  z.object({ type: z.literal("choose_route"),   route: RouteKeySchema }),
  z.object({ type: z.literal("play_suitor_card"), card: SuitorCardKeySchema }),
  z.object({ type: z.literal("end_phase") }),
]);
export type ActionPayload = z.infer<typeof ActionSchema>;

/* ── Round snapshot (server → resolver) ───────────────────────── */
export const RoundSnapshotSchema = z.object({
  recipientKey: RecipientKeySchema,
  intention: z.string(),
  routes: z.array(z.object({
    key: RouteKeySchema,
    baseTime: z.number().int().min(1).max(9),
    obstacles: z.array(ObstacleKeySchema),
    originalObstacles: z.array(ObstacleKeySchema),
  })).length(3),
  rivalRouteKey: RouteKeySchema,
  rivalTraitKey: RivalTraitKeySchema,
  confidantPlayed: z.array(ConfidantCardKeySchema),
  suitorPlayed: SuitorCardKeySchema.nullable(),
  suitorToneKey: ToneKeySchema,
  suitorChosenRouteKey: RouteKeySchema,
  heartsEarnedSoFar: z.number().int().min(0),
  rumoursSoFar: z.number().int().min(0),
  gossipOnRivalRoute: z.boolean(),
});

/* ── Room & player ────────────────────────────────────────────── */
export const RoomCodeSchema = z.string().regex(/^[A-HJ-NP-Y2-9]{4}$/);  // no 0/1/O/I/Z
export const SessionIdSchema = z.string().uuid();
export const JoinRoomSchema = z.object({
  code: RoomCodeSchema,
  sessionId: SessionIdSchema,
  displayName: z.string().min(1).max(24),
});
export const CreateRoomSchema = z.object({
  sessionId: SessionIdSchema,
  displayName: z.string().min(1).max(24),
});
