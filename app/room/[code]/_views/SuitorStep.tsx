"use client";

import { SuitorView } from "@/app/play/_views/SuitorView";
import { adaptRound, adaptSignals } from "./adapt";
import type { RoomView } from "@/lib/hooks/useRoomView";
import type { RouteKey, ToneKey } from "@/lib/game/content";

type Props = {
  view: RoomView;
  onChoose?: (choice: { tone: ToneKey; route: RouteKey }) => void;
};

export const SuitorStep = ({ view, onChoose }: Props) => (
  <SuitorView round={adaptRound(view)} confidantSignals={adaptSignals(view)} onChoose={(choice) => onChoose?.(choice)} />
);
