import Link from "next/link";
import { ROUTE_KEYS, SIGNAL_TYPES, TONE_KEYS } from "@/lib/game/content";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { TitleLogo, HeartToken, RumourToken, TONE_COMPONENTS, TONE_META } from "@/components/svg/ui-tokens";

const PALETTE = [
  { label: "Teal Deep", hex: "#0e2329" },
  { label: "Gold Bright", hex: "#e9c47a" },
  { label: "Plum Deep", hex: "#2b132e" },
  { label: "Burgundy", hex: "#6e1f2e" },
  { label: "Cream", hex: "#f3e7d0" },
  { label: "Midnight", hex: "#0d1733" },
  { label: "Heart", hex: "#d8556a" },
  { label: "Rumour", hex: "#2a2024" },
];

export default function LibraryPage() {
  return (
    <div className="lib">
      <header className="lib-hero">
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <TitleLogo width={520} />
        </div>
        <div className="lib-sub">Asset Library</div>
        <div className="lib-meta">
          <div><strong>3</strong>routes</div>
          <div><strong>3</strong>tones</div>
          <div><strong>4</strong>signals</div>
          <div><strong>2</strong>score tokens</div>
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href="/play" className="btn btn-primary" style={{ fontSize: 14, padding: "14px 28px", textDecoration: "none" }}>
            Play a match
          </Link>
        </div>
      </header>

      <Section title="Palette" count="8 active tokens">
        <div className="swatch-grid">
          {PALETTE.map((p) => (
            <div key={p.label} className="swatch">
              <div className="swatch-color" style={{ background: p.hex }} />
              <div className="swatch-label">
                <div className="label">{p.label}</div>
                <div className="hex">{p.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Title Logo" count="Rival Hearts">
        <div style={{ background: "var(--midnight)", padding: 40, display: "flex", justifyContent: "center" }}>
          <TitleLogo width={720} />
        </div>
      </Section>

      <Section title="Signal Tokens" count="4 active symbols">
        <div className="asset-grid asset-grid--signals">
          {SIGNAL_TYPES.map((key) => {
            const Sig = SIGNAL_COMPONENTS[key];
            return (
              <div key={key} className="asset-card">
                <Sig size={148} />
                <div className="name">{SIGNAL_META[key].label}</div>
                <div className="desc">{SIGNAL_META[key].hint}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Score Tokens" count="Heart and Rumour">
        <div className="asset-grid asset-grid--tokens">
          <div className="asset-card"><HeartToken size={128} /><div className="name">Heart</div><div className="desc">Three Hearts win.</div></div>
          <div className="asset-card"><HeartToken size={128} active={false} /><div className="name">Heart empty</div><div className="desc">Empty score slot.</div></div>
          <div className="asset-card"><RumourToken size={128} /><div className="name">Rumour</div><div className="desc">Three Rumours lose.</div></div>
          <div className="asset-card"><RumourToken size={128} active={false} /><div className="name">Rumour empty</div><div className="desc">Empty score slot.</div></div>
        </div>
      </Section>

      <Section title="Tone Glyphs" count="3 letter moods">
        <div className="asset-grid asset-grid--tones">
          {TONE_KEYS.map((key) => {
            const Glyph = TONE_COMPONENTS[key];
            return (
              <div key={key} className="asset-card">
                <Glyph size={128} />
                <div className="name">{TONE_META[key].label}</div>
                <div className="desc">{TONE_META[key].hint}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Route Panoramas" count="3 choices">
        <div className="route-strip">
          {ROUTE_KEYS.map((key) => {
            const RouteArt = ROUTE_COMPONENTS[key];
            return (
              <div key={key} className="route-art-card">
                <RouteArt w={1280} h={420} />
                <div className="meta">
                  <div className="name">{ROUTE_META[key].label}</div>
                  <div className="desc">{ROUTE_META[key].hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <footer style={{ marginTop: 96, textAlign: "center", color: "var(--cream-shadow)", fontSize: 12, letterSpacing: "0.1em" }}>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18 }}>
          Court Silence is in force.
        </p>
        <p>
          <Link href="/" style={{ color: "var(--gold-bright)" }}>Home</Link>
          {"  ·  "}
          <Link href="/play" style={{ color: "var(--gold-bright)" }}>Play</Link>
        </p>
      </footer>
    </div>
  );
}

const Section = ({ title, count, children }: { title: string; count: string; children: React.ReactNode }) => (
  <section className="lib-section">
    <div className="lib-section-header">
      <h2>{title}</h2>
      <span className="lib-count">{count}</span>
    </div>
    {children}
  </section>
);
