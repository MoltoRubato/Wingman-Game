"use client";

import { ConfidantView, type ConfidantCommit } from "@/app/play/_views/ConfidantView";
import { adaptRound } from "./adapt";
import type { RoomView } from "@/lib/hooks/useRoomView";

type Props = {
  view: RoomView;
  onCommit?: (c: ConfidantCommit) => void;
};

export const ConfidantStep = ({ view, onCommit }: Props) => (
  <ConfidantView round={adaptRound(view)} onCommit={(c) => onCommit?.(c)} />
);
