"use client";

import { ConfidantView, type ConfidantCommit } from "@/app/play/_views/ConfidantView";
import { adaptRound } from "./adapt";
import type { RoomView } from "@/lib/hooks/useRoomView";
import type { RouteKey } from "@/lib/game/content";

type Props = {
  view: RoomView;
  onCommit?: (c: ConfidantCommit) => void;
  awaitingQuestion?: boolean;
  onAnswer?: (a: "Trust" | "Danger" | "Unsure") => void;
};

export const ConfidantStep = ({ view, onCommit, awaitingQuestion, onAnswer }: Props) => {
  const round = adaptRound(view);
  if (awaitingQuestion) {
    const askedRoute = view.round?.question?.route as RouteKey | undefined;
    if (!askedRoute || !onAnswer) return null;
    return (
      <ConfidantView
        round={round}
        onCommit={() => {}}
        awaitingQuestion
        suitorQuestion={askedRoute}
        onAnswer={onAnswer}
      />
    );
  }
  return (
    <ConfidantView
      round={round}
      onCommit={(c) => onCommit?.(c)}
    />
  );
};
