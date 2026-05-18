/**
 * lib/game/content.ts
 * Single source of truth: routes, obstacles, recipients, rival traits,
 * Confidant cards (12), Suitor cards (6), Rival traits (6), clue templates.
 *
 * All rule numbers reference the build plan's Section 1 patches.
 */

// ─────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────
export const ROUTES = {
  garden:   { key: "garden",   label: "Garden Walk",        baseTime: 3, mood: "romantic but exposed" },
  gallery:  { key: "gallery",  label: "Portrait Gallery",   baseTime: 4, mood: "watched, formal" },
  corridor: { key: "corridor", label: "Servants' Corridor", baseTime: 5, mood: "secret, slow, intimate" },
} as const;
export type RouteKey = keyof typeof ROUTES;

// ─────────────────────────────────────────────────────────────────────────
// OBSTACLES
// ─────────────────────────────────────────────────────────────────────────
export const OBSTACLES = {
  gossip:         { key: "gossip",         label: "Gossip",         blocking: false, mvp: true,
                    description: "Whispers buff the Rival. Cleared by Clear Gossip or Honest tone.",
                    travelDelta: 0 },
  guard:          { key: "guard",          label: "Guard",          blocking: false, mvp: true,
                    description: "+2 Travel Time unless distracted.",
                    travelDelta: 2 },
  locked_door:    { key: "locked_door",    label: "Locked Door",    blocking: true,  mvp: true,
                    description: "Without Find Key: round fails.",
                    travelDelta: 0 },
  crowded_hall:   { key: "crowded_hall",   label: "Crowded Hall",   blocking: false, mvp: false,
                    description: "Wait for the Right Moment recommended.",
                    travelDelta: 1 },
  false_address:  { key: "false_address",  label: "False Address",  blocking: true,  mvp: false,
                    description: "Without Correct Address: round fails.",
                    travelDelta: 0 },
  secret_passage: { key: "secret_passage", label: "Secret Passage", blocking: false, mvp: true,
                    description: "Hidden alternate route, only Confidant sees it.",
                    travelDelta: -1 },
} as const;
export type ObstacleKey = keyof typeof OBSTACLES;

// ─────────────────────────────────────────────────────────────────────────
// RECIPIENTS
// ─────────────────────────────────────────────────────────────────────────
export const RECIPIENTS = {
  celeste: { key: "celeste", name: "Lady Celeste",
             bio: "Reads three books a night and forgives nothing said in haste.",
             likes:    ["tender", "honest"]  as ToneKey[],
             dislikes: ["bold"]              as ToneKey[] },
  aureon:  { key: "aureon",  name: "Lord Aureon",
             bio: "Wins duels he does not mean to fight. Loves anyone who can keep up.",
             likes:    ["bold", "playful"]   as ToneKey[],
             dislikes: ["tender"]            as ToneKey[] },
  mira:    { key: "mira",    name: "Mira the Poet",
             bio: "Believes a kept silence is a love letter in itself.",
             likes:    ["honest", "tender"]  as ToneKey[],
             dislikes: ["playful"]           as ToneKey[] },
  heir:    { key: "heir",    name: "The Masked Heir",
             bio: "Half the court has loved them. None has met them twice.",
             likes:    ["playful", "bold"]   as ToneKey[],
             dislikes: ["honest"]            as ToneKey[] },
} as const;
export type RecipientKey = keyof typeof RECIPIENTS;

// ─────────────────────────────────────────────────────────────────────────
// TONES (R15 — chosen after signals, before question)
// ─────────────────────────────────────────────────────────────────────────
export const TONES = {
  tender:  { key: "tender",  label: "Tender",  travelDelta: +1, powerDelta: +1 },
  bold:    { key: "bold",    label: "Bold",    travelDelta: -1, powerDelta: -1 },
  honest:  { key: "honest",  label: "Honest",  travelDelta:  0, powerDelta:  0 },
  playful: { key: "playful", label: "Playful", travelDelta:  0, powerDelta:  0 },
} as const;
export type ToneKey = keyof typeof TONES;

// ─────────────────────────────────────────────────────────────────────────
// INTENTIONS
// ─────────────────────────────────────────────────────────────────────────
export const INTENTIONS = ["Apology", "Confession", "Invitation", "Reconciliation"] as const;
export type Intention = (typeof INTENTIONS)[number];

