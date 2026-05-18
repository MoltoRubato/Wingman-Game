"use client";

import { useState } from "react";
import { RECIPIENTS, SUITOR_CARDS, type RouteKey, type ToneKey } from "@/lib/game/content";
import type { RoundInstance } from "@/lib/game/createRound";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { SIGNAL_COMPONENTS } from "@/components/svg/signals";
import { TONE_COMPONENTS, TONE_META, QuestionToken } from "@/components/svg/ui-tokens";
import { PORTRAITS } from "@/components/svg/portraits";
import { CardFrame } from "@/components/svg/CardFrame";
import { CARD_ART } from "@/components/svg/card-art";
import type { Signal } from "./ConfidantView";

export type Subphase = "tone" | "question" | "route";

type Props = {
  round: RoundInstance;
  confidantSignals: Signal[];
  subphase: Subphase;
  onSubmitTone?: (t: ToneKey) => void;
  onAskQuestion?: (r: RouteKey) => void;
  onSkipQuestion?: () => void;
  onChooseRoute?: (r: RouteKey, suitorCard: string | null) => void;
  questionAnswer?: "Trust" | "Danger" | "Unsure" | null;
};

export const SuitorView = ({
  round,
  confidantSignals,
  subphase,
  onSubmitTone,
  onAskQuestion,
  onSkipQuestion,
  onChooseRoute,
  questionAnswer,
}: Props) => {
  const [tone, setTone] = useState<ToneKey | null>(null);
  const [askedRoute, setAskedRoute] = useState<RouteKey | null>(null);
  const [chosenRoute, setChosenRoute] = useState<RouteKey | null>(null);
  const [playedSuitor, setPlayedSuitor] = useState<string | null>(null);

  const recipient = RECIPIENTS[round.recipientKey];
  const RecipientPortrait = PORTRAITS[round.recipientKey as keyof typeof PORTRAITS];
  const suitorCardKey = round.suitorHand[0];
  const suitorCard = SUITOR_CARDS[suitorCardKey];

  const signalsBy = (target: string) => confidantSignals.filter((s) => s.target === target);

  return (
    <div className="sv">
      <header className="sv-header">
        <div>
          <div className="sv-role">The Suitor</div>
          <div className="sv-sub">
            {subphase === "tone" && "Step 1 of 3 — Choose your tone"}
            {subphase === "question" && "Step 2 of 3 — One question to your Confidant"}
            {subphase === "route" && "Step 3 of 3 — Choose your route and send"}
          </div>
        </div>
        <div className="sv-portrait">
          <RecipientPortrait w={88} h={110} />
        </div>
      </header>

      <section className="sv-banner">
        <div className="sv-banner-left">
          <div className="eyebrow">Tonight you write to</div>
          <div className="name">{recipient.name}</div>
          <div className="bio">&quot;{recipient.bio}&quot;</div>
        </div>
        <div className="sv-banner-right">
          <div className="eyebrow">Intention</div>
          <div className="intent">{round.intention}</div>
          {signalsBy("intention").length > 0 && (
            <div className="sv-sig-on-target">
              {signalsBy("intention").map((s, i) => {
                const Sig = SIGNAL_COMPONENTS[s.type];
                return <Sig key={i} size={42} />;
              })}
            </div>
          )}
        </div>
      </section>

      <section className="sv-routes">
        <div className="eyebrow row-label">
          The three routes — and your Confidant&apos;s signals on each
        </div>
        <div className="route-row">
          {round.routes.map((r) => {
            const RouteArt = ROUTE_COMPONENTS[r.key];
            const sigsHere = signalsBy(`route:${r.key}`);
            const isAsked = askedRoute === r.key;
            const isChosen = chosenRoute === r.key;
            const clickable = (subphase === "question" && !askedRoute) || subphase === "route";
            return (
              <div
                key={r.key}
                className={`route-tile sv-route ${isAsked ? "asked" : ""} ${isChosen ? "chosen" : ""} ${clickable ? "clickable" : ""}`}
                onClick={() => {
                  if (subphase === "question" && !askedRoute) {
                    setAskedRoute(r.key);
                    onAskQuestion?.(r.key);
                  } else if (subphase === "route") {
                    setChosenRoute(r.key);
                  }
                }}
              >
                <div className="route-art">
                  <RouteArt w={300} h={150} />
                </div>
                <div className="route-meta">
                  <div className="route-name">
                    {r.baseTime} · {ROUTE_META[r.key].label}
                  </div>
                  <div className="route-mood">{ROUTE_META[r.key].mood}</div>
                </div>
                {sigsHere.length > 0 && (
                  <div className="route-signals">
                    {sigsHere.map((s, i) => {
                      const Sig = SIGNAL_COMPONENTS[s.type];
                      return (
                        <div key={i} className="placed-sig-readonly">
                          <Sig size={56} />
                        </div>
                      );
                    })}
                  </div>
                )}
                {isAsked && questionAnswer && (
                  <div className={`route-answer route-answer--${questionAnswer.toLowerCase()}`}>
                    &quot;{questionAnswer}&quot;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {subphase === "tone" && (
        <section className="sv-phase sv-tones">
          <div className="eyebrow row-label">
            Choose a tone for the letter
            {signalsBy("tone").length > 0 && (
              <span className="sig-hint">
                {" "}
                — signals on tone:{" "}
                {signalsBy("tone").map((s, i) => {
                  const Sig = SIGNAL_COMPONENTS[s.type];
                  return (
                    <span key={i}>
                      <Sig size={28} />
                    </span>
                  );
                })}
              </span>
            )}
          </div>
          <div className="tone-row">
            {(Object.entries(TONE_COMPONENTS) as [ToneKey, (typeof TONE_COMPONENTS)[ToneKey]][]).map(([key, Glyph]) => (
              <button
                key={key}
                className={`tone-card ${tone === key ? "selected" : ""}`}
                onClick={() => setTone(key)}
              >
                <Glyph size={104} active={tone === key} />
                <div className="tone-name">{TONE_META[key].label}</div>
                <div className="tone-hint">{TONE_META[key].hint}</div>
              </button>
            ))}
          </div>
          <div className="sv-controls">
            <button className="btn btn-primary" disabled={!tone} onClick={() => tone && onSubmitTone?.(tone)}>
              Lock in tone → ask one question
            </button>
          </div>
        </section>
      )}

      {subphase === "question" && (
        <section className="sv-phase sv-question">
          <div className="eyebrow row-label">Question Token · one use only</div>
          <div className="question-row">
            <QuestionToken size={108} used={!!askedRoute} />
            <div className="question-copy">
              {!askedRoute && (
                <p>
                  Tap any route above to ask your Confidant about it. They will answer with one word:{" "}
                  <strong>Trust</strong>, <strong>Danger</strong>, or <strong>Unsure</strong>.
                </p>
              )}
              {askedRoute && !questionAnswer && (
                <p>
                  Asking about <strong>{ROUTE_META[askedRoute].label}</strong>… your Confidant is choosing.
                </p>
              )}
              {askedRoute && questionAnswer && (
                <p>
                  They answered <strong>&quot;{questionAnswer}&quot;</strong>. Read the signals again — they may mean
                  more now.
                </p>
              )}
            </div>
            <div className="question-actions">
              {!askedRoute && (
                <button className="btn btn-ghost" onClick={() => onSkipQuestion?.()}>
                  Skip the question
                </button>
              )}
              {askedRoute && questionAnswer && (
                <button className="btn btn-primary" onClick={() => onSkipQuestion?.()}>
                  Continue to choose a route →
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {subphase === "route" && (
        <section className="sv-phase sv-route">
          <div className="sv-card-row">
            <div className="eyebrow row-label">Your Suitor card — play any time before sending</div>
            <div className="suitor-card-wrap">
              <div
                className={`hand-card ${playedSuitor ? "played" : "playable"}`}
                onClick={() => setPlayedSuitor(playedSuitor ? null : suitorCardKey)}
              >
                <CardFrame
                  variant="suitor"
                  title={suitorCard.title}
                  type="action"
                  effect={suitorCard.effect}
                  art={CARD_ART[suitorCardKey] ? <Render of={suitorCardKey} /> : null}
                  width={200}
                />
                <div className="hand-status">{playedSuitor ? "tap to undo" : "tap to play"}</div>
              </div>
              <p className="hint">Then tap a route above to send the letter.</p>
            </div>
          </div>
          <div className="sv-controls">
            <button
              className="btn btn-primary"
              disabled={!chosenRoute}
              onClick={() => chosenRoute && onChooseRoute?.(chosenRoute, playedSuitor)}
            >
              {chosenRoute ? `Send via ${ROUTE_META[chosenRoute].label} →` : "Choose a route above"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

const Render = ({ of }: { of: string }) => {
  const Art = CARD_ART[of];
  return Art ? <Art /> : null;
};
