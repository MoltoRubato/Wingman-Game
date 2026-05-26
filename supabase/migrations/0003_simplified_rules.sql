alter table rounds add column if not exists mood_key text;
alter table rounds add column if not exists danger_route text;
alter table rounds add column if not exists confidant_action text;

update rounds
set
  mood_key = coalesce(mood_key, suitor_tone, 'tender'),
  danger_route = coalesce(danger_route, 'fast'),
  confidant_action = confidant_action
where mood_key is null or danger_route is null;

alter table rounds alter column mood_key set default 'tender';
alter table rounds alter column danger_route set default 'fast';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'rounds' and column_name = 'rival_trait'
  ) then
    alter table rounds alter column rival_trait drop not null;
  end if;
end $$;

create or replace function get_room_view(p_code text, p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room rooms%rowtype;
  v_game games%rowtype;
  v_round rounds%rowtype;
  v_self_slot int;
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
      'code', v_room.code,
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

  v_is_suitor := v_self_slot = v_round.suitor_slot;
  v_is_confidant := v_self_slot is not null and v_self_slot <> v_round.suitor_slot;

  v_round_payload := jsonb_build_object(
    'id', v_round.id,
    'number', v_round.number,
    'suitor_slot', v_round.suitor_slot,
    'current_phase', v_round.current_phase,
    'recipient', v_round.recipient,
    'intention', v_round.intention,
    'routes', v_round.routes,
    'signals', v_round.signals,
    'suitor_tone', v_round.suitor_tone,
    'chosen_route', v_round.chosen_route
  );

  if v_is_confidant then
    v_round_payload := v_round_payload || jsonb_build_object(
      'mood_key', v_round.mood_key,
      'danger_route', v_round.danger_route,
      'rival_route', v_round.rival_route,
      'confidant_action', v_round.confidant_action,
      'clues', v_round.clues
    );
  end if;

  if v_round.current_phase in ('resolution', 'gameover') then
    v_round_payload := v_round_payload || jsonb_build_object(
      'mood_key', v_round.mood_key,
      'danger_route', v_round.danger_route,
      'rival_route', v_round.rival_route,
      'confidant_action', v_round.confidant_action,
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
