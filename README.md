# Rival Hearts

A two-player cooperative web game of love, rivalry, and indirect communication. The Confidant knows the hidden mood, danger route, and Rival route, but can only place two symbols and choose one secret action. The Suitor sees the signals, then chooses one route and one tone. **3 Hearts win. 3 Rumours lose.**

Court Silence is in force.

## Quick Start

You need **Node 18+**, **Docker** running, and **Homebrew** on macOS.

```bash
brew install supabase/tap/supabase
npm install
supabase start
supabase db reset
supabase status -o env | awk -F= '
  /^API_URL=/         { print "NEXT_PUBLIC_SUPABASE_URL=" $2 }
  /^ANON_KEY=/        { print "NEXT_PUBLIC_SUPABASE_ANON_KEY=" $2 }
  /^SERVICE_ROLE_KEY=/{ print "SUPABASE_SERVICE_ROLE_KEY=" $2 }
' | tr -d '"' > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Play A Two-Browser Match

1. Player A opens the home page and chooses **Host a match**.
2. Player B opens the same URL in another browser or Incognito window and joins with the room code.
3. The game starts when both players are present.
4. Each round uses three phases: Confidant, Suitor, Resolution.
5. Roles rotate after each resolved round.

## Current Rules

- **Roles**: Suitor chooses the letter. Confidant knows the truth but cannot speak.
- **Routes**: Fast, Safe, Secret.
- **Tones**: Tender, Bold, Honest.
- **Signals**: Heart, Thorn, Clock, Mask.
- **Hidden facts**: one mood, one danger route, one Rival route.
- **Confidant action**: Clear Danger, Delay Rival, or Strengthen Letter.
- **Resolution**: exactly one token per round.

How a round resolves:

1. If the Suitor chose the danger route and Clear Danger was not used, gain 1 Rumour.
2. Else if the Suitor chose the Rival route, Delay Rival was not used, and the tone does not fit the mood, gain 1 Rumour.
3. Else gain 1 Heart.

Strengthen Letter makes any tone count as fitting the mood. Signals do not have direct mechanical effects. Their value is interpretation.

## Hidden Information Boundary

The Suitor view must not expose these fields before resolution:

- `mood_key`
- `danger_route`
- `rival_route`
- `confidant_action`
- `clues`

The Confidant view receives those fields. The redaction is enforced by the `get_room_view` Postgres function in [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) and [supabase/migrations/0003_simplified_rules.sql](supabase/migrations/0003_simplified_rules.sql).

## Project Map

```text
lib/game/content.ts       canonical routes, tones, signals, actions, win thresholds
lib/game/createRound.ts   seeded hidden-fact generator
lib/game/resolution.ts    pure one-token resolver
lib/game/schema.ts        Zod schemas for room actions
lib/server/game.ts        room creation, joins, phase transitions, resolution
lib/hooks/useRoomView.ts  role-redacted live room hook

app/play/                 hot-seat mode
app/room/[code]/          two-browser room mode
app/rules/                player-facing rulebook
app/library/              active visual asset catalogue
tests/resolution.test.ts  resolver, generator, schema, and redaction tests
```

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Generated Art Assets

Current game art is declared in [src/assets/assetManifest.ts](src/assets/assetManifest.ts). The active simplified game only generates the hero background and three route backgrounds; retired card, obstacle, and character portrait art has been removed.

```bash
cp .env.example .env.local
# add OPENAI_API_KEY to .env.local
npm run assets:generate
```

Generated files are written to `public/assets/generated/`. To force SVG route fallbacks during local testing, set `NEXT_PUBLIC_USE_GENERATED_ASSETS=false` in `.env.local` and restart the dev server.

Useful options:

```bash
npm run assets:generate -- --dry-run
npm run assets:generate -- --category=route
npm run assets:generate -- --only=hero_background,route_fast
npm run assets:clean
```

## Deploy

The app deploys to Vercel. Configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Then link Supabase and push migrations:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```
