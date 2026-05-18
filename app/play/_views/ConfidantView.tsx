"use client";

import { useState } from "react";
import { CONFIDANT_CARDS, type RouteKey } from "@/lib/game/content";
import type { RoundInstance } from "@/lib/game/createRound";
import { OBSTACLE_COMPONENTS, OBSTACLE_META } from "@/components/svg/obstacles";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { PORTRAITS } from "@/components/svg/portraits";
import { APPip } from "@/components/svg/ui-tokens";
import { CardFrame } from "@/components/svg/CardFrame";
import { CARD_ART } from "@/components/svg/card-art";

export type PlayedCard = { key: string; routeTarget: RouteKey | null };
export type Signal = { type: keyof typeof SIGNAL_COMPONENTS; target: string };

export type ConfidantCommit = { signals: Signal[]; played: PlayedCard[] };

type Props = {
  round: RoundInstance;
  onCommit: (c: ConfidantCommit) => void;
  awaitingQuestion?: boolean;
  suitorQuestion?: RouteKey;
  onAnswer?: (a: "Trust" | "Danger" | "Unsure") => void;
};

const ROUTE_TARGET_CARDS = new Set(["distract_guard", "clear_gossip", "find_key", "correct_address"]);

export const ConfidantView = ({ round, onCommit, awaitingQuestion, suitorQuestion, onAnswer }: Props) => {
  const [ap, setAp] = useState(3);
  const [played, setPlayed] = useState<PlayedCard[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<keyof typeof SIGNAL_COMPONENTS>("heart");
  const [revealedRoute, setRevealedRoute] = useState<RouteKey | null>(null);
  const [revealedTrait, setRevealedTrait] = useState<string | null>(null);
  const [pendingCard, setPendingCard] = useState<{ key: string } | null>(null);

  const recipient = round.recipientKey;
  const RecipientPortrait = PORTRAITS[recipient as keyof typeof PORTRAITS];

  const playCard = (key: string, routeTarget: RouteKey | null = null) => {
    const card = CONFIDANT_CARDS[key];
    if (!card || ap < card.cost) return;
    const needsRoute = ROUTE_TARGET_CARDS.has(key);
    if (needsRoute && !routeTarget) {
      setPendingCard({ key });
      return;
    }
    setPlayed([...played, { key, routeTarget }]);
    setAp(ap - card.cost);
    setPendingCard(null);
    if (key === "trace_footsteps") {
      const lies = round.rivalTraitKey === "false_trail" && Math.random() < 0.5;
      const others = (["garden", "gallery", "corridor"] as RouteKey[]).filter((k) => k !== round.rivalRouteKey);
      setRevealedRoute(lies ? others[Math.floor(Math.random() * others.length)] : round.rivalRouteKey);
    }
    if (key === "read_the_seal") {
      setRevealedTrait(round.rivalTraitKey === "hidden_seal" ? "__hidden__" : round.rivalTraitKey);
    }
  };

  const undoCard = (idx: number) => {
    const card = played[idx];
    if (!card) return;
    const meta = CONFIDANT_CARDS[card.key];
    setAp(ap + meta.cost);
    setPlayed(played.filter((_, i) => i !== idx));
    if (card.key === "trace_footsteps") setRevealedRoute(null);
    if (card.key === "read_the_seal") setRevealedTrait(null);
  };

  const placeSignal = (target: string) => {
    if (signals.length >= 3) return;
    setSignals([...signals, { type: selectedSignal, target }]);
  };

  const removeSignal = (i: number) => setSignals(signals.filter((_, idx) => idx !== i));

  if (awaitingQuestion && suitorQuestion && onAnswer) {
    const route = round.routes.find((r) => r.key === suitorQuestion)!;
    return (
      <div className="cv cv--answer">
        <header className="cv-header">
          <div>
            <div className="cv-role">The Confidant — Answer</div>
            <div className="cv-sub">One word only. They are listening.</div>
          </div>
        </header>
        <div className="answer-box">
          <div className="eyebrow">The Suitor asks about</div>
          <div className="answer-route">{ROUTE_META[suitorQuestion].label}</div>
          <div className="answer-clue">
            {route.obstacles.length === 0 ? (
              <p>
                You know: this route is <strong>clear</strong>.
              </p>
            ) : (
              <p>
                You know: this route hides{" "}
                <strong>{route.obstacles.map((o) => OBSTACLE_META[o].label).join(" & ")}</strong>.
              </p>
            )}
            {round.rivalRouteKey === suitorQuestion && (
              <p>
                You know: <strong>the Rival is taking this very path.</strong>
              </p>
            )}
          </div>
          <div className="answer-choices">
            <button className="answer-btn answer-trust" onClick={() => onAnswer("Trust")}>
              <strong>Trust</strong>
              <em>Take this path. I would.</em>
            </button>
            <button className="answer-btn answer-danger" onClick={() => onAnswer("Danger")}>
              <strong>Danger</strong>
              <em>Not this one. Reconsider.</em>
            </button>
            <button className="answer-btn answer-unsure" onClick={() => onAnswer("Unsure")}>
              <strong>Unsure</strong>
              <em>I cannot tell. Choose with care.</em>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cv">
      <header className="cv-header">
        <div>
          <div className="cv-role">The Confidant</div>
          <div className="cv-sub">Plum &amp; silver — your view alone</div>
        </div>
        <div className="cv-ap">
          {[1, 2, 3].map((n) => (
            <APPip key={n} size={42} spent={n > ap} />
          ))}
          <span className="cv-ap-label">Action Points</span>
        </div>
      </header>

      <section className="cv-context">
        <div className="cv-recipient">
          <RecipientPortrait w={180} h={224} />
          <div className="cv-recipient-meta">
            <div className="eyebrow">Tonight&apos;s recipient</div>
            <div className="name">{recipientName(recipient)}</div>
            <div className="bio">&quot;{recipientBio(recipient)}&quot;</div>
            <div className="intent">
              <span className="eyebrow">Intention: </span>
              {round.intention}
            </div>
          </div>
        </div>
        <div className="cv-clues">
          <div className="eyebrow">Three private clues</div>
          <ol>
            {round.clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
            {revealedRoute && (
              <li className="reveal">
                — Footsteps trace to: <strong>{ROUTE_META[revealedRoute].label}</strong>.
              </li>
            )}
            {revealedTrait === "__hidden__" && (
              <li className="reveal">— The Rival&apos;s seal cannot be read.</li>
            )}
            {revealedTrait && revealedTrait !== "__hidden__" && (
              <li className="reveal">
                — The Rival is a <strong>{revealedTrait.replace(/_/g, " ")}</strong>.
              </li>
            )}
          </ol>
        </div>
      </section>

      <section className="cv-routes">
        <div className="eyebrow row-label">Routes — place signals (≤ 3)</div>
        <div className="route-row">
          {round.routes.map((r) => {
            const RouteArt = ROUTE_COMPONENTS[r.key];
            const onThisRoute = signals.filter((s) => s.target === `route:${r.key}`);
            const pendingTargetable = pendingCard !== null && shouldShowTargetFor(pendingCard.key, r);
            return (
              <div
                key={r.key}
                className={`route-tile ${pendingTargetable ? "targetable" : ""}`}
                onClick={() => {
                  if (pendingCard) playCard(pendingCard.key, r.key);
                  else placeSignal(`route:${r.key}`);
                }}
              >
                <div className="route-art">
                  <RouteArt w={280} h={140} />
                </div>
                <div className="route-meta">
                  <div className="route-name">
                    {r.baseTime} · {ROUTE_META[r.key].label}
                  </div>
                  <div className="route-obstacles">
                    {r.obstacles.map((o) => {
                      const ObIcon = OBSTACLE_COMPONENTS[o];
                      return (
                        <div key={o} className="ob-chip" title={OBSTACLE_META[o].label}>
                          <ObIcon size={42} />
                          <span>{OBSTACLE_META[o].label}</span>
                        </div>
                      );
                    })}
                    {r.obstacles.length === 0 && <div className="route-clean">— Open road —</div>}
                  </div>
                </div>
                {onThisRoute.length > 0 && (
                  <div className="route-signals">
                    {onThisRoute.map((s, i) => {
                      const Sig = SIGNAL_COMPONENTS[s.type];
                      return (
                        <button
                          key={i}
                          className="placed-sig"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSignal(signals.indexOf(s));
                          }}
                        >
                          <Sig size={48} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cv-signal-palette">
        <div className="eyebrow">Signal palette · {signals.length}/3 placed</div>
        <div className="sig-row">
          {(Object.entries(SIGNAL_COMPONENTS) as [keyof typeof SIGNAL_COMPONENTS, (typeof SIGNAL_COMPONENTS)[keyof typeof SIGNAL_COMPONENTS]][]).map(([key, Sig]) => (
            <button
              key={key}
              className={`sig-btn ${selectedSignal === key ? "selected" : ""}`}
              onClick={() => setSelectedSignal(key)}
            >
              <Sig size={56} />
              <span>{SIGNAL_META[key].label}</span>
            </button>
          ))}
        </div>
        <div className="sig-row sig-row--secondary">
          <button className="sig-target" onClick={() => placeSignal("tone")}>Place on Tone</button>
          <button className="sig-target" onClick={() => placeSignal("intention")}>Place on Intention</button>
          {signals.length > 0 && (
            <button className="sig-target sig-clear" onClick={() => setSignals([])}>Clear all</button>
          )}
        </div>
        <div className="sig-placed">
          {signals.map((s, i) => {
            const Sig = SIGNAL_COMPONENTS[s.type];
            return (
              <button key={i} className="placed-tag" onClick={() => removeSignal(i)}>
                <Sig size={28} /> <em>{prettyTarget(s.target)}</em>
              </button>
            );
          })}
        </div>
      </section>

      <section className="cv-hand">
        <div className="eyebrow row-label">
          Your hand ·{" "}
          {pendingCard ? (
            <span className="pending">Choose a route for {CONFIDANT_CARDS[pendingCard.key].title}</span>
          ) : (
            `${ap} AP remaining`
          )}
        </div>
        <div className="hand-row">
          {round.confidantHand.map((key) => {
            const card = CONFIDANT_CARDS[key];
            const isPlayed = played.some((p) => p.key === key);
            const Art = CARD_ART[key];
            const playedIdx = played.findIndex((p) => p.key === key);
            const canPlay = !isPlayed && ap >= card.cost;
            return (
              <div
                key={key}
                className={`hand-card ${isPlayed ? "played" : ""} ${canPlay ? "playable" : ""}`}
                onClick={() => (isPlayed ? undoCard(playedIdx) : canPlay && playCard(key))}
              >
                <CardFrame
                  variant="confidant"
                  title={card.title}
                  cost={card.cost}
                  type={card.type}
                  effect={card.effect}
                  art={Art ? <Art /> : null}
                  width={184}
                />
                <div className="hand-status">
                  {isPlayed ? "tap to undo" : canPlay ? "tap to play" : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="cv-footer">
        <button
          className="btn"
          onClick={() => {
            setPlayed([]);
            setSignals([]);
            setAp(3);
            setRevealedRoute(null);
            setRevealedTrait(null);
          }}
        >
          Reset
        </button>
        <button className="btn btn-primary" onClick={() => onCommit({ signals, played })}>
          Hand the device to the Suitor →
        </button>
      </footer>
    </div>
  );
};

function prettyTarget(t: string) {
  if (t === "tone") return "on Tone";
  if (t === "intention") return "on Intention";
  return `on ${ROUTE_META[t.replace("route:", "") as RouteKey].label}`;
}

function shouldShowTargetFor(cardKey: string, route: RoundInstance["routes"][number]) {
  if (cardKey === "distract_guard") return route.obstacles.includes("guard");
  if (cardKey === "clear_gossip") return route.obstacles.includes("gossip");
  if (cardKey === "find_key") return route.obstacles.includes("locked_door");
  if (cardKey === "correct_address") return route.obstacles.includes("false_address");
  return true;
}

function recipientName(key: string) {
  return {
    celeste: "Lady Celeste",
    aureon: "Lord Aureon",
    mira: "Mira the Poet",
    heir: "The Masked Heir",
  }[key] ?? key;
}

function recipientBio(key: string) {
  return {
    celeste: "Reads three books a night and forgives nothing said in haste.",
    aureon: "Wins duels he does not mean to fight. Loves anyone who can keep up.",
    mira: "Believes a kept silence is a love letter in itself.",
    heir: "Half the court has loved them. None has met them twice.",
  }[key] ?? "";
}
