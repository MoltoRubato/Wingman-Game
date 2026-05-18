import Link from "next/link";
import { CONFIDANT_CARDS, SUITOR_CARDS, RIVAL_TRAITS, type ToneKey } from "@/lib/game/content";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { OBSTACLE_COMPONENTS, OBSTACLE_META } from "@/components/svg/obstacles";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import { PORTRAITS } from "@/components/svg/portraits";
import {
  TitleLogo,
  HeartToken,
  RumourToken,
  QuestionToken,
  APPip,
  TONE_COMPONENTS,
  TONE_META,
} from "@/components/svg/ui-tokens";
import { CardFrame } from "@/components/svg/CardFrame";
import { CARD_ART } from "@/components/svg/card-art";

const PALETTE = [
  { label: "Teal Deep", hex: "#0e2329" },
  { label: "Teal Mid", hex: "#173b41" },
  { label: "Teal Soft", hex: "#2a565d" },
  { label: "Gold Bright", hex: "#e9c47a" },
  { label: "Gold Mid", hex: "#c9a35f" },
  { label: "Gold Deep", hex: "#8c6c2d" },
  { label: "Plum Deep", hex: "#2b132e" },
  { label: "Plum Mid", hex: "#4a234e" },
  { label: "Burgundy", hex: "#6e1f2e" },
  { label: "Burgundy Dp", hex: "#441119" },
  { label: "Cream", hex: "#f3e7d0" },
  { label: "Cream Warm", hex: "#e8d4ad" },
  { label: "Midnight", hex: "#0d1733" },
  { label: "Heart", hex: "#d8556a" },
  { label: "Rumour", hex: "#2a2024" },
  { label: "Question", hex: "#b07a2e" },
];

const ROLE_TOKENS = [
  { key: "suitor" as const, label: "The Suitor", desc: "Role token — burgundy." },
  { key: "confidant" as const, label: "The Confidant", desc: "Role token — plum." },
  { key: "rival" as const, label: "The Rival", desc: "Role token — charcoal & bronze." },
  { key: "celeste" as const, label: "Lady Celeste", desc: "Likes Tender + Honest." },
  { key: "aureon" as const, label: "Lord Aureon", desc: "Likes Bold + Playful." },
  { key: "mira" as const, label: "Mira the Poet", desc: "Likes Honest + Tender." },
  { key: "heir" as const, label: "The Masked Heir", desc: "Likes Playful + Bold." },
];

const fmtSigned = (n: number) => (n === 0 ? "±0" : n > 0 ? `+${n}` : `${n}`);

