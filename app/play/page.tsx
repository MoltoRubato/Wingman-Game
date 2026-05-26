"use client";

import { useState } from "react";
import { HEARTS_TO_WIN, RUMOURS_TO_LOSE } from "@/lib/game/content";
import type { RoundResult } from "@/lib/game/resolution";
import { Round } from "./_views/Round";
import { InterroundView } from "./_views/InterroundView";
import { GameOverView } from "./_views/GameOverView";
import { TitleLogo, HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import Link from "next/link";

type GamePhase = "menu" | "round" | "interround" | "gameover";

type PlayState = {
  hearts: number;
  rumours: number;
  roundNumber: number;
  lastOutcome: "success" | "fail" | null;
};

const INITIAL: PlayState = { hearts: 0, rumours: 0, roundNumber: 1, lastOutcome: null };

export default function PlayPage() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [state, setState] = useState<PlayState>(INITIAL);
  const [resetKey, setResetKey] = useState(0);

  const startGame = () => {
    setState(INITIAL);
    setPhase("round");
    setResetKey((k) => k + 1);
  };

  const handleRoundComplete = (result: RoundResult) => {
    const hearts = state.hearts + result.heartsDelta;
    const rumours = state.rumours + result.rumoursDelta;
    const nextState: PlayState = {
      hearts,
      rumours,
      roundNumber: state.roundNumber + 1,
      lastOutcome: result.outcome,
    };
    setState(nextState);
    if (hearts >= HEARTS_TO_WIN || rumours >= RUMOURS_TO_LOSE) {
      setPhase("gameover");
    } else {
      setPhase("interround");
    }
  };

  if (phase === "menu") {
    return <Menu onStart={startGame} />;
  }

  if (phase === "round") {
    return (
      <div className="proto-shell">
        <Banner hearts={state.hearts} rumours={state.rumours} round={state.roundNumber} />
        <Round
          key={`round-${resetKey}-${state.roundNumber}`}
          hearts={state.hearts}
          rumours={state.rumours}
          roundNumber={state.roundNumber}
          onRoundComplete={handleRoundComplete}
          onExit={() => setPhase("menu")}
        />
      </div>
    );
  }

  if (phase === "interround" && state.lastOutcome) {
    return (
      <InterroundView
        hearts={state.hearts}
        rumours={state.rumours}
        lastOutcome={state.lastOutcome}
        nextRoundNumber={state.roundNumber}
        onContinue={() => setPhase("round")}
        onExit={() => setPhase("menu")}
      />
    );
  }

  if (phase === "gameover") {
    return (
      <GameOverView
        won={state.hearts >= HEARTS_TO_WIN}
        hearts={state.hearts}
        rumours={state.rumours}
        onPlayAgain={startGame}
        onExit={() => {
          setState(INITIAL);
          setPhase("menu");
        }}
      />
    );
  }

  return null;
}

const Banner = ({ hearts, rumours, round }: { hearts: number; rumours: number; round: number }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      borderBottom: "1px dotted rgba(201,163,95,0.2)",
      marginBottom: 20,
      gap: 20,
      flexWrap: "wrap",
    }}
  >
    <div className="eyebrow">Round {round}</div>
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span className="eyebrow" style={{ marginRight: 8 }}>Hearts</span>
        {Array.from({ length: HEARTS_TO_WIN }, (_, i) => (
          <HeartToken key={i} size={28} active={i < hearts} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span className="eyebrow" style={{ marginRight: 8 }}>Rumours</span>
        {Array.from({ length: RUMOURS_TO_LOSE }, (_, i) => (
          <RumourToken key={i} size={28} active={i < rumours} />
        ))}
      </div>
    </div>
  </div>
);

const Menu = ({ onStart }: { onStart: () => void }) => (
  <div className="splash">
    <div className="splash-inner" style={{ maxWidth: 900 }}>
      <TitleLogo width={520} />
      <p className="splash-prose" style={{ textAlign: "center", margin: "16px auto 28px", maxWidth: 680 }}>
        A two-player game of hidden truth and symbolic trust. The Confidant places exactly two signals.
        The Suitor chooses one route and one tone. First to <strong>{HEARTS_TO_WIN} Hearts</strong> wins.
      </p>
      <div className="rule-glossary" style={{ margin: "0 auto 28px", maxWidth: 620 }}>
        {(Object.entries(SIGNAL_COMPONENTS) as [keyof typeof SIGNAL_COMPONENTS, (typeof SIGNAL_COMPONENTS)[keyof typeof SIGNAL_COMPONENTS]][]).map(([key, Sig]) => (
          <div key={key} className="gloss-row">
            <Sig size={44} />
            <div>
              <div className="gloss-name">{SIGNAL_META[key].label}</div>
              <div className="gloss-hint">{SIGNAL_META[key].hint}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="splash-controls" style={{ marginTop: 24, gap: 16 }}>
        <Link href="/" className="btn btn-ghost">Home</Link>
        <Link href="/rules" className="btn btn-ghost">Rules</Link>
        <button className="btn btn-primary" onClick={onStart} type="button">
          Begin hot-seat match
        </button>
      </div>
    </div>
  </div>
);
