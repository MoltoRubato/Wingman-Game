"use client";

import { HEARTS_TO_WIN, RUMOURS_TO_LOSE } from "@/lib/game/content";
import { HeartToken, RumourToken } from "@/components/svg/ui-tokens";

const HEART_BEATS = [
  { at: 1, text: "The first letter arrives. The recipient smiles, alone, in a corner of the gallery." },
  { at: 2, text: "A ribbon is returned with no message. It is the answer." },
  { at: 3, text: "Word travels through the kitchens — quietly, fondly — that the Suitor is not what the court assumed." },
  { at: 4, text: "At the masquerade, the recipient leaves the dance to find them. The court understands. The court approves." },
];

const RUMOUR_BEATS = [
  { at: 1, text: "A fan opens. A name is mouthed behind it." },
  { at: 2, text: "Two letters arrive at the wrong addresses. Both are read aloud." },
  { at: 3, text: "By morning, the affair is in three languages and none of them is true." },
];

type Props = {
  hearts: number;
  rumours: number;
  lastOutcome: "success" | "fail" | "fail_blocking";
  nextRoundNumber: number;
  onContinue: () => void;
  onExit: () => void;
};

export const InterroundView = ({ hearts, rumours, lastOutcome, nextRoundNumber, onContinue, onExit }: Props) => {
  const beat = lastOutcome === "success"
    ? HEART_BEATS.find((b) => b.at === hearts)
    : rumours > 0 ? RUMOUR_BEATS.find((b) => b.at === rumours) : null;

  return (
    <div className="splash splash--intro">
      <div className="splash-inner" style={{ maxWidth: 720 }}>
        <div className="eyebrow" style={{ textAlign: "center", marginBottom: 20 }}>
          The court turns the page
        </div>
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Hearts</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {Array.from({ length: HEARTS_TO_WIN }, (_, i) => (
                <HeartToken key={i} size={44} active={i < hearts} />
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Rumours</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {Array.from({ length: RUMOURS_TO_LOSE }, (_, i) => (
                <RumourToken key={i} size={44} active={i < rumours} />
              ))}
            </div>
          </div>
        </div>
        {beat && (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.45,
              textAlign: "center",
              color: "var(--cream)",
              margin: "16px 0 28px",
            }}
          >
            &quot;{beat.text}&quot;
          </p>
        )}
        <p
          style={{
            textAlign: "center",
            color: "var(--cream-shadow)",
            fontSize: 13,
            letterSpacing: "0.1em",
            marginBottom: 24,
          }}
        >
          The next round begins. Roles will rotate.
        </p>
        <div className="splash-controls">
          <button className="btn btn-ghost" onClick={onExit}>← Exit</button>
          <button className="btn btn-primary" onClick={onContinue}>
            Begin round {nextRoundNumber} →
          </button>
        </div>
      </div>
    </div>
  );
};