export default function LibraryPage() {
  return (
    <div className="lib">
      <header className="lib-hero">
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <TitleLogo width={520} />
        </div>
        <div className="lib-sub">— Asset Library —</div>
        <div className="lib-meta">
          <div><strong>3</strong>routes</div>
          <div><strong>6</strong>obstacles</div>
          <div><strong>6</strong>signals</div>
          <div><strong>4</strong>recipients · tones</div>
          <div><strong>24</strong>cards</div>
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href="/play" className="btn btn-primary" style={{ fontSize: 14, padding: "14px 28px", textDecoration: "none" }}>
            Play a match →
          </Link>
        </div>
      </header>

      <Section title="Palette" count="16 tokens · locked per spec">
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

      <Section title="Title Logo" count="1920×640 transparent">
        <div style={{ background: "var(--midnight)", padding: 40, display: "flex", justifyContent: "center" }}>
          <TitleLogo width={720} />
        </div>
      </Section>

      <Section title="Signal Tokens" count="6 · 256×256 base">
        <div className="asset-grid asset-grid--signals">
          {(Object.entries(SIGNAL_COMPONENTS) as [keyof typeof SIGNAL_COMPONENTS, (typeof SIGNAL_COMPONENTS)[keyof typeof SIGNAL_COMPONENTS]][]).map(([key, Sig]) => (
            <div key={key} className="asset-card">
              <Sig size={148} />
              <div className="name">{SIGNAL_META[key].label}</div>
              <div className="desc">&quot;{SIGNAL_META[key].hint}&quot;</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Obstacle Emblems" count="6 · 512×512 base">
        <div className="asset-grid asset-grid--obstacles">
          {(Object.entries(OBSTACLE_COMPONENTS) as [keyof typeof OBSTACLE_COMPONENTS, (typeof OBSTACLE_COMPONENTS)[keyof typeof OBSTACLE_COMPONENTS]][]).map(([key, Ob]) => (
            <div key={key} className="asset-card">
              <Ob size={148} />
              <div className="name">{OBSTACLE_META[key].label}</div>
              <div className="meta">
                {OBSTACLE_META[key].blocking ? "BLOCKING" : "MODIFIER"} · {OBSTACLE_META[key].mvp ? "MVP" : "STRETCH"}
              </div>
              <div className="desc">{OBSTACLE_META[key].desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="UI Tokens" count="Heart · Rumour · Question · AP · Tones">
        <div className="asset-grid asset-grid--tokens">
          <div className="asset-card"><HeartToken size={128} /><div className="name">Heart</div><div className="desc">Round won. Four to victory.</div></div>
          <div className="asset-card"><HeartToken size={128} active={false} /><div className="name">Heart (unfilled)</div><div className="desc">Empty score slot.</div></div>
          <div className="asset-card"><RumourToken size={128} /><div className="name">Rumour</div><div className="desc">Round lost. Three and you&apos;re exposed.</div></div>
          <div className="asset-card"><RumourToken size={128} active={false} /><div className="name">Rumour (unfilled)</div><div className="desc">Empty token.</div></div>
          <div className="asset-card"><QuestionToken size={128} /><div className="name">Question Token</div><div className="desc">One use per round.</div></div>
          <div className="asset-card"><QuestionToken size={128} used /><div className="name">Question (used)</div><div className="desc">Spent.</div></div>
          <div className="asset-card"><APPip size={80} /><div className="name">AP Pip</div><div className="desc">Three per round (Confidant).</div></div>
          <div className="asset-card"><APPip size={80} spent /><div className="name">AP (spent)</div><div className="desc">Empty pip.</div></div>
        </div>
      </Section>

      <Section title="Tone Glyphs" count="4 · circular badges">
        <div className="asset-grid asset-grid--tones">
          {(Object.entries(TONE_COMPONENTS) as [ToneKey, (typeof TONE_COMPONENTS)[ToneKey]][]).map(([key, Glyph]) => (
            <div key={key} className="asset-card">
              <Glyph size={128} />
              <div className="name">{TONE_META[key].label}</div>
              <div className="meta">TT {fmtSigned(TONE_META[key].travelDelta)} · LP {fmtSigned(TONE_META[key].powerDelta)}</div>
              <div className="desc">{TONE_META[key].hint}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Portraits" count="3 role tokens · 4 recipients">
        <div className="asset-grid asset-grid--portraits">
          {ROLE_TOKENS.map((p) => {
            const P = PORTRAITS[p.key];
            return (
              <div key={p.key} className="asset-card">
                <P w={260} h={325} />
                <div className="name">{p.label}</div>
                <div className="desc">{p.desc}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Route Panoramas" count="3 · 1536×768 painterly">
        <div className="route-strip">
          {(Object.entries(ROUTE_COMPONENTS) as [keyof typeof ROUTE_COMPONENTS, (typeof ROUTE_COMPONENTS)[keyof typeof ROUTE_COMPONENTS]][]).map(([key, RouteArt]) => (
            <div key={key} className="route-art-card">
              <RouteArt w={1280} h={420} />
              <div className="meta">
                <div className="name">{ROUTE_META[key].label}</div>
                <div className="desc">&quot;{ROUTE_META[key].mood}&quot;</div>
                <div className="stat">Base Travel Time · {ROUTE_META[key].baseTime}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Card Frames" count="3 templates">
        <div className="asset-grid asset-grid--cards">
          <div className="asset-card">
            <CardFrame variant="confidant" title="Sample" type="action" cost={1} effect="Confidant — plum & silver." width={200} />
            <div className="name">Confidant frame</div>
            <div className="desc">Plum + silver filigree.</div>
          </div>
          <div className="asset-card">
            <CardFrame variant="suitor" title="Sample" type="action" effect="Suitor — burgundy & rose-gold." width={200} />
            <div className="name">Suitor frame</div>
            <div className="desc">Burgundy + rose-gold filigree.</div>
          </div>
          <div className="asset-card">
            <CardFrame variant="rival" title="Sample" type="rival trait" effect="Rival reveal — bronze on charcoal." width={200} />
            <div className="name">Rival reveal frame</div>
            <div className="desc">Charcoal + tarnished bronze.</div>
          </div>
          <div className="asset-card">
            <CardFrame variant="confidant" flipped width={200} />
            <div className="name">Card back (Confidant)</div>
            <div className="desc">Hand-back rendering.</div>
          </div>
        </div>
      </Section>

      <Section title="Confidant Cards" count="12">
        <div className="asset-grid asset-grid--cards">
          {Object.values(CONFIDANT_CARDS).map((card) => {
            const Art = CARD_ART[card.key];
            return (
              <div key={card.key} className="asset-card" style={{ paddingTop: 14 }}>
                <CardFrame
                  variant="confidant"
                  title={card.title}
                  cost={card.cost}
                  type={card.type}
                  effect={card.effect}
                  art={Art ? <Art /> : null}
                  width={200}
                />
                <div className="meta">{card.cost} AP · {card.type}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Suitor Cards" count="6">
        <div className="asset-grid asset-grid--cards">
          {Object.values(SUITOR_CARDS).map((card) => {
            const Art = CARD_ART[card.key];
            return (
              <div key={card.key} className="asset-card" style={{ paddingTop: 14 }}>
                <CardFrame
                  variant="suitor"
                  title={card.title}
                  type="action"
                  effect={card.effect}
                  art={Art ? <Art /> : null}
                  width={200}
                />
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Rival Traits" count="6">
        <div className="asset-grid asset-grid--cards">
          {Object.values(RIVAL_TRAITS).map((card) => {
            const Art = CARD_ART[card.key];
            return (
              <div key={card.key} className="asset-card" style={{ paddingTop: 14 }}>
                <CardFrame
                  variant="rival"
                  title={card.label}
                  type="rival trait"
                  effect={card.effect}
                  art={Art ? <Art /> : null}
                  width={200}
                />
              </div>
            );
          })}
        </div>
      </Section>

      <footer style={{ marginTop: 96, textAlign: "center", color: "var(--cream-shadow)", fontSize: 12, letterSpacing: "0.1em" }}>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18 }}>
          — Court Silence is in force. —
        </p>
        <p>
          <Link href="/" style={{ color: "var(--gold-bright)" }}>← Home</Link>
          {"  ·  "}
          <Link href="/play" style={{ color: "var(--gold-bright)" }}>Play →</Link>
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
