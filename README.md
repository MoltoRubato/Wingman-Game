# Rival Hearts: The Confidant

A two-player cooperative web game of love, rivalry, and indirect communication. The Suitor writes a letter and chooses a route through a court. The Confidant sees the truth and helps in silence — three signals, three Action Points, one Question Token. An AI-controlled Rival races them with a competing message. **4 Hearts to win. 3 Rumours and you are exposed.**

Court Silence is in force.

---

## Quick start (5 minutes, two browsers)

You need: **Node 18+**, **Docker** (running), and **Homebrew** (macOS).

```bash
# 1. Install the Supabase CLI
brew install supabase/tap/supabase

# 2. Install Node deps
npm install

# 3. Boot the local Supabase stack (Postgres + Realtime + REST), apply migrations
supabase start
supabase db reset                # runs supabase/migrations/0001_init.sql

# 4. Write the local Supabase URL + keys into .env.local
supabase status -o env | awk -F= '
  /^API_URL=/         { print "NEXT_PUBLIC_SUPABASE_URL=" $2 }
  /^ANON_KEY=/        { print "NEXT_PUBLIC_SUPABASE_ANON_KEY=" $2 }
  /^SERVICE_ROLE_KEY=/{ print "SUPABASE_SERVICE_ROLE_KEY=" $2 }
' | tr -d '"' > .env.local

# 5. Run the Next.js dev server
npm run dev                      # http://localhost:3000
```

### Play a real 2-device match

1. **Player A** opens [http://localhost:3000](http://localhost:3000) → **Host a match** → clicks **Create room →**. They land on the lobby with a 4-letter code (e.g. `NRX5`).
2. **Player B** opens the same URL in a **second browser** (or an Incognito window — separate sessions need separate `localStorage`). Clicks **Join with code**, types the 4-letter code → **Enter the room →**.
3. The game starts as soon as the second player joins. Each browser sees only its role:
   - **Slot 1** is the Suitor (first round). They see a "your Confidant is choosing in silence" splash.
   - **Slot 2** is the Confidant. They see the three private clues, their hand of 5 cards, the route obstacles. They place ≤3 signals and play cards (3 AP). When they click **Hand the device to the Suitor →**, the Suitor's screen advances automatically via Realtime.
4. From there the round walks through Tone → Question (or skip) → Answer → Route → Resolution. Roles rotate after each round. **First to 4 Hearts wins; 3 Rumours loses.**

If you only have one device, the **Hot-seat** mode at `/play` works without Supabase at all (single device, pass-the-device handoff splashes between phases).

---

## Testing the hidden-info boundary

This is the security-critical bit. With the dev server running:

```bash
# Create a room as Player A
SID_A=$(uuidgen | tr 'A-Z' 'a-z')
SID_B=$(uuidgen | tr 'A-Z' 'a-z')
CODE=$(curl -s -X POST http://localhost:3000/api/rooms/create \
  -H content-type:application/json \
  -d "{\"sessionId\":\"$SID_A\"}" | jq -r .code)

# B joins → game starts
curl -s -X POST http://localhost:3000/api/rooms/join \
  -H content-type:application/json \
  -d "{\"sessionId\":\"$SID_B\",\"code\":\"$CODE\"}"

# Fetch the Suitor's view
curl -s "http://localhost:3000/api/rooms/$CODE/state?sid=$SID_A" | jq '.round | keys'
# → should NOT include "clues", "confidant_hand", "rival_route", "rival_trait"
# → SHOULD include "suitor_hand"

# Fetch the Confidant's view
curl -s "http://localhost:3000/api/rooms/$CODE/state?sid=$SID_B" | jq '.round | keys'
# → SHOULD include "clues", "confidant_hand", "rival_route", "rival_trait"
```

The redaction is enforced server-side by the `get_room_view` Postgres function (see `supabase/migrations/0001_init.sql`). RLS denies direct table SELECT to all roles, so even with the anon key in DevTools, a Suitor cannot read the Confidant's data.

---

## What's where

```
lib/game/                  canonical engine (unchanged from the design bundle)
  content.ts               routes, obstacles, recipients, tones, 12 Confidant cards, 6 Suitor cards, 6 Rival traits
  resolution.ts            pure resolver — rules R1–R15
  schema.ts                Zod schemas
  createRound.ts           seeded round generator

lib/server/game.ts         server-side game logic — room creation, joins, phase transitions, resolution write-back
lib/supabase/server.ts     service-role Supabase client (server only)
lib/supabase/client.ts     anon Supabase client (browser, used for Realtime subscriptions)
lib/hooks/useRoomView.ts   client hook — subscribes to Realtime + refetches the room view on change
lib/session.ts             anonymous localStorage UUID

components/svg/            all SVG painterly assets (filters, signals, obstacles, portraits, routes, frames, 24 card illustrations, UI tokens)

app/
  page.tsx                 landing — host, join, hot-seat, library
  layout.tsx               mounts <PaintFilters/>, fonts, globals.css
  globals.css              merged tokens + prototype CSS from the bundle
  host/page.tsx            create a room
  join/page.tsx            enter a code
  room/[code]/page.tsx     live match shell — gates views by role, fires actions
  room/[code]/_views/      Lobby, WaitingFor, ConfidantStep, SuitorStep, ResolutionStep, GameOverStep, adapt.ts
  play/                    hot-seat (single device) game shell
  library/page.tsx         asset catalogue
  api/rooms/create         POST — { sessionId } → { code }
  api/rooms/join           POST — { sessionId, code } → { ok, slot }
  api/rooms/[code]/state   GET  — ?sid=… → role-redacted RoomView
  api/rooms/[code]/action  POST — { sessionId, action } → { ok }

supabase/
  config.toml              CLI config
  migrations/0001_init.sql tables (rooms, players, games, rounds) + RLS + get_room_view RPC

tests/resolution.test.ts   22 Vitest cases covering rules R1–R15

public/writing/content.json   clue templates, recipient bios, narrative beats
public/audio/manifest.json    12 audio cue specs (files not bundled — Howler is wired but optional)
```

---

## Rules (canonical)

- **Confidant economy**: 3 AP per round. Most cards cost 1 AP; Misdirect Messenger and Cover Story cost 2.
- **Communication**: 3 signal placements drawn from 6 signal types (Heart, Thorn, Eye, Clock, Mask, Key) — placed on a route, the Tone, or the Intention. Plus one Question Token answered with Trust / Danger / Unsure.
- **Resolution order**: blocking obstacles → travel time → letter power → tone tiebreaker. Sealed Promise wins any tied LP. Cover Story converts a single Rumour to nothing.
- **Win**: 4 Hearts. **Loss**: 3 Rumours. Roles rotate every round.

See [lib/game/resolution.ts](lib/game/resolution.ts) for the authoritative resolver.

---

## Deploy

The app deploys cleanly to **Vercel**. Two env vars on Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Point those at a **hosted Supabase project** instead of local. Run the migration:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

That's it. No other infra needed.

---

## Verify

```bash
npm run test          # 22 resolver tests
npm run typecheck     # tsc --noEmit
npm run build         # next build
```

---

## Credits

Design bundle and visual identity from Claude Design. Engine, schemas, and asset SVGs ported pixel-faithful from the prototype.
