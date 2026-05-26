"use client";

import { useState } from "react";
import {
  CONFIDANT_ACTIONS,
  CONFIDANT_ACTION_KEYS,
  ROUTES,
  SIGNAL_TYPES,
  TONES,
  type ConfidantAction,
  type RouteKey,
  type Signal,
  type SignalTarget,
  type SignalType,
  type ToneKey,
} from "@/lib/game/content";
import type { RoundInstance } from "@/lib/game/createRound";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { TONE_COMPONENTS, TONE_META } from "@/components/svg/ui-tokens";

export type ConfidantCommit = { signals: Signal[]; action: ConfidantAction };

type Props = {
  round: RoundInstance;
  onCommit: (c: ConfidantCommit) => void;
};

const TARGET_LIMIT = 2;

export const ConfidantView = ({ round, onCommit }: Props) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalType>("heart");
  const [action, setAction] = useState<ConfidantAction | null>(null);

  const placeSignal = (target: SignalTarget) => {
    if (signals.length >= TARGET_LIMIT) return;
    setSignals([...signals, { type: selectedSignal, target }]);
  };

  const removeSignal = (idx: number) => {
    setSignals(signals.filter((_, i) => i !== idx));
  };

  const signalsBy = (target: SignalTarget) => signals.filter((s) => s.target === target);
  const ready = signals.length === TARGET_LIMIT && action;

  return (
    <div className="cv">
      <header className="cv-header">
        <div>
          <div className="cv-role">The Confidant</div>
          <div className="cv-sub">You know the truth. You may only teach it with two symbols.</div>
        </div>
        <div className="cv-ap" style={{ justifyContent: "flex-end" }}>
          <span className="cv-ap-label">Signals {signals.length} / {TARGET_LIMIT}</span>
        </div>
      </header>

      <section className="cv-context">
        <div className="cv-recipient">
          <div className="cv-recipient-meta">
            <div className="eyebrow">Hidden facts</div>
            <div className="name">{round.recipientName}</div>
            <Fact label="Mood" value={`${TONES[round.moodKey].label} letter wanted`} />
            <Fact label="Danger" value={`${ROUTES[round.dangerRouteKey].label} is unsafe`} />
            <Fact label="Rival" value={`Rival watches ${ROUTES[round.rivalRouteKey].label}`} />
          </div>
        </div>
        <div className="cv-clues">
          <div className="eyebrow">Four signals only</div>
          <div className="rule-glossary" style={{ marginTop: 12 }}>
            {SIGNAL_TYPES.map((key) => {
              const Sig = SIGNAL_COMPONENTS[key];
              return (
                <button
                  key={key}
                  className={`gloss-row sig-btn ${selectedSignal === key ? "selected" : ""}`}
                  onClick={() => setSelectedSignal(key)}
                  type="button"
                >
                  <Sig size={44} />
                  <div>
                    <div className="gloss-name">{SIGNAL_META[key].label}</div>
                    <div className="gloss-hint">{SIGNAL_META[key].hint}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cv-routes">
        <div className="eyebrow row-label">Place signals on routes</div>
        <div className="route-row">
          {round.routes.map((r) => {
            const RouteArt = ROUTE_COMPONENTS[r.key];
            const target = `route:${r.key}` as const;
            const sigsHere = signalsBy(target);
            return (
              <button
                key={r.key}
                className="route-tile clickable"
                onClick={() => placeSignal(target)}
                disabled={signals.length >= TARGET_LIMIT}
                type="button"
              >
                <div className="route-art">
                  <RouteArt w={280} h={140} />
                </div>
                <div className="route-meta">
                  <div className="route-name">{ROUTE_META[r.key].label}</div>
                  <div className="route-mood">{ROUTE_META[r.key].hint}</div>
                </div>
                {sigsHere.length > 0 && <PlacedSignals signals={sigsHere} allSignals={signals} onRemove={removeSignal} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="sv-phase sv-tones">
        <div className="eyebrow row-label">Place signals on tones</div>
        <div className="tone-row">
          {(Object.entries(TONE_COMPONENTS) as [ToneKey, (typeof TONE_COMPONENTS)[ToneKey]][]).map(([key, Glyph]) => {
            const target = `tone:${key}` as const;
            const sigsHere = signalsBy(target);
            return (
              <button
                key={key}
                className="tone-card clickable"
                onClick={() => placeSignal(target)}
                disabled={signals.length >= TARGET_LIMIT}
                type="button"
              >
                <Glyph size={88} active />
                <div className="tone-name">{TONE_META[key].label}</div>
                <div className="tone-hint">{TONE_META[key].hint}</div>
                {sigsHere.length > 0 && <PlacedSignals signals={sigsHere} allSignals={signals} onRemove={removeSignal} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="cv-signal-palette">
        <div className="eyebrow">Secret action</div>
        <div className="rule-design-grid" style={{ marginTop: 12 }}>
          {CONFIDANT_ACTION_KEYS.map((key) => (
            <button
              key={key}
              className={`rule-design-card ${action === key ? "selected" : ""}`}
              onClick={() => setAction(key)}
              type="button"
            >
              <div className="design-label">{CONFIDANT_ACTIONS[key].shortLabel}</div>
              <h3>{CONFIDANT_ACTIONS[key].label}</h3>
              <p>{CONFIDANT_ACTIONS[key].effect}</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="cv-footer">
        <button className="btn" onClick={() => setSignals([])} type="button">
          Clear signals
        </button>
        <button
          className="btn btn-primary"
          disabled={!ready}
          onClick={() => action && onCommit({ signals, action })}
          type="button"
        >
          Hand to Suitor
        </button>
      </footer>
    </div>
  );
};

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="intent" style={{ marginTop: 10 }}>
    <span className="eyebrow">{label}: </span>
    {value}
  </div>
);

const PlacedSignals = ({
  signals,
  allSignals,
  onRemove,
}: {
  signals: Signal[];
  allSignals: Signal[];
  onRemove: (idx: number) => void;
}) => (
  <div className="route-signals">
    {signals.map((signal) => {
      const Sig = SIGNAL_COMPONENTS[signal.type];
      const idx = allSignals.indexOf(signal);
      return (
        <span
          key={`${signal.type}-${idx}`}
          className="placed-sig-readonly"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(idx);
          }}
          role="button"
          tabIndex={0}
        >
          <Sig size={48} />
        </span>
      );
    })}
  </div>
);
