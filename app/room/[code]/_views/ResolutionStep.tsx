"use client";

import { ResolutionView } from "@/app/play/_views/ResolutionView";
import { adaptResolutionRound, getResult } from "./adapt";
import type { RoomView } from "@/lib/hooks/useRoomView";

type Props = {
  view: RoomView;
  onContinue: () => void;
};

export const ResolutionStep = ({ view, onContinue }: Props) => {
  const result = getResult(view);
  if (!result) return null;
  const round = adaptResolutionRound(view);
  const narrative =
    result.outcome === "success"
      ? "The Suitor finds the right corner of the gallery, at the right moment."
      : "A fan opens. A name is mouthed behind it.";
  return (
    <ResolutionView
      round={round}
      result={result}
      narrative={narrative}
      onContinue={onContinue}
      onReplay={onContinue}
    />
  );
};
