/**
 * Canonical content for the simplified Rival Hearts ruleset.
 * Active play uses no card hands, AP, Rival traits, obstacle lists, or question token.
 */

export const ROUTES = {
  fast: {
    key: "fast",
    label: "Fast Route",
    shortLabel: "Fast",
    publicHint: "Shortest path, easiest to rush, hardest to read.",
  },
  safe: {
    key: "safe",
    label: "Safe Route",
    shortLabel: "Safe",
    publicHint: "Public path, steady pace, often the obvious choice.",
  },
  secret: {
    key: "secret",
    label: "Secret Route",
    shortLabel: "Secret",
    publicHint: "Hidden path, tempting when the court is watching.",
  },
} as const;
export type RouteKey = keyof typeof ROUTES;

export const ROUTE_KEYS = Object.keys(ROUTES) as RouteKey[];

export const TONES = {
  tender: {
    key: "tender",
    label: "Tender",
    hint: "Soft, careful, emotionally open.",
  },
  bold: {
    key: "bold",
    label: "Bold",
    hint: "Direct, brave, hard to ignore.",
  },
  honest: {
    key: "honest",
    label: "Honest",
    hint: "Plain truth, no ornament, no hiding.",
  },
} as const;
export type ToneKey = keyof typeof TONES;
export type MoodKey = ToneKey;

export const TONE_KEYS = Object.keys(TONES) as ToneKey[];

export const SIGNAL_TYPES = ["heart", "thorn", "clock", "mask"] as const;
export type SignalType = (typeof SIGNAL_TYPES)[number];

export type SignalTarget = `route:${RouteKey}` | `tone:${ToneKey}`;
export type Signal = {
  type: SignalType;
  target: SignalTarget;
};

export const CONFIDANT_ACTIONS = {
  clear_danger: {
    key: "clear_danger",
    label: "Clear Danger",
    shortLabel: "Clear",
    effect: "Neutralise the hidden danger route this round.",
  },
  delay_rival: {
    key: "delay_rival",
    label: "Delay Rival",
    shortLabel: "Delay",
    effect: "Neutralise the Rival route this round.",
  },
  strengthen_letter: {
    key: "strengthen_letter",
    label: "Strengthen Letter",
    shortLabel: "Strengthen",
    effect: "The Suitor's tone counts as matching the mood this round.",
  },
} as const;
export type ConfidantAction = keyof typeof CONFIDANT_ACTIONS;

export const CONFIDANT_ACTION_KEYS = Object.keys(CONFIDANT_ACTIONS) as ConfidantAction[];

export const PREMISE = {
  recipientName: "The Beloved",
  intention: "A private letter",
  oneLine:
    "The Suitor writes under watchful eyes while the Confidant turns hidden truth into symbols.",
};

export const HEARTS_TO_WIN = 3;
export const RUMOURS_TO_LOSE = 3;
