"use client";

import { useEffect, useState } from "react";
import { CONFIDANT_ACTIONS, ROUTES, TONES } from "@/lib/game/content";
import type { RoundResult } from "@/lib/game/resolution";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { SIGNAL_COMPONENTS } from "@/components/svg/signals";
import { HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import type { ResolvedRound } from "./Round";

type Props = {
  round: ResolvedRound;
  result: RoundResult;
  onContinue: () => void;
  onReplay: () => void;
};

export const ResolutionView = ({ round, result, onContinue, onReplay }: Props) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1100),
      setTimeout(() => setStage(3), 1700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const success = result.outcome === "success";
  const ChosenRouteArt = ROUTE_COMPONENTS[round.suitorChosenRouteKey];

  return (
    <div className="rv">
      <header className="rv-header">
        <div className="rv-title">The court reads the result</div>
        <div className="rv-sub">{round.recipientName} receives the letter</div>
      </header>

      <section className={`rv-stage rv-routes ${stage >= 1 ? "in" : ""}`}>
        <div className="rv-side rv-suitor-side">
          <div className="eyebrow">Suitor chose</div>
          <div className="rv-route-card">
            <ChosenRouteArt w={380} h={190} />
            <div className="rv-route-name">{ROUTE_META[round.suitorChosenRouteKey].label}</div>
            <div className="rv-route-summary">
              <span className="clean">{TONES[round.suitorToneKey].label} tone</span>
            </div>
          </div>
        </div>
        <div className="rv-side rv-rival-side">
          <div className="eyebrow">Signals used</div>
          <div className="sv-sig-on-target" style={{ justifyContent: "center", minHeight: 120 }}>
            {round.signals.map((signal, i) => {
              const Sig = SIGNAL_COMPONENTS[signal.type];
              return (
                <div key={`${signal.type}-${i}`} className="placed-sig-readonly">
                  <Sig size={72} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`rv-stage rv-bars ${stage >= 2 ? "in" : ""}`}>
        <Reveal label="Mood" value={TONES[result.reveal.moodKey].label} />
        <Reveal label="Danger route" value={ROUTES[result.reveal.dangerRouteKey].label} />
        <Reveal label="Rival route" value={ROUTES[result.reveal.rivalRouteKey].label} />
        <Reveal label="Confidant action" value={CONFIDANT_ACTIONS[result.reveal.confidantAction].label} />
        <Reveal label="Suitor choice" value={`${ROUTES[result.reveal.suitorChosenRouteKey].label}, ${TONES[result.reveal.suitorToneKey].label}`} />
      </section>

      <section className={`rv-stage rv-outcome rv-outcome--${success ? "win" : "lose"} ${stage >= 3 ? "in" : ""}`}>
        <div className="outcome-token">
          {success ? <HeartToken size={120} /> : <RumourToken size={120} />}
        </div>
        <div className="outcome-body">
          <div className="outcome-headline">{success ? "+1 Heart" : "+1 Rumour"}</div>
          <div className="outcome-reason">{result.reason}</div>
        </div>
      </section>

      <section className={`rv-stage rv-narrative ${stage >= 3 ? "in" : ""}`}>
        <div className="trace-box">
          <div className="eyebrow">Why this token was awarded</div>
          <ol>
            {result.trace.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
        <div className="rv-controls">
          <button className="btn btn-ghost" onClick={onReplay} type="button">Play another round</button>
          <button className="btn btn-primary" onClick={onContinue} type="button">End this round</button>
        </div>
      </section>
    </div>
  );
};

const Reveal = ({ label, value }: { label: string; value: string }) => (
  <div className="bar-row">
    <div className="bar-label">{label}</div>
    <div className="bar-track">
      <span className="bar-num" style={{ left: 14, right: "auto" }}>{value}</span>
    </div>
  </div>
);
