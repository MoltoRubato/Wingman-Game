/**
 * Flip a flag to `true` once you drop the matching file into
 * `public/art/<kind>/<key>.png` (or `.webp` / `.svg` — update the extension here too).
 *
 * The portrait code reads this map; when a flag is true, the SVG frame
 * stays but the inner body is replaced with the AI-generated image.
 * When false, the original programmatic SVG renders.
 */

export const PORTRAIT_ASSETS: Record<
  "suitor" | "confidant" | "rival" | "celeste" | "aureon" | "mira" | "heir",
  { enabled: boolean; ext: "png" | "webp" | "jpg" | "svg" }
> = {
  suitor:    { enabled: true, ext: "png" },
  confidant: { enabled: true, ext: "png" },
  rival:     { enabled: true, ext: "png" },
  celeste:   { enabled: true, ext: "png" },
  aureon:    { enabled: true, ext: "png" },
  mira:      { enabled: true, ext: "png" },
  heir:      { enabled: true, ext: "png" },
};

export const portraitAssetUrl = (key: keyof typeof PORTRAIT_ASSETS): string | null => {
  const entry = PORTRAIT_ASSETS[key];
  return entry.enabled ? `/art/portraits/${key}.${entry.ext}` : null;
};

// ─────────────────────────────────────────────────────────────────────────
// ROUTE BACKGROUNDS — `public/art/routes/<key>.<ext>`
// ─────────────────────────────────────────────────────────────────────────
export const ROUTE_ASSETS: Record<
  "garden" | "gallery" | "corridor",
  { enabled: boolean; ext: "png" | "webp" | "jpg" }
> = {
  garden:   { enabled: true, ext: "png" },
  gallery:  { enabled: true, ext: "png" },
  corridor: { enabled: true, ext: "png" },
};

export const routeAssetUrl = (key: keyof typeof ROUTE_ASSETS): string | null => {
  const entry = ROUTE_ASSETS[key];
  return entry.enabled ? `/art/routes/${key}.${entry.ext}` : null;
};

// ─────────────────────────────────────────────────────────────────────────
// CARD ART — `public/art/cards/<key>.<ext>`
// Keys match `CONFIDANT_CARDS`, `SUITOR_CARDS`, and `RIVAL_TRAITS` in content.ts.
// ─────────────────────────────────────────────────────────────────────────
type CardAssetEntry = { enabled: boolean; ext: "png" | "webp" | "jpg" };

export const CARD_ASSETS: Record<string, CardAssetEntry> = {
  // Confidant (12)
  trace_footsteps:     { enabled: true, ext: "png" },
  read_the_seal:       { enabled: true, ext: "png" },
  distract_guard:      { enabled: true, ext: "png" },
  clear_gossip:        { enabled: true, ext: "png" },
  find_key:            { enabled: true, ext: "png" },
  safe_passage:        { enabled: true, ext: "png" },
  delay_rival:         { enabled: true, ext: "png" },
  misdirect_messenger: { enabled: true, ext: "png" },
  encouraging_note:    { enabled: true, ext: "png" },
  secret_map:          { enabled: true, ext: "png" },
  correct_address:     { enabled: true, ext: "png" },
  cover_story:         { enabled: true, ext: "png" },
  // Suitor (6)
  brave_shortcut:    { enabled: true, ext: "png" },
  careful_rewrite:   { enabled: true, ext: "png" },
  sealed_promise:    { enabled: true, ext: "png" },
  second_thoughts:   { enabled: true, ext: "png" },
  direct_confession: { enabled: true, ext: "png" },
  wait_right_moment: { enabled: true, ext: "png" },
  // Rival traits (6)
  fast_courier:    { enabled: true, ext: "png" },
  silver_tongue:   { enabled: true, ext: "png" },
  court_favourite: { enabled: true, ext: "png" },
  hidden_seal:     { enabled: true, ext: "png" },
  false_trail:     { enabled: true, ext: "png" },
  jealous_rival:   { enabled: true, ext: "png" },
};

export const cardAssetUrl = (key: string): string | null => {
  const entry = CARD_ASSETS[key];
  return entry?.enabled ? `/art/cards/${key}.${entry.ext}` : null;
};
