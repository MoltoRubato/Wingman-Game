"use client";

import { HEARTS_TO_WIN, RUMOURS_TO_LOSE } from "@/lib/game/content";
import { TitleLogo, HeartToken, RumourToken } from "@/components/svg/ui-tokens";

type Props = {
  won: boolean;
  hearts: number;
  rumours: number;
  onPlayAgain: () => void;
  onExit: () => void;
};

const ENDINGS = {
  won: "The recipient meets them at the lower gate. No letter is opened. No letter needs to be.",
  lost: "The Rival walks out of the ballroom holding a hand the Suitor never reached.",
};

export const GameOverView = ({ won, hearts, rumours, onPlayAgain, onExit }: Props) => (
  <div className="splash splash--intro">
    <div className="splash-inner" style={{ maxWidth: 820 }}>
      <TitleLogo width={420} />
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 56,
          color: won ? "var(--heart)" : "var(--cream)",
          letterSpacing: "0.04em",
          margin: "20px 0 8px",
          textAlign: "center",
        }}
      >
        {won ? "The court approves." : "The court has decided."}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          color: "var(--cream)",
          textAlign: "center",
          margin: "0 0 32px",
          lineHeight: 1.45,
        }}
      >
        &quot;{won ? ENDINGS.won : ENDINGS.lost}&quot;
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 48,
          margin: "20px 0 36px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Hearts earned</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {Array.from({ length: HEARTS_TO_WIN }, (_, i) => (
              <HeartToken key={i} size={56} active={i < hearts} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Rumours gained</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {Array.from({ length: RUMOURS_TO_LOSE }, (_, i) => (
              <RumourToken key={i} size={56} active={i < rumours} />
            ))}
          </div>
        </div>
      </div>
      <div className="splash-controls">
        <button className="btn btn-ghost" onClick={onExit}>Exit</button>
        <button className="btn btn-primary" onClick={onPlayAgain}>Play another match</button>
      </div>
    </div>
  </div>
);
