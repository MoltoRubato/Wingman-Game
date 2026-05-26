/**
 * Seeded round generator for the simplified Rival Hearts ruleset.
 */

import {
  PREMISE,
  ROUTES,
  ROUTE_KEYS,
  TONES,
  TONE_KEYS,
  type MoodKey,
  type RouteKey,
} from "./content";

export type RouteInstance = {
  key: RouteKey;
  label: string;
  publicHint: string;
};

export type RoundInstance = {
  moodKey: MoodKey;
  dangerRouteKey: RouteKey;
  rivalRouteKey: RouteKey;
  routes: RouteInstance[];
  clues: string[];
  heartsEarnedSoFar: number;
  rumoursSoFar: number;
  intention: string;
  recipientName: string;
};

export type CreateRoundOpts = {
  hearts?: number;
  rumours?: number;
};

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

export function createRound(seed: number, opts: CreateRoundOpts = {}): RoundInstance {
  const rand = rng(seed);
  const moodKey = pick(rand, TONE_KEYS);
  const dangerRouteKey = pick(rand, ROUTE_KEYS);
  const rivalRouteKey = pick(rand, ROUTE_KEYS);

  const routes = ROUTE_KEYS.map((key) => ({
    key,
    label: ROUTES[key].label,
    publicHint: ROUTES[key].publicHint,
  }));

  const clues = [
    `Mood: ${PREMISE.recipientName} wants a ${TONES[moodKey].label} letter.`,
    `Danger: the ${ROUTES[dangerRouteKey].label} is dangerous tonight.`,
    `Rival: the Rival is watching the ${ROUTES[rivalRouteKey].label}.`,
  ];

  return {
    moodKey,
    dangerRouteKey,
    rivalRouteKey,
    routes,
    clues,
    heartsEarnedSoFar: opts.hearts ?? 0,
    rumoursSoFar: opts.rumours ?? 0,
    intention: PREMISE.intention,
    recipientName: PREMISE.recipientName,
  };
}
