"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { browserClient } from "@/lib/supabase/client";
import { getSessionId } from "@/lib/session";

export type RoomView = {
  status?: "lobby" | "in_game" | "finished";
  code?: string;
  self_slot?: number | null;
  players?: Array<{ slot: number; joined_at: string }>;
  game?: {
    hearts: number;
    rumours: number;
    round_number: number;
    status: "active" | "won" | "lost";
  };
  round?: {
    id: string;
    number: number;
    suitor_slot: number;
    current_phase: string;
    recipient: string;
    intention: string;
    routes: Array<{ key: string; baseTime: number; obstacles: string[]; originalObstacles: string[] }>;
    suitor_tone: string | null;
    played_cards: Array<{ key: string; routeTarget: string | null }>;
    signals: Array<{ type: string; target: string }>;
    question: { route?: string; answer?: string | null } | null;
    chosen_route: string | null;
    suitor_card_played: string | null;
    clues?: string[];
    confidant_hand?: string[];
    suitor_hand?: string[];
    rival_route?: string;
    rival_trait?: string;
    result?: {
      outcome: "success" | "fail" | "fail_blocking";
      heartsDelta: number;
      rumoursDelta: number;
      suitorTravelTime: number;
      rivalTravelTime: number;
      suitorLetterPower: number;
      rivalLetterPower: number;
      reason: string;
      trace: string[];
    };
  };
  error?: string;
};

export function useRoomView(code: string) {
  const [view, setView] = useState<RoomView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef<string>("");

  if (!sessionId.current) sessionId.current = getSessionId();

  const refetch = useCallback(async () => {
    try {
      const r = await fetch(
        `/api/rooms/${encodeURIComponent(code)}/state?sid=${sessionId.current}`,
        { cache: "no-store" },
      );
      const j = (await r.json()) as RoomView;
      if (j.error) setError(j.error);
      else setView(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "fetch_failed");
    }
  }, [code]);

  useEffect(() => {
    refetch();
    let cancelled = false;

    const supa = browserClient();
    const channel = supa
      .channel(`room:${code}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rounds" },
        () => !cancelled && refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        () => !cancelled && refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => !cancelled && refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => !cancelled && refetch(),
      )
      .subscribe();

    /* Light fallback poll for environments where Realtime is sluggish. */
    const poll = setInterval(() => !cancelled && refetch(), 4000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      supa.removeChannel(channel);
    };
  }, [code, refetch]);

  return { view, error, refetch, sessionId: sessionId.current };
}

export async function sendAction(code: string, sessionId: string, action: object) {
  const r = await fetch(`/api/rooms/${encodeURIComponent(code)}/action`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId, action }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error ?? `http_${r.status}`);
  }
  return r.json();
}
