"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/session";
import { TitleLogo } from "@/components/svg/ui-tokens";
import Link from "next/link";

export default function HostPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function createRoom() {
    setBusy(true);
    setErr(null);
    const sessionId = getSessionId();
    try {
      const r = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "failed");
      router.push(`/room/${j.code}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
      setBusy(false);
    }
  }

  return (
    <div className="splash">
      <div className="splash-inner" style={{ maxWidth: 640 }}>
        <TitleLogo width={420} />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            color: "var(--gold-bright)",
            textAlign: "center",
            margin: "24px 0 8px",
            fontWeight: 500,
          }}
        >
          Host a new match
        </h2>
        <p className="splash-prose" style={{ textAlign: "center" }}>
          You will be given a four-letter code. Share it with your partner. As soon as they join,
          the round begins. Each device shows only what its player should see.
        </p>
        {err && (
          <div style={{ textAlign: "center", color: "#ff9a9a", marginBottom: 16 }}>
            Couldn&apos;t create a room: {err}.{" "}
            <em style={{ fontStyle: "italic" }}>(Is Supabase configured? See README.)</em>
          </div>
        )}
        <div className="splash-controls">
          <Link href="/" className="btn btn-ghost">← Home</Link>
          <button className="btn btn-primary" onClick={createRoom} disabled={busy}>
            {busy ? "Opening the court…" : "Create room →"}
          </button>
        </div>
      </div>
    </div>
  );
}
