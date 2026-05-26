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
  return (
    <ResolutionView
      round={adaptResolutionRound(view)}
      result={result}
      onContinue={onContinue}
      onReplay={onContinue}
    />
  );
};
