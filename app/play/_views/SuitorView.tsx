"use client";

import { useState } from "react";
import { ROUTE_KEYS, TONE_KEYS, type RouteKey, type Signal, type SignalTarget, type ToneKey } from "@/lib/game/content";
import type { RoundInstance } from "@/lib/game/createRound";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { SIGNAL_COMPONENTS } from "@/components/svg/signals";
import { TONE_COMPONENTS, TONE_META } from "@/components/svg/ui-tokens";

type Props = {
  round: RoundInstance;
  confidantSignals: Signal[];
  onChoose: (choice: { tone: ToneKey; route: RouteKey }) => void;
};

export const SuitorView = ({ round, confidantSignals, onChoose }: Props) => {
  const [tone, setTone] = useState<ToneKey | null>(null);
  const [route, setRoute] = useState<RouteKey | null>(null);

  const signalsBy = (target: SignalTarget) => confidantSignals.filter((s) => s.target === target);

  return (
    <div className="sv">
      <header className="sv-header">
        <div>
          <div className="sv-role">The Suitor</div>
          <div className="sv-sub">Read two signals. Choose one route and one tone.</div>
        </div>
      </header>

      <section className="sv-banner">
        <div className="sv-banner-left">
          <div className="eyebrow">Tonight you write to</div>
          <div className="name">{round.recipientName}</div>
          <div className="bio">Your Confidant knows the mood, danger, and Rival route. You only see their symbols.</div>
        </div>
        <div className="sv-banner-right">
          <div className="eyebrow">Signals placed</div>
          <div className="sv-sig-on-target" style={{ minHeight: 46 }}>
            {confidantSignals.map((signal, i) => {
              const Sig = SIGNAL_COMPONENTS[signal.type];
              return <Sig key={`${signal.type}-${i}`} size={42} />;
            })}
          </div>
        </div>
      </section>

      <section className="sv-routes">
        <div className="eyebrow row-label">Choose a route</div>
        <div className="route-row">
          {ROUTE_KEYS.map((key) => {
            const RouteArt = ROUTE_COMPONENTS[key];
            const target = `route:${key}` as const;
            const sigsHere = signalsBy(target);
            return (
              <button
                key={key}
                className={`route-tile sv-route clickable ${route === key ? "chosen" : ""}`}
                onClick={() => setRoute(key)}
                type="button"
              >
                <div className="route-art">
                  <RouteArt w={300} h={150} />
                </div>
                <div className="route-meta">
                  <div className="route-name">{ROUTE_META[key].label}</div>
                  <div className="route-mood">{ROUTE_META[key].hint}</div>
                </div>
                {sigsHere.length > 0 && <PlacedSignals signals={sigsHere} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="sv-phase sv-tones">
        <div className="eyebrow row-label">Choose a tone</div>
        <div className="tone-row">
          {TONE_KEYS.map((key) => {
            const Glyph = TONE_COMPONENTS[key];
            const target = `tone:${key}` as const;
            const sigsHere = signalsBy(target);
            return (
              <button
                key={key}
                className={`tone-card ${tone === key ? "selected" : ""}`}
                onClick={() => setTone(key)}
                type="button"
              >
                <Glyph size={104} active={tone === key} />
                <div className="tone-name">{TONE_META[key].label}</div>
                <div className="tone-hint">{TONE_META[key].hint}</div>
                {sigsHere.length > 0 && <PlacedSignals signals={sigsHere} />}
              </button>
            );
          })}
        </div>
      </section>

      <div className="sv-controls">
        <button
          className="btn btn-primary"
          disabled={!tone || !route}
          onClick={() => tone && route && onChoose({ tone, route })}
          type="button"
        >
          Send the letter
        </button>
      </div>
    </div>
  );
};

const PlacedSignals = ({ signals }: { signals: Signal[] }) => (
  <div className="route-signals">
    {signals.map((signal, i) => {
      const Sig = SIGNAL_COMPONENTS[signal.type];
      return (
        <div key={`${signal.type}-${i}`} className="placed-sig-readonly">
          <Sig size={56} />
        </div>
      );
    })}
  </div>
);
