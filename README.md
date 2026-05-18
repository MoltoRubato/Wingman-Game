# Rival Hearts: The Confidant

A two-player cooperative web game of love, rivalry, and indirect communication. The Suitor writes a letter and chooses a route through a court. The Confidant sees the truth and helps in silence — three signals, three Action Points, one Question Token. An AI-controlled Rival races them with a competing message. **4 Hearts to win. 3 Rumours and you are exposed.**

Court Silence is in force.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## What's here

- **`/`** — landing page with role/signal vocabulary and a link to play.
- **`/library`** — asset library: every palette token, signal, obstacle, route panorama, portrait, card frame, and the 24 card illustrations.
- **`/play`** — full hot-seat match. Multi-round game loop, role rotation between Suitor and Confidant, end-of-match narrative based on Hearts/Rumours earned.

### Stack
- Next.js 15 (App Router) + TypeScript + React 19
- Zod for schema validation (`lib/game/schema.ts`)
- Vitest for resolver tests
- Howler.js wired but no audio files shipped (only the manifest under `public/audio/`)
- No Tailwind — design uses the bundle's `tokens.css` + `prototype.css` merged into `app/globals.css`.

### Code layout

```
lib/game/
  content.ts         canonical game data (routes, obstacles, recipients, tones, cards, traits, clue templates)
  resolution.ts      pure resolver — implements rules R1–R15 from the build plan
  schema.ts          Zod schemas for all RPC / RoundSnapshot boundaries
  createRound.ts     seeded round generator (port of engine.js)

components/svg/      all SVG painterly assets (filters, signals, obstacles, portraits, routes, frames, card-art, ui-tokens)

app/
  layout.tsx         mounts <PaintFilters/>, fonts, globals.css
  page.tsx           landing
  library/page.tsx   asset library
  play/
    page.tsx         match shell with menu / round / interround / gameover phases
    _views/          ConfidantView, SuitorView, ResolutionView, Round, HandoffSplash, InterroundView, GameOverView

tests/resolution.test.ts   22 tests covering blocking obstacles, TT/LP math, R15 tone tiebreakers, traits, support cards

public/
  writing/content.json     clue templates, recipient bios, narrative beats, tutorial copy
  audio/manifest.json      12 cue specs (files not included)
```

## Rules (canonical)

See `lib/game/resolution.ts` for the authoritative resolution order. Highlights:

- **Confidant economy**: 3 AP per round. Most cards cost 1 AP; Misdirect Messenger and Cover Story cost 2.
- **Communication**: 3 signal placements drawn from 6 signal types (Heart, Thorn, Eye, Clock, Mask, Key) — placed on a route, the Tone, or the Intention. Plus exactly one Question Token answered with Trust / Danger / Unsure.
- **Resolution order**: blocking obstacles → travel time → letter power → tone tiebreaker. Sealed Promise overrides any tiebreak. Cover Story converts a single Rumour to nothing.
- **Win**: 4 Hearts. **Loss**: 3 Rumours.

## What's not built yet

This is the **single-device hot-seat** port. Two players pass the device between roles each phase, as in the original prototype bundle. The plan also includes a full **2-device Supabase + Realtime** layer (rooms via 4-char code, server-authoritative phase machine, RLS-redacted hidden info). That's not in this commit — the schema and view code are designed to make it a clean upgrade rather than a rewrite.

## Verification

```bash
npm run test          # 22 resolver tests
npm run typecheck     # tsc --noEmit
npm run build         # next build (static, prerenders all 4 routes)
```

## Credits

Design bundle and visual identity from Claude Design. Engine, schemas, and asset SVGs ported pixel-faithful from the prototype.
