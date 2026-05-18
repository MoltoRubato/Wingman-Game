"use client";

import { use, useEffect, useState } from "react";
import { useRoomView, sendAction, type RoomView } from "@/lib/hooks/useRoomView";
import { getSessionId } from "@/lib/session";
import { Lobby } from "./_views/Lobby";
import { WaitingFor } from "./_views/WaitingFor";
import { ConfidantStep } from "./_views/ConfidantStep";
import { SuitorStep } from "./_views/SuitorStep";
import { ResolutionStep } from "./_views/ResolutionStep";
import { GameOverStep } from "./_views/GameOverStep";
import { HEARTS_TO_WIN, RUMOURS_TO_LOSE } from "@/lib/game/content";
import { HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import Link from "next/link";

type Params = Promise<{ code: string }>;

export default function RoomPage({ params }: { params: Params }) {
  const { code } = use(params);
  const { view, error, refetch, sessionId } = useRoomView(code);
  const [autoJoined, setAutoJoined] = useState(false);

  /* Auto-join the room if this session isn't already a member. */
  useEffect(() => {
    if (!view || autoJoined) return;
    if (view.self_slot == null) {
      fetch("/api/rooms/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), code }),
      })
        .then(() => refetch())
        .finally(() => setAutoJoined(true));
    } else {
      setAutoJoined(true);
    }
  }, [view, autoJoined, code, refetch]);

  if (error) {
    return <ErrorScreen code={code} error={error} />;
  }
  if (!view) {
    return <CenteredMessage>Opening the room…</CenteredMessage>;
  }
  if (view.self_slot == null) {
    return <CenteredMessage>Knocking at the door…</CenteredMessage>;
  }

  if (view.status === "lobby" || !view.round) {
    return <Lobby code={code} players={view.players ?? []} selfSlot={view.self_slot} />;
  }

  const round = view.round;
  const game = view.game!;
  const isSuitor = view.self_slot === round.suitor_slot;

  /* Game-over screen has its own banner. */
  if (round.current_phase === "gameover") {
    return (
      <GameOverStep
        won={game.status === "won"}
        hearts={game.hearts}
        rumours={game.rumours}
        onPlayAgain={() => location.assign("/")}
      />
    );
  }

  /* Phase routing. */
  const fire = (action: object) => sendAction(code, sessionId, action).catch(() => refetch());

  let body: React.ReactNode;
  switch (round.current_phase) {
    case "confidant":
      body = isSuitor ? (
        <WaitingFor title="The Confidant is choosing in silence">
          Three private clues are being weighed. Signals will appear on the routes when they hand the letter to you.
        </WaitingFor>
      ) : (
        <ConfidantStep view={view} onCommit={(c) => fire({ type: "confidant_commit", ...c })} />
      );
      break;
    case "tone":
      body = isSuitor ? (
        <SuitorStep
          view={view}
          subphase="tone"
          onSubmitTone={(tone) => fire({ type: "suitor_tone", tone })}
        />
      ) : (
        <WaitingFor title="The Suitor is choosing a tone">
          They have seen your signals. They are deciding how to write the letter.
        </WaitingFor>
      );
      break;
    case "question":
      body = isSuitor ? (
        <SuitorStep
          view={view}
          subphase="question"
          onAskQuestion={(route) => fire({ type: "ask_question", route })}
          onSkipQuestion={() => fire({ type: "skip_question" })}
        />
      ) : (
        <WaitingFor title="The Suitor may ask one question">
          They have one Question Token. They may use it or skip it.
        </WaitingFor>
      );
      break;
    case "answer":
      body = isSuitor ? (
        <WaitingFor title="Your Confidant is answering">
          One word only: Trust, Danger, or Unsure.
        </WaitingFor>
      ) : (
        <ConfidantStep view={view} awaitingQuestion onAnswer={(answer) => fire({ type: "answer_question", answer })} />
      );
      break;
    case "route":
      body = isSuitor ? (
        <SuitorStep
          view={view}
          subphase="route"
          onChooseRoute={(route, suitorCard) =>
            fire({ type: "choose_route", route, suitor_card: suitorCard })
          }
        />
      ) : (
        <WaitingFor title="The Suitor is sending the letter">
          Their choice will reveal everything.
        </WaitingFor>
      );
      break;
    case "resolution":
      body = (
        <ResolutionStep
          view={view}
          onContinue={() => fire({ type: "next_round" })}
        />
      );
      break;
    default:
      body = <CenteredMessage>Unrecognised phase: {round.current_phase}</CenteredMessage>;
  }

  return (
    <div className="proto-shell">
      <TopBanner view={view} />
      {body}
    </div>
  );
}

const TopBanner = ({ view }: { view: RoomView }) => {
  const game = view.game;
  if (!game) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        gap: 18,
        borderBottom: "1px dotted rgba(201,163,95,0.2)",
        marginBottom: 18,
        flexWrap: "wrap",
      }}
    >
      <div>
        <span className="eyebrow" style={{ marginRight: 12 }}>Room</span>
        <strong
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--gold-bright)",
            letterSpacing: "0.18em",
          }}
        >
          {view.code}
        </strong>
        <span className="eyebrow" style={{ marginLeft: 18 }}>Round {game.round_number}</span>
        <span className="eyebrow" style={{ marginLeft: 18 }}>
          You are slot {view.self_slot}
        </span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: HEARTS_TO_WIN }, (_, i) => (
            <HeartToken key={i} size={26} active={i < game.hearts} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: RUMOURS_TO_LOSE }, (_, i) => (
            <RumourToken key={i} size={26} active={i < game.rumours} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="splash">
    <div className="splash-inner" style={{ maxWidth: 540, textAlign: "center" }}>
      <div className="eyebrow">{children}</div>
    </div>
  </div>
);

const ErrorScreen = ({ code, error }: { code: string; error: string }) => (
  <div className="splash">
    <div className="splash-inner" style={{ maxWidth: 640, textAlign: "center" }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          color: "#ff9a9a",
          fontWeight: 500,
          margin: "12px 0",
        }}
      >
        The court is closed
      </h2>
      <p style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: 17, fontStyle: "italic" }}>
        Room <strong>{code}</strong> reports: <code style={{ color: "#ff9a9a" }}>{error}</code>.
      </p>
      <div className="splash-controls" style={{ marginTop: 24 }}>
        <Link href="/" className="btn btn-ghost">← Home</Link>
        <Link href="/host" className="btn btn-primary">Host a new room</Link>
      </div>
    </div>
  </div>
);