// ─────────────────────────────────────────────────────────────────────────
// SIGNALS — 6 types. Confidant places 3 placements per round (R4).
// ─────────────────────────────────────────────────────────────────────────
export const SIGNAL_TYPES = ["heart","thorn","eye","clock","mask","key"] as const;
export type SignalType = (typeof SIGNAL_TYPES)[number];

export type Signal = {
  type: SignalType;
  /** "route:garden" | "route:gallery" | "route:corridor" | "tone" | "intention" */
  target: string;
};

// ─────────────────────────────────────────────────────────────────────────
// CONFIDANT CARDS (12) — R1: most cost 1 AP, two heavy cards cost 2.
// ─────────────────────────────────────────────────────────────────────────
export type ConfidantCard = {
  key: string;
  title: string;
  cost: 1 | 2;
  type: "action" | "support" | "reveal";
  effect: string;
  /** Effects applied by resolution engine. */
  tag: string;
};

export const CONFIDANT_CARDS: Record<string, ConfidantCard> = {
  trace_footsteps:     { key:"trace_footsteps",     title:"Trace Footsteps",     cost:1, type:"reveal",  tag:"reveal_rival_route",
                         effect:"Reveal the Rival's chosen route to the Confidant." },
  read_the_seal:       { key:"read_the_seal",       title:"Read the Seal",       cost:1, type:"reveal",  tag:"reveal_rival_trait",
                         effect:"Reveal one of the Rival's traits (unless Hidden Seal)." },
  distract_guard:      { key:"distract_guard",      title:"Distract Guard",      cost:1, type:"support", tag:"cancel_guard",
                         effect:"Cancel the Guard obstacle on the chosen route." },
  clear_gossip:        { key:"clear_gossip",        title:"Clear Gossip",        cost:1, type:"support", tag:"clear_gossip",
                         effect:"Remove Gossip from one route. Enables Honest tiebreaker." },
  find_key:            { key:"find_key",            title:"Find Key",            cost:1, type:"support", tag:"unlock_door",
                         effect:"Unblock Locked Door on the chosen route." },
  safe_passage:        { key:"safe_passage",        title:"Safe Passage",        cost:1, type:"support", tag:"cancel_first_obstacle",
                         effect:"Cancel the FIRST obstacle on the Suitor's chosen route." },
  delay_rival:         { key:"delay_rival",         title:"Delay the Rival",     cost:1, type:"action",  tag:"rival_tt_plus_1",
                         effect:"Rival Travel Time +1 this round." },
  misdirect_messenger: { key:"misdirect_messenger", title:"Misdirect Messenger", cost:2, type:"action",  tag:"rival_force_longest",
                         effect:"R14 — Force the Rival onto the route with the highest Travel Time." },
  encouraging_note:    { key:"encouraging_note",    title:"Encouraging Note",    cost:1, type:"support", tag:"letter_power_plus_1",
                         effect:"Suitor Letter Power +1. Enables Playful tiebreaker." },
  secret_map:          { key:"secret_map",          title:"Secret Map",          cost:1, type:"support", tag:"suitor_tt_minus_1",
                         effect:"Suitor Travel Time −1 this round." },
  correct_address:     { key:"correct_address",     title:"Correct Address",     cost:1, type:"support", tag:"unblock_false_address",
                         effect:"Unblock False Address on the chosen route." },
  cover_story:         { key:"cover_story",         title:"Cover Story",         cost:2, type:"action",  tag:"convert_rumour",
                         effect:"After resolution, convert one Rumour earned this round to no token." },
};

// ─────────────────────────────────────────────────────────────────────────
// SUITOR CARDS (6) — drawn 1 per round, kept private until played.
// ─────────────────────────────────────────────────────────────────────────
export type SuitorCard = {
  key: string;
  title: string;
  effect: string;
  tag: string;
};

