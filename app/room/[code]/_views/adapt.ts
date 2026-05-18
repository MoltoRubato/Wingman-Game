import type { RoomView } from "@/lib/hooks/useRoomView";
import type { RoundInstance } from "@/lib/game/createRound";
import type { RoundResult } from "@/lib/game/resolution";
import type {
  RecipientKey,
  RIVAL_TRAITS,
  RouteKey,
  ToneKey,
} from "@/lib/game/content";

/** Convert the server's redacted round payload into the RoundInstance shape
 *  the existing views (ConfidantView / SuitorView) were written against. */
export function adaptRound(view: RoomView): RoundInstance {
  const r = view.round!;
  return {
    recipientKey: r.recipient as RecipientKey,
    intention: r.intention,
    routes: r.routes.map((rt) => ({
      key: rt.key as RouteKey,
      baseTime: rt.baseTime,
      obstacles: rt.obstacles as RoundInstance["routes"][number]["obstacles"],
      originalObstacles: rt.originalObstacles as RoundInstance["routes"][number]["originalObstacles"],
    })),
    rivalRouteKey: (r.rival_route ?? "garden") as RouteKey,
    rivalTraitKey: (r.rival_trait ?? "fast_courier") as keyof typeof RIVAL_TRAITS,
    confidantHand: r.confidant_hand ?? [],
    suitorHand: r.suitor_hand ?? [],
    clues: r.clues ?? [],
    heartsEarnedSoFar: view.game?.hearts ?? 0,
    rumoursSoFar: view.game?.rumours ?? 0,
  };
}

export type AdaptedSignals = Array<{ type: string; target: string }>;

export function adaptSignals(view: RoomView): AdaptedSignals {
  return view.round?.signals ?? [];
}

export function adaptResolutionRound(view: RoomView): RoundInstance & {
  suitorChosenRouteKey: RouteKey;
  suitorToneKey: ToneKey;
} {
  const base = adaptRound(view);
  const r = view.round!;
  return {
    ...base,
    suitorChosenRouteKey: r.chosen_route as RouteKey,
    suitorToneKey: r.suitor_tone as ToneKey,
  };
}

export function getResult(view: RoomView): RoundResult | undefined {
  return view.round?.result;
}
