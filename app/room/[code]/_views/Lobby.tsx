"use client";

import { useState, useEffect } from "react";
import { TitleLogo } from "@/components/svg/ui-tokens";
import Link from "next/link";

type Props = {
  code: string;
  selfSlot: number;
  players: Array<{ slot: number; joined_at: string }>;
};

export const Lobby = ({ code, selfSlot, players }: Props) => {
  const [copied, setCopied] = useState(false);

  const slotsFilled = players.length;
  const partnerHere = slotsFilled === 2;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* ignored */
    }
  };

  return (
    <div className="splash">
      <div className="splash-inner" style={{ maxWidth: 720 }}>
        <TitleLogo width={460} />
        <div className="splash-meta">
          <div className="splash-meta-row">
            <span className="eyebrow">Your room</span>
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 56,
                color: "var(--gold-bright)",
                letterSpacing: "0.22em",
              }}
            >
              {code}
            </strong>
          </div>
          <div className="splash-meta-row">
            <span className="eyebrow">You are</span>
            <strong>Slot {selfSlot}</strong>
          </div>
          <div className="splash-meta-row">
            <span className="eyebrow">Players in the room</span>
            <strong>{slotsFilled} / 2</strong>
          </div>
        </div>
        <p className="splash-prose" style={{ textAlign: "center" }}>
          {partnerHere
            ? "The court convenes. The first round is being prepared…"
            : "Share the code with your partner. They can join from the home page → Join match. As soon as they arrive, the game begins."}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, margin: "18px 0 24px", flexWrap: "wrap" }}>
          {players.map((p) => (
            <div key={p.slot} className="seat-token">
              <div className="seat-token-num">{p.slot}</div>
              <div className="eyebrow" style={{ marginTop: 8 }}>
                Slot {p.slot} - {p.slot === selfSlot ? "you" : "your partner"}
              </div>
            </div>
          ))}
          {!partnerHere && (
            <div className="seat-token seat-token--empty">
              <div className="seat-token-num">?</div>
              <div className="eyebrow" style={{ marginTop: 8 }}>Empty seat</div>
            </div>
          )}
        </div>
        <div className="splash-controls">
          <Link href="/" className="btn btn-ghost">← Home</Link>
          <button className="btn" onClick={copy} disabled={!navigator?.clipboard}>
            {copied ? "Copied!" : "Copy room code"}
          </button>
        </div>
      </div>
    </div>
  );
};