export const SUITOR_CARDS: Record<string, SuitorCard> = {
  brave_shortcut:    { key:"brave_shortcut",    title:"Brave Shortcut",
                       tag:"shortcut",
                       effect:"R13 — Suitor Travel Time −1. Safe Passage, Distract Guard, Clear Gossip, and Find Key have no effect this round." },
  careful_rewrite:   { key:"careful_rewrite",   title:"Careful Rewrite",
                       tag:"retone",
                       effect:"After seeing the route, swap your tone to a different one." },
  sealed_promise:    { key:"sealed_promise",    title:"Sealed Promise",
                       tag:"win_ties",
                       effect:"You win all ties this round (after Letter Power compares)." },
  second_thoughts:   { key:"second_thoughts",   title:"Second Thoughts",
                       tag:"reroute",
                       effect:"After choosing a route, swap to one of the others (once)." },
  direct_confession: { key:"direct_confession", title:"Direct Confession",
                       tag:"power_plus_2_rt_minus_1",
                       effect:"Suitor Letter Power +2, Rival Travel Time −1." },
  wait_right_moment: { key:"wait_right_moment", title:"Wait for the Right Moment",
                       tag:"wait_in_crowded_hall",
                       effect:"Negate Crowded Hall obstacle. Suitor Travel Time +1." },
};

// ─────────────────────────────────────────────────────────────────────────
// RIVAL TRAITS (6) — revealed in Resolution unless masked.
// ─────────────────────────────────────────────────────────────────────────
export type RivalTrait = {
  key: string;
  label: string;
  effect: string;
  tag: string;
};

export const RIVAL_TRAITS: Record<string, RivalTrait> = {
  fast_courier:    { key:"fast_courier",    label:"Fast Courier",
                     tag:"rt_minus_1",
                     effect:"Rival Travel Time −1." },
  silver_tongue:   { key:"silver_tongue",   label:"Silver Tongue",
                     tag:"lp_plus_1",
                     effect:"Rival Letter Power +1." },
  court_favourite: { key:"court_favourite", label:"Court Favourite",
                     tag:"recipient_pref_neutralised",
                     effect:"Recipient preference modifier on Suitor's letter is halved (round down)." },
  hidden_seal:     { key:"hidden_seal",     label:"Hidden Seal",
                     tag:"read_seal_fails",
                     effect:"Read the Seal cannot reveal this trait." },
  false_trail:     { key:"false_trail",     label:"False Trail",
                     tag:"trace_lies_50",
                     effect:"Trace Footsteps has a 50% chance of revealing the wrong route." },
  jealous_rival:   { key:"jealous_rival",   label:"Jealous Rival",
                     tag:"lp_plus_hearts",
                     effect:"Rival Letter Power gets an extra +1 once 2+ Hearts earned." },
};

// ─────────────────────────────────────────────────────────────────────────
// QUESTION TOKEN — single per round. Confidant answers with one of these.
// ─────────────────────────────────────────────────────────────────────────
export const QUESTION_ANSWERS = ["Trust", "Danger", "Unsure"] as const;
export type QuestionAnswer = (typeof QUESTION_ANSWERS)[number];

// ─────────────────────────────────────────────────────────────────────────
// CLUE TEMPLATES — 20 (per spec 9.10). Variables filled at round-gen time.
// ─────────────────────────────────────────────────────────────────────────
export const CLUE_TEMPLATES = {
  rival: [
    "The Rival is not using the {route}.",
    "The Rival favours routes with {obstacle}.",
    "The Rival is a {trait}.",                            // suppressed if Hidden Seal
    "The Rival's letter feels {power_descriptor}.",
    "The Rival was seen near the {route} earlier.",
  ],
  obstacle: [
    "The {route} hides a {obstacle}.",
    "One of the routes contains {obstacle}, but I cannot tell which.",
    "No {obstacle} on the {route}.",
    "The {route} is unusually quiet — perhaps too quiet.",
    "Take care near the {route}.",
  ],
  preference: [
    "{recipient} prefers {tone} letters this evening.",
    "{recipient} will not welcome a {tone} approach today.",
    "{recipient}'s mood is uncertain.",                   // no info
    "The court is whispering that {recipient} has been reading {tone} verses.",
    "{recipient} has had a long day; favour {tone} above all.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// PHASE TIMERS (R7)
// ─────────────────────────────────────────────────────────────────────────
export const PHASE_TIMERS = {
  tone_choice:     15_000,
  confidant_phase: 75_000,
  question_phase:  15_000,
  route_choice:    30_000,   // only this expiring triggers Rumour
  resolution:       8_000,
} as const;

// ─────────────────────────────────────────────────────────────────────────
// WIN / LOSS (per main spec, kept)
// ─────────────────────────────────────────────────────────────────────────
export const HEARTS_TO_WIN = 4;
export const RUMOURS_TO_LOSE = 3;
