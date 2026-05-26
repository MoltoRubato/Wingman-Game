import type { RoomView } from "@/lib/hooks/useRoomView";
import type { RoundInstance } from "@/lib/game/createRound";
import type { RoundResult } from "@/lib/game/resolution";
import type { ConfidantAction, RouteKey, Signal, ToneKey } from "@/lib/game/content";
import type { ResolvedRound } from "@/app/play/_views/Round";

export function adaptRound(view: RoomView): RoundInstance {
  const r = view.round!;
  return {
    moodKey: r.mood_key ?? "tender",
    dangerRouteKey: r.danger_route ?? "fast",
    rivalRouteKey: r.rival_route ?? "fast",
    routes: r.routes,
    clues: r.clues ?? [],
    heartsEarnedSoFar: view.game?.hearts ?? 0,
    rumoursSoFar: view.game?.rumours ?? 0,
    intention: r.intention,
    recipientName: r.recipient,
  };
}

export function adaptSignals(view: RoomView): Signal[] {
  return view.round?.signals ?? [];
}

export function adaptResolutionRound(view: RoomView): ResolvedRound {
  const base = adaptRound(view);
  const r = view.round!;
  return {
    ...base,
    signals: r.signals ?? [],
    confidantAction: (r.confidant_action ?? "clear_danger") as ConfidantAction,
    suitorChosenRouteKey: r.chosen_route as RouteKey,
    suitorToneKey: r.suitor_tone as ToneKey,
  };
}

export function getResult(view: RoomView): RoundResult | undefined {
  return view.round?.result;
}
