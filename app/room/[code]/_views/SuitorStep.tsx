"use client";

import { SuitorView, type Subphase } from "@/app/play/_views/SuitorView";
import { adaptRound, adaptSignals } from "./adapt";
import type { RoomView } from "@/lib/hooks/useRoomView";
import type { RouteKey, ToneKey } from "@/lib/game/content";

type Props = {
  view: RoomView;
  subphase: Subphase;
  onSubmitTone?: (t: ToneKey) => void;
  onAskQuestion?: (r: RouteKey) => void;
  onSkipQuestion?: () => void;
  onChooseRoute?: (r: RouteKey, suitorCard: string | null) => void;
};

export const SuitorStep = ({
  view,
  subphase,
  onSubmitTone,
  onAskQuestion,
  onSkipQuestion,
  onChooseRoute,
}: Props) => {
  const round = adaptRound(view);
  const signals = adaptSignals(view).map((s) => ({
    type: s.type as Parameters<typeof SuitorView>[0]["confidantSignals"][number]["type"],
    target: s.target,
  }));
  const questionAnswer = view.round?.question?.answer as "Trust" | "Danger" | "Unsure" | null | undefined;
  return (
    <SuitorView
      round={round}
      confidantSignals={signals}
      subphase={subphase}
      onSubmitTone={onSubmitTone}
      onAskQuestion={onAskQuestion}
      onSkipQuestion={onSkipQuestion}
      onChooseRoute={onChooseRoute}
      questionAnswer={questionAnswer ?? null}
    />
  );
};
