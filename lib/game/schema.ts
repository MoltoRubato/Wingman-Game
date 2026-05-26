/**
 * Zod schemas for the simplified Rival Hearts API boundary.
 */

import { z } from "zod";

export const RouteKeySchema = z.enum(["fast", "safe", "secret"]);
export const ToneKeySchema = z.enum(["tender", "bold", "honest"]);
export const MoodKeySchema = ToneKeySchema;
export const SignalTypeSchema = z.enum(["heart", "thorn", "clock", "mask"]);
export const ConfidantActionSchema = z.enum(["clear_danger", "delay_rival", "strengthen_letter"]);
export const PhaseSchema = z.enum(["lobby", "confidant", "suitor", "resolution", "gameover"]);

export const SignalSchema = z.object({
  type: SignalTypeSchema,
  target: z.string().regex(/^(route:(fast|safe|secret)|tone:(tender|bold|honest))$/),
});

export const ConfidantCommitSchema = z.object({
  type: z.literal("confidant_commit"),
  signals: z.array(SignalSchema).length(2),
  action: ConfidantActionSchema,
});

export const SuitorChooseSchema = z.object({
  type: z.literal("suitor_choose"),
  tone: ToneKeySchema,
  route: RouteKeySchema,
});

export const ActionSchema = z.discriminatedUnion("type", [
  ConfidantCommitSchema,
  SuitorChooseSchema,
  z.object({ type: z.literal("next_round") }),
]);
export type ActionPayload = z.infer<typeof ActionSchema>;

export const RoundSnapshotSchema = z.object({
  moodKey: MoodKeySchema,
  dangerRouteKey: RouteKeySchema,
  rivalRouteKey: RouteKeySchema,
  confidantAction: ConfidantActionSchema,
  signals: z.array(SignalSchema).length(2),
  suitorToneKey: ToneKeySchema,
  suitorChosenRouteKey: RouteKeySchema,
  heartsEarnedSoFar: z.number().int().min(0),
  rumoursSoFar: z.number().int().min(0),
});

export const RoomCodeSchema = z.string().regex(/^[A-HJ-NP-Y2-9]{4}$/);
export const SessionIdSchema = z.string().uuid();
export const JoinRoomSchema = z.object({
  code: RoomCodeSchema,
  sessionId: SessionIdSchema,
  displayName: z.string().min(1).max(24).optional(),
});
export const CreateRoomSchema = z.object({
  sessionId: SessionIdSchema,
  displayName: z.string().min(1).max(24).optional(),
});
