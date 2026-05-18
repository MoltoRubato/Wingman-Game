-- Rival Hearts schema. Server-authoritative; client never SELECTs directly.

create extension if not exists "pgcrypto";

create table if not exists rooms (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null check (code ~ '^[A-HJ-NP-Y2-9]{4}$'),
  status      text not null default 'lobby',  -- lobby | in_game | finished
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '24 hours')
);

create table if not exists players (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references rooms(id) on delete cascade,
  slot        int  not null check (slot in (1, 2)),
  session_id  uuid not null,
  joined_at   timestamptz not null default now(),
  unique (room_id, slot),
  unique (room_id, session_id)
);

create table if not exists games (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null unique references rooms(id) on delete cascade,
  hearts        int  not null default 0,
  rumours       int  not null default 0,
  round_number  int  not null default 1,
  status        text not null default 'active',  -- active | won | lost
  created_at    timestamptz not null default now()
);

create table if not exists rounds (
  id              uuid primary key default gen_random_uuid(),
  game_id         uuid not null references games(id) on delete cascade,
  number          int  not null,
  suitor_slot     int  not null check (suitor_slot in (1, 2)),
  current_phase   text not null,
  recipient       text not null,
  intention       text not null,
  routes          jsonb not null,
  rival_route     text not null,
  rival_trait     text not null,
  clues           jsonb not null,
  confidant_hand  jsonb not null,
  suitor_hand     jsonb not null,
  suitor_tone     text,
  played_cards    jsonb not null default '[]'::jsonb,
  signals         jsonb not null default '[]'::jsonb,
  question        jsonb,
  chosen_route    text,
  suitor_card_played text,
  result          jsonb,
  created_at      timestamptz not null default now(),
  unique (game_id, number)
);

create index if not exists rooms_code_idx on rooms (code);
create index if not exists players_room_idx on players (room_id);
create index if not exists rounds_game_idx on rounds (game_id, number desc);

-- RLS: deny all direct access. All reads go through RPC. All writes through service role.
alter table rooms   enable row level security;
alter table players enable row level security;
alter table games   enable row level security;
alter table rounds  enable row level security;

-- (no policies = deny all for anon/authenticated roles)

-- Allow Realtime to broadcast row changes (the publication is created by Supabase by default).
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table rounds;

-- Returns a role-redacted view of the current round for the given session.
create or replace function get_room_view(p_code text, p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room   rooms%rowtype;
  v_game   games%rowtype;
  v_round  rounds%rowtype;
  v_self_slot int;
  v_partner_slot int;
  v_is_suitor boolean;
  v_is_confidant boolean;
  v_players jsonb;
  v_round_payload jsonb;
begin
  select * into v_room from rooms where code = p_code;
  if not found then
    return jsonb_build_object('error', 'no_such_room');
  end if;

  select slot into v_self_slot from players
    where room_id = v_room.id and session_id = p_session_id;

  select jsonb_agg(jsonb_build_object('slot', slot, 'joined_at', joined_at) order by slot)
    into v_players from players where room_id = v_room.id;

  if v_room.status = 'lobby' then
    return jsonb_build_object(
      'status', 'lobby',
      'code',   v_room.code,
      'self_slot', v_self_slot,
      'players', coalesce(v_players, '[]'::jsonb)
    );
  end if;

  select * into v_game from games where room_id = v_room.id;
  if not found then
    return jsonb_build_object('error', 'no_game');
  end if;

  select * into v_round from rounds where game_id = v_game.id order by number desc limit 1;
  if not found then
    return jsonb_build_object('error', 'no_round');
  end if;

  v_is_suitor    := v_self_slot = v_round.suitor_slot;
  v_is_confidant := v_self_slot is not null and v_self_slot <> v_round.suitor_slot;

  -- Redacted round payload
  v_round_payload := jsonb_build_object(
    'id', v_round.id,
    'number', v_round.number,
    'suitor_slot', v_round.suitor_slot,
    'current_phase', v_round.current_phase,
    'recipient', v_round.recipient,
    'intention', v_round.intention,
    'routes', v_round.routes,
    'suitor_tone', v_round.suitor_tone,
    'played_cards', v_round.played_cards,
    'signals', v_round.signals,
    'question', v_round.question,
    'chosen_route', v_round.chosen_route,
    'suitor_card_played', v_round.suitor_card_played
  );

  -- Confidant sees clues, hand, rival route/trait at all phases.
  if v_is_confidant then
    v_round_payload := v_round_payload
      || jsonb_build_object(
        'clues', v_round.clues,
        'confidant_hand', v_round.confidant_hand,
        'rival_route', v_round.rival_route,
        'rival_trait', v_round.rival_trait
      );
  end if;

  -- Suitor sees suitor hand always. Sees rival trait/route only at resolution.
  if v_is_suitor then
    v_round_payload := v_round_payload || jsonb_build_object('suitor_hand', v_round.suitor_hand);
  end if;

  -- After resolution, everyone sees the result + revealed rival info.
  if v_round.current_phase in ('resolution', 'interround', 'gameover') then
    v_round_payload := v_round_payload || jsonb_build_object(
      'rival_route', v_round.rival_route,
      'rival_trait', v_round.rival_trait,
      'result', v_round.result
    );
  end if;

  return jsonb_build_object(
    'status', v_room.status,
    'code', v_room.code,
    'self_slot', v_self_slot,
    'players', coalesce(v_players, '[]'::jsonb),
    'game', jsonb_build_object(
      'hearts', v_game.hearts,
      'rumours', v_game.rumours,
      'round_number', v_game.round_number,
      'status', v_game.status
    ),
    'round', v_round_payload
  );
end;
$$;

grant execute on function get_room_view(text, uuid) to anon, authenticated;
