"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/session";
import { TitleLogo } from "@/components/svg/ui-tokens";
import Link from "next/link";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!/^[A-HJ-NP-Y2-9]{4}$/.test(clean)) {
      setErr("Code must be four letters/digits. Allowed alphabet: A-Y minus I/O/Z, 2-9.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), code: clean }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "failed");
      router.push(`/room/${clean}`);
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
          Join a match
        </h2>
        <p className="splash-prose" style={{ textAlign: "center" }}>
          Enter the four-letter code your host has shared with you.
        </p>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            maxLength={4}
            placeholder="ABCD"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              letterSpacing: "0.18em",
              width: 240,
              textAlign: "center",
              background: "rgba(14,19,38,0.6)",
              border: "1px solid rgba(201,163,95,0.3)",
              color: "var(--gold-bright)",
              padding: "16px 12px",
              borderRadius: 2,
              textTransform: "uppercase",
            }}
          />
          {err && (
            <div style={{ color: "#ff9a9a", fontSize: 13, textAlign: "center" }}>{err}</div>
          )}
          <div className="splash-controls">
            <Link href="/" className="btn btn-ghost">← Home</Link>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Knocking…" : "Enter the room →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
