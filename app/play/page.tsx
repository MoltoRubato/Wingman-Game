"use client";

import { useState } from "react";
import { HEARTS_TO_WIN, RUMOURS_TO_LOSE, RECIPIENTS, type RecipientKey } from "@/lib/game/content";
import type { RoundResult } from "@/lib/game/resolution";
import { Round } from "./_views/Round";
import { InterroundView } from "./_views/InterroundView";
import { GameOverView } from "./_views/GameOverView";
import { PORTRAITS } from "@/components/svg/portraits";
import { TitleLogo, HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import Link from "next/link";

type GamePhase = "menu" | "round" | "interround" | "gameover";

type PlayState = {
  hearts: number;
  rumours: number;
  roundNumber: number;
  lastOutcome: "success" | "fail" | "fail_blocking" | null;
};

const INITIAL: PlayState = { hearts: 0, rumours: 0, roundNumber: 1, lastOutcome: null };

export default function PlayPage() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [state, setState] = useState<PlayState>(INITIAL);
  const [pickedRecipient, setPickedRecipient] = useState<RecipientKey | undefined>();
  const [resetKey, setResetKey] = useState(0);

  const startGame = (recipient?: RecipientKey) => {
    setState(INITIAL);
    setPickedRecipient(recipient);
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
          initialRecipient={pickedRecipient}
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
        onContinue={() => {
          setPickedRecipient(undefined); // randomise next round
          setPhase("round");
        }}
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
        onPlayAgain={() => startGame()}
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

const Menu = ({ onStart }: { onStart: (r?: RecipientKey) => void }) => (
  <div className="splash">
    <div className="splash-inner" style={{ maxWidth: 980 }}>
      <TitleLogo width={520} />
      <p
        className="splash-prose"
        style={{ textAlign: "center", margin: "16px auto 28px", maxWidth: 640 }}
      >
        A two-player cooperative game of love, rivalry, and indirect communication.
        Hot-seat hand-off play. Reach <strong>{HEARTS_TO_WIN} Hearts</strong> before <strong>{RUMOURS_TO_LOSE} Rumours</strong>.
      </p>

      <div className="eyebrow" style={{ textAlign: "center", marginBottom: 12 }}>
        Choose tonight&apos;s first recipient (or let the court decide)
      </div>
      <div className="asset-grid asset-grid--portraits" style={{ marginTop: 8 }}>
        {(Object.keys(RECIPIENTS) as RecipientKey[]).map((k) => {
          const r = RECIPIENTS[k];
          const P = PORTRAITS[k];
          return (
            <button
              key={k}
              onClick={() => onStart(k)}
              className="asset-card"
              style={{
                background: "rgba(43,19,46,0.3)",
                cursor: "pointer",
                border: "1px solid rgba(201,196,212,0.2)",
              }}
            >
              <P w={240} h={300} />
              <div className="name">{r.name}</div>
              <div className="desc" style={{ minHeight: 40 }}>&quot;{r.bio}&quot;</div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "var(--gold-bright)",
                  marginTop: 4,
                }}
              >
                Likes {r.likes.join(", ").toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>
      <div className="splash-controls" style={{ marginTop: 32, gap: 16 }}>
        <Link href="/" className="btn btn-ghost">← Home</Link>
        <Link href="/library" className="btn btn-ghost">Asset library</Link>
        <button className="btn btn-primary" onClick={() => onStart()}>
          The court chooses → Begin
        </button>
      </div>
    </div>
  </div>
);
