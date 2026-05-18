"use client";

/**
 * Anonymous browser session UUID, stored in localStorage.
 * Used to identify a player within a room without auth.
 */
const KEY = "rh.session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
