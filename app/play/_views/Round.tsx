"use client";

import { useMemo, useState } from "react";
import { createRound, type RoundInstance } from "@/lib/game/createRound";
import { resolveRound, type RoundResult, type RoundSnapshot } from "@/lib/game/resolution";
import { type ConfidantAction, type RouteKey, type Signal, type ToneKey } from "@/lib/game/content";
import { ConfidantView, type ConfidantCommit } from "./ConfidantView";
import { SuitorView } from "./SuitorView";
import { ResolutionView } from "./ResolutionView";
import { HandoffSplash } from "./HandoffSplash";
import { TitleLogo } from "@/components/svg/ui-tokens";

type Props = {
  hearts: number;
  rumours: number;
  roundNumber: number;
  onRoundComplete: (result: RoundResult) => void;
  onExit: () => void;
};

type Phase = "intro" | "confidant" | "handoff_to_suitor" | "suitor" | "resolution";

export type ResolvedRound = RoundInstance & {
  signals: Signal[];
  confidantAction: ConfidantAction;
  suitorChosenRouteKey: RouteKey;
  suitorToneKey: ToneKey;
};

export const Round = ({ hearts, rumours, roundNumber, onRoundComplete, onExit }: Props) => {
  const seed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);
  const round = useMemo(() => createRound(seed, { hearts, rumours }), [seed, hearts, rumours]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [confidantAction, setConfidantAction] = useState<ConfidantAction | null>(null);
  const [tone, setTone] = useState<ToneKey | null>(null);
  const [chosenRoute, setChosenRoute] = useState<RouteKey | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);

  const handleConfidantCommit = (commit: ConfidantCommit) => {
    setSignals(commit.signals);
    setConfidantAction(commit.action);
    setPhase("handoff_to_suitor");
  };

  const handleSuitorChoose = ({ tone: toneKey, route }: { tone: ToneKey; route: RouteKey }) => {
    if (!confidantAction) return;
    setTone(toneKey);
    setChosenRoute(route);

    const snap: RoundSnapshot = {
      moodKey: round.moodKey,
      dangerRouteKey: round.dangerRouteKey,
      rivalRouteKey: round.rivalRouteKey,
      confidantAction,
      signals,
      suitorToneKey: toneKey,
      suitorChosenRouteKey: route,
      heartsEarnedSoFar: hearts,
      rumoursSoFar: rumours,
    };
    setResult(resolveRound(snap));
    setPhase("resolution");
  };

  if (phase === "intro") {
    return <IntroSplash round={round} roundNumber={roundNumber} onContinue={() => setPhase("confidant")} onExit={onExit} />;
  }
  if (phase === "confidant") {
    return <ConfidantView round={round} onCommit={handleConfidantCommit} />;
  }
  if (phase === "handoff_to_suitor") {
    return <HandoffSplash to="Suitor" sub="The truth has been encoded. Read carefully." onContinue={() => setPhase("suitor")} />;
  }
  if (phase === "suitor") {
    return <SuitorView round={round} confidantSignals={signals} onChoose={handleSuitorChoose} />;
  }
  if (phase === "resolution" && result && chosenRoute && tone && confidantAction) {
    const resolvedRound: ResolvedRound = {
      ...round,
      signals,
      confidantAction,
      suitorChosenRouteKey: chosenRoute,
      suitorToneKey: tone,
    };
    return (
      <ResolutionView
        round={resolvedRound}
        result={result}
        onContinue={() => onRoundComplete(result)}
        onReplay={() => onRoundComplete(result)}
      />
    );
  }

  return null;
};

const IntroSplash = ({
  round,
  roundNumber,
  onContinue,
  onExit,
}: {
  round: RoundInstance;
  roundNumber: number;
  onContinue: () => void;
  onExit: () => void;
}) => (
  <div className="splash splash--intro">
    <div className="splash-inner">
      <TitleLogo width={420} />
      <div className="splash-meta">
        <div className="splash-meta-row">
          <span className="eyebrow">Round</span>
          <strong>{roundNumber}</strong>
        </div>
        <div className="splash-meta-row">
          <span className="eyebrow">Recipient</span>
          <strong>{round.recipientName}</strong>
        </div>
        <div className="splash-meta-row">
          <span className="eyebrow">Your role first</span>
          <strong>The Confidant</strong>
        </div>
      </div>
      <p className="splash-prose">
        The Confidant sees the mood, danger route, and Rival route. They place exactly two signals and choose one secret action.
        The Suitor then chooses one tone and one route from those clues.
      </p>
      <div className="splash-controls">
        <button className="btn btn-ghost" onClick={onExit} type="button">
          Exit
        </button>
        <button className="btn btn-primary" onClick={onContinue} type="button">
          Begin the round
        </button>
      </div>
    </div>
  </div>
);
