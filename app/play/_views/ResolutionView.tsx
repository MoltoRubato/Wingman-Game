"use client";

import { useEffect, useState } from "react";
import { RECIPIENTS, RIVAL_TRAITS, type RouteKey, type ToneKey } from "@/lib/game/content";
import type { RoundInstance } from "@/lib/game/createRound";
import type { RoundResult } from "@/lib/game/resolution";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { OBSTACLE_COMPONENTS, OBSTACLE_META } from "@/components/svg/obstacles";
import { PORTRAITS } from "@/components/svg/portraits";
import { HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import { CardFrame } from "@/components/svg/CardFrame";
import { CARD_ART } from "@/components/svg/card-art";

type ResolvedRound = RoundInstance & {
  suitorChosenRouteKey: RouteKey;
  suitorToneKey: ToneKey;
};

type Props = {
  round: ResolvedRound;
  result: RoundResult;
  narrative?: string;
  onContinue: () => void;
  onReplay: () => void;
};

export const ResolutionView = ({ round, result, narrative, onContinue, onReplay }: Props) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2400),
      setTimeout(() => setStage(4), 3300),
      setTimeout(() => setStage(5), 4400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const suitorRoute = round.routes.find((r) => r.key === round.suitorChosenRouteKey)!;
  const rivalRoute = round.routes.find((r) => r.key === round.rivalRouteKey)!;
  const trait = RIVAL_TRAITS[round.rivalTraitKey];
  const success = result.outcome === "success";
  const RivalArt = CARD_ART[trait.key];
  const SuitorRouteArt = ROUTE_COMPONENTS[suitorRoute.key];
  const RivalRouteArt = ROUTE_COMPONENTS[rivalRoute.key];
  const RivalPortrait = PORTRAITS.rival;

  return (
    <div className="rv">
      <header className="rv-header">
        <div className="rv-title">Two letters cross the palace</div>
        <div className="rv-sub">
          {round.intention} · to {RECIPIENTS[round.recipientKey].name}
        </div>
      </header>

      <section className={`rv-stage rv-rival ${stage >= 1 ? "in" : ""}`}>
        <div className="rv-portrait-wrap">
          <RivalPortrait w={220} h={275} />
        </div>
        <div className="rv-rival-info">
          <div className="eyebrow">The Rival&apos;s trait</div>
          <div className="trait-card">
            <CardFrame
              variant="rival"
              title={trait.label}
              type="rival trait"
              effect={trait.effect}
              art={RivalArt ? <RivalArt /> : null}
              width={220}
            />
          </div>
        </div>
      </section>

      <section className={`rv-stage rv-routes ${stage >= 2 ? "in" : ""}`}>
        <div className="rv-side rv-suitor-side">
          <div className="eyebrow">Suitor takes</div>
          <div className="rv-route-card">
            <SuitorRouteArt w={320} h={160} />
            <div className="rv-route-name">{ROUTE_META[suitorRoute.key].label}</div>
            <div className="rv-route-obstacles">
              {suitorRoute.obstacles.length === 0 ? (
                <span className="clean">— Open road —</span>
              ) : (
                suitorRoute.obstacles.map((o) => {
                  const Ob = OBSTACLE_COMPONENTS[o];
                  return (
                    <div key={o} className="ob-chip">
                      <Ob size={32} />
                      <span>{OBSTACLE_META[o].label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="rv-vs">
          <svg width="40" height="120" viewBox="0 0 40 120">
            <line x1="20" y1="0" x2="20" y2="120" stroke="url(#gold-leaf)" strokeWidth="2" strokeDasharray="3 6" />
            <circle cx="20" cy="60" r="14" fill="#1a0f12" stroke="url(#gold-leaf)" strokeWidth="2" />
            <text x="20" y="66" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="14" fill="#e9c47a">vs</text>
          </svg>
        </div>
        <div className="rv-side rv-rival-side">
          <div className="eyebrow">Rival takes</div>
          <div className="rv-route-card">
            <RivalRouteArt w={320} h={160} />
            <div className="rv-route-name">{ROUTE_META[rivalRoute.key].label}</div>
            <div className="rv-route-obstacles">
              {rivalRoute.obstacles.length === 0 ? (
                <span className="clean">— Open road —</span>
              ) : (
                rivalRoute.obstacles.map((o) => {
                  const Ob = OBSTACLE_COMPONENTS[o];
                  return (
                    <div key={o} className="ob-chip">
                      <Ob size={32} />
                      <span>{OBSTACLE_META[o].label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`rv-stage rv-bars ${stage >= 3 ? "in" : ""}`}>
        <div className="bar-row">
          <div className="bar-label">Suitor Travel Time</div>
          <div className="bar-track">
            <div className="bar-fill bar-suitor" style={{ width: `${Math.min(100, result.suitorTravelTime * 12)}%` }} />
            <span className="bar-num">{result.suitorTravelTime}</span>
          </div>
        </div>
        <div className="bar-row">
          <div className="bar-label">Rival Travel Time</div>
          <div className="bar-track">
            <div className="bar-fill bar-rival" style={{ width: `${Math.min(100, result.rivalTravelTime * 12)}%` }} />
            <span className="bar-num">{result.rivalTravelTime}</span>
          </div>
        </div>
        <div className="bar-row bar-row--lp">
          <div className="bar-label">Suitor / Rival Letter Power</div>
          <div className="lp-pair">
            <span className="lp lp-suitor">{result.suitorLetterPower}</span>
            <span className="lp-vs">vs</span>
            <span className="lp lp-rival">{result.rivalLetterPower}</span>
          </div>
        </div>
      </section>

      <section className={`rv-stage rv-outcome rv-outcome--${success ? "win" : "lose"} ${stage >= 4 ? "in" : ""}`}>
        <div className="outcome-token">
          {success ? <HeartToken size={120} /> : <RumourToken size={120} />}
        </div>
        <div className="outcome-body">
          <div className="outcome-headline">
            {success ? "+1 Heart" : result.rumoursDelta === 0 ? "Rumour averted" : "+1 Rumour"}
          </div>
          <div className="outcome-reason">{result.reason}</div>
        </div>
      </section>

      <section className={`rv-stage rv-narrative ${stage >= 5 ? "in" : ""}`}>
        <div className="trace-box">
          <div className="eyebrow">Resolution trace</div>
          <ol>
            {result.trace.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
        {narrative && (
          <div className="narrative-box">
            <div className="eyebrow">The Court whispers…</div>
            <p>&quot;{narrative}&quot;</p>
          </div>
        )}
        <div className="rv-controls">
          <button className="btn btn-ghost" onClick={onReplay}>Play another round</button>
          <button className="btn btn-primary" onClick={onContinue}>End of this round →</button>
        </div>
      </section>
    </div>
  );
};
