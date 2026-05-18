"use client";

import { useMemo, useState } from "react";
import { RECIPIENTS, type RecipientKey, type RouteKey, type ToneKey } from "@/lib/game/content";
import { createRound, type RoundInstance } from "@/lib/game/createRound";
import { resolveRound, type RoundResult, type RoundSnapshot } from "@/lib/game/resolution";
import { ConfidantView, type ConfidantCommit } from "./ConfidantView";
import { SuitorView } from "./SuitorView";
import { ResolutionView } from "./ResolutionView";
import { HandoffSplash } from "./HandoffSplash";
import { TitleLogo } from "@/components/svg/ui-tokens";

type Props = {
  initialRecipient?: RecipientKey;
  hearts: number;
  rumours: number;
  roundNumber: number;
  onRoundComplete: (result: RoundResult) => void;
  onExit: () => void;
};

type Phase =
  | "intro"
  | "confidant"
  | "handoff_to_suitor"
  | "tone"
  | "question"
  | "handoff_to_confidant"
  | "answer"
  | "handoff_to_suitor_2"
  | "route_post_answer"
  | "route"
  | "resolution";

export const Round = ({ initialRecipient, hearts, rumours, roundNumber, onRoundComplete, onExit }: Props) => {
  const seed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);
  const round: RoundInstance = useMemo(
    () => createRound(seed, { recipient: initialRecipient, hearts, rumours }),
    [seed, initialRecipient, hearts, rumours],
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [signals, setSignals] = useState<ConfidantCommit["signals"]>([]);
  const [played, setPlayed] = useState<ConfidantCommit["played"]>([]);
  const [tone, setTone] = useState<ToneKey | null>(null);
  const [askedRoute, setAskedRoute] = useState<RouteKey | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState<"Trust" | "Danger" | "Unsure" | null>(null);
  const [chosenRoute, setChosenRoute] = useState<RouteKey | null>(null);
  const [suitorPlayed, setSuitorPlayed] = useState<string | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);

  /* Apply card targeting effects to routes (clear gossip, distract guard, etc.). */
  const effectiveRound: RoundInstance = useMemo(() => {
    if (played.length === 0) return round;
    const routes = round.routes.map((r) => ({ ...r, obstacles: [...r.obstacles] }));
    for (const p of played) {
      if (!p.routeTarget) continue;
      const tgt = routes.find((r) => r.key === p.routeTarget);
      if (!tgt) continue;
      if (p.key === "distract_guard") tgt.obstacles = tgt.obstacles.filter((o) => o !== "guard");
      if (p.key === "clear_gossip") tgt.obstacles = tgt.obstacles.filter((o) => o !== "gossip");
      if (p.key === "find_key") tgt.obstacles = tgt.obstacles.filter((o) => o !== "locked_door");
      if (p.key === "correct_address") tgt.obstacles = tgt.obstacles.filter((o) => o !== "false_address");
    }
    return { ...round, routes };
  }, [round, played]);

  const handleConfidantCommit = (c: ConfidantCommit) => {
    setSignals(c.signals);
    setPlayed(c.played);
    setPhase("handoff_to_suitor");
  };

  const handleSuitorTone = (t: ToneKey) => {
    setTone(t);
    setPhase("question");
  };

  const handleAskQuestion = (r: RouteKey) => {
    setAskedRoute(r);
    setPhase("handoff_to_confidant");
  };

  const handleSkipQuestion = () => setPhase("route");

  const handleAnswerQuestion = (ans: "Trust" | "Danger" | "Unsure") => {
    setQuestionAnswer(ans);
    setPhase("handoff_to_suitor_2");
  };

  const handleChooseRoute = (r: RouteKey, suitorCard: string | null) => {
    setChosenRoute(r);
    setSuitorPlayed(suitorCard);

    if (!tone) return;
    const snap: RoundSnapshot = {
      recipientKey: round.recipientKey,
      intention: round.intention,
      routes: effectiveRound.routes,
      rivalRouteKey: round.rivalRouteKey,
      rivalTraitKey: round.rivalTraitKey,
      confidantPlayed: played.map((p) => p.key),
      suitorPlayed: suitorCard as RoundSnapshot["suitorPlayed"],
      suitorToneKey: tone,
      suitorChosenRouteKey: r,
      heartsEarnedSoFar: hearts,
      rumoursSoFar: rumours,
      gossipOnRivalRoute: effectiveRound.routes
        .find((rt) => rt.key === round.rivalRouteKey)!
        .obstacles.includes("gossip"),
    };
    const res = resolveRound(snap);
    setResult(res);
    setPhase("resolution");
  };

  if (phase === "intro") {
    return <IntroSplash round={round} roundNumber={roundNumber} onContinue={() => setPhase("confidant")} onExit={onExit} />;
  }
  if (phase === "confidant") {
    return <ConfidantView round={round} onCommit={handleConfidantCommit} />;
  }
  if (phase === "handoff_to_suitor") {
    return <HandoffSplash to="Suitor" sub="Pass the device, eyes only" onContinue={() => setPhase("tone")} />;
  }
  if (phase === "tone") {
    return (
      <SuitorView
        round={effectiveRound}
        confidantSignals={signals}
        subphase="tone"
        onSubmitTone={handleSuitorTone}
      />
    );
  }
  if (phase === "question") {
    return (
      <SuitorView
        round={effectiveRound}
        confidantSignals={signals}
        subphase="question"
        onAskQuestion={handleAskQuestion}
        onSkipQuestion={handleSkipQuestion}
      />
    );
  }
  if (phase === "handoff_to_confidant") {
    return <HandoffSplash to="Confidant" sub="Answer one word and pass back" onContinue={() => setPhase("answer")} />;
  }
  if (phase === "answer" && askedRoute) {
    return (
      <ConfidantView
        round={round}
        onCommit={() => {}}
        awaitingQuestion
        suitorQuestion={askedRoute}
        onAnswer={handleAnswerQuestion}
      />
    );
  }
  if (phase === "handoff_to_suitor_2") {
    return (
      <HandoffSplash
        to="Suitor"
        sub="They answered. Make your choice."
        onContinue={() => setPhase("route_post_answer")}
      />
    );
  }
  if (phase === "route_post_answer") {
    return (
      <SuitorView
        round={effectiveRound}
        confidantSignals={signals}
        subphase="question"
        onSkipQuestion={() => setPhase("route")}
        questionAnswer={questionAnswer}
      />
    );
  }
  if (phase === "route") {
    return (
      <SuitorView
        round={effectiveRound}
        confidantSignals={signals}
        subphase="route"
        onChooseRoute={handleChooseRoute}
        questionAnswer={questionAnswer}
      />
    );
  }
  if (phase === "resolution" && result && chosenRoute && tone) {
    const finalRound = {
      ...effectiveRound,
      suitorChosenRouteKey: chosenRoute,
      suitorToneKey: tone,
    };
    const narrative = result.outcome === "success"
      ? "The Suitor finds the right corner of the gallery, at the right moment."
      : "A fan opens. A name is mouthed behind it.";
    return (
      <ResolutionView
        round={finalRound}
        result={result}
        narrative={narrative}
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
}) => {
  const recipient = RECIPIENTS[round.recipientKey];
  return (
    <div className="splash splash--intro">
      <div className="splash-inner">
        <TitleLogo width={420} />
        <div className="splash-meta">
          <div className="splash-meta-row">
            <span className="eyebrow">Round</span>
            <strong>{roundNumber}</strong>
          </div>
          <div className="splash-meta-row">
            <span className="eyebrow">Tonight&apos;s recipient</span>
            <strong>{recipient.name}</strong>
          </div>
          <div className="splash-meta-row">
            <span className="eyebrow">The letter&apos;s intention</span>
            <strong>{round.intention}</strong>
          </div>
          <div className="splash-meta-row">
            <span className="eyebrow">Your role this round</span>
            <strong>The Confidant — Plum &amp; Silver</strong>
          </div>
        </div>
        <p className="splash-prose">
          Three private clues are about to be shown to you only. You have three Action Points and may place up to three
          signal tokens. The Suitor will see your signals — never your clues — and make their choice.
          <br />
          <br />
          Court Silence is in force. There is no chat. The pleasure is in being almost-understood.
        </p>
        <div className="splash-controls">
          <button className="btn btn-ghost" onClick={onExit}>
            ← Exit
          </button>
          <button className="btn btn-primary" onClick={onContinue}>
            Begin the round →
          </button>
        </div>
      </div>
    </div>
  );
};
