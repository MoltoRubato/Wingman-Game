/**
 * lib/game/createRound.ts
 * Seeded round generator. TS port of prototype/engine.js's createRound.
 * Used by the create-round Edge Function and the single-device prototype mode.
 */

import {
  ROUTES,
  OBSTACLES,
  RECIPIENTS,
  TONES,
  RIVAL_TRAITS,
  CONFIDANT_CARDS,
  SUITOR_CARDS,
  INTENTIONS,
  type RouteKey,
  type ObstacleKey,
  type RecipientKey,
  type ToneKey,
} from "./content";

export type RouteInstance = {
  key: RouteKey;
  baseTime: number;
  obstacles: ObstacleKey[];
  originalObstacles: ObstacleKey[];
};

export type RoundInstance = {
  recipientKey: RecipientKey;
  intention: string;
  routes: RouteInstance[];
  rivalRouteKey: RouteKey;
  rivalTraitKey: keyof typeof RIVAL_TRAITS;
  /** Keys of cards in the Confidant's hand. */
  confidantHand: string[];
  /** Single Suitor card key. */
  suitorHand: string[];
  /** Three rendered clue strings for the Confidant. */
  clues: string[];
  heartsEarnedSoFar: number;
  rumoursSoFar: number;
};

export type CreateRoundOpts = {
  recipient?: RecipientKey;
  hearts?: number;
  rumours?: number;
  /** Stretch obstacles (Crowded Hall, False Address) are off by default. */
  includeStretchObstacles?: boolean;
};

/* Deterministic PRNG (same LCG as engine.js). */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickMany<T>(rand: () => number, arr: readonly T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && a.length > 0; i++) {
    out.push(a.splice(Math.floor(rand() * a.length), 1)[0]);
  }
  return out;
}

function pickOtherThan<T>(arr: readonly T[], exclude: T, rand: () => number): T {
  const others = arr.filter((x) => x !== exclude);
  return others[Math.floor(rand() * others.length)];
}

const POWER_DESCRIPTORS = [
  { atOrBelow: 3, word: "feeble" },
  { atOrBelow: 4, word: "measured" },
  { atOrBelow: 5, word: "earnest" },
  { atOrBelow: 6, word: "forceful" },
  { atOrBelow: 99, word: "thunderous" },
];

export function createRound(seed: number, opts: CreateRoundOpts = {}): RoundInstance {
  const rand = rng(seed);

  const recipientKey: RecipientKey =
    opts.recipient ?? (pick(rand, Object.keys(RECIPIENTS) as RecipientKey[]));
  const recipient = RECIPIENTS[recipientKey];
  const intention = pick(rand, INTENTIONS as readonly string[]);

  const routeKeys: RouteKey[] = ["garden", "gallery", "corridor"];
  const routes: RouteInstance[] = routeKeys.map((k) => {
    const obstacles: ObstacleKey[] = [];
    if (k === "garden" && rand() < 0.7) obstacles.push("gossip");
    if (k === "gallery" && rand() < 0.7) obstacles.push("guard");
    if (k === "corridor" && rand() < 0.45) obstacles.push("locked_door");
    if (k === "corridor" && rand() < 0.35) obstacles.push("secret_passage");
    if (opts.includeStretchObstacles) {
      if (k === "gallery" && rand() < 0.25) obstacles.push("crowded_hall");
      if (rand() < 0.1) obstacles.push("false_address");
    }
    return {
      key: k,
      baseTime: ROUTES[k].baseTime,
      obstacles,
      originalObstacles: [...obstacles],
    };
  });

  const rivalRouteKey: RouteKey = pick(rand, routeKeys);
  const rivalTraitKey = pick(
    rand,
    Object.keys(RIVAL_TRAITS) as (keyof typeof RIVAL_TRAITS)[],
  );

  const confidantHand = pickMany(rand, Object.keys(CONFIDANT_CARDS), 5);
  const suitorHand = [pick(rand, Object.keys(SUITOR_CARDS))];

  /* Clue generation — mirrors engine.js with template fill. */
  const rivalPowerBase = 3 + (opts.hearts ?? 0);
  const powerWord =
    POWER_DESCRIPTORS.find((p) => rivalPowerBase <= p.atOrBelow)?.word ?? "earnest";
  const obstacleOnRival = routes.find((r) => r.key === rivalRouteKey)!.obstacles[0];

  const rivalClues = [
    `The Rival is not using the ${ROUTES[pickOtherThan(routeKeys, rivalRouteKey, rand)].label}.`,
    rivalTraitKey === "hidden_seal"
      ? "The Rival's seal cannot be read."
      : `The Rival's letter feels ${powerWord}.`,
    `The Rival was seen near the ${ROUTES[rivalRouteKey].label} earlier.`,
  ];

  const obstacleClues = obstacleOnRival
    ? [
        `The ${ROUTES[rivalRouteKey].label} hides a ${OBSTACLES[obstacleOnRival].label}.`,
        `Take care near the ${ROUTES[rivalRouteKey].label}.`,
      ]
    : [`The ${ROUTES[rivalRouteKey].label} is unusually quiet — perhaps too quiet.`];

  const preferenceClues = recipient.likes.length
    ? [
        `${recipient.name} prefers ${TONES[pick(rand, recipient.likes as readonly ToneKey[])].label} letters this evening.`,
      ]
    : [`${recipient.name}'s mood is uncertain.`];

  const clues = [
    pick(rand, rivalClues),
    pick(rand, obstacleClues),
    pick(rand, preferenceClues),
  ];

  return {
    recipientKey,
    intention,
    routes,
    rivalRouteKey,
    rivalTraitKey,
    confidantHand,
    suitorHand,
    clues,
    heartsEarnedSoFar: opts.hearts ?? 0,
    rumoursSoFar: opts.rumours ?? 0,
  };
}
