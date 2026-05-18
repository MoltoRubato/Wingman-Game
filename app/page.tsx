import Link from "next/link";
import { TitleLogo, HeartToken, RumourToken, QuestionToken, APPip } from "@/components/svg/ui-tokens";
import { SIGNAL_COMPONENTS } from "@/components/svg/signals";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px 100px" }}>
      <header style={{ textAlign: "center", marginBottom: 56 }}>
        <TitleLogo width={620} />
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 22,
            color: "var(--cream)",
            margin: "20px auto 0",
            maxWidth: 720,
            lineHeight: 1.55,
          }}
        >
          A two-player cooperative game of love, rivalry, and indirect communication.
          One Suitor writes the letter. One Confidant sees the truth of the court and helps in silence.
          Reach four Hearts before three Rumours undo you.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginBottom: 56,
        }}
      >
        <Tile
          icon={<HeartToken size={64} />}
          title="Play a match"
          body="Hot-seat hand-off play. Pass the device between roles each phase. 4 Hearts to win, 3 Rumours to lose."
          href="/play"
          cta="Enter the court →"
          primary
        />
        <Tile
          icon={<QuestionToken size={64} />}
          title="Browse the design"
          body="Every asset, palette token, signal, obstacle, portrait, route, and card on one page."
          href="/library"
          cta="Open the library →"
        />
        <Tile
          icon={<RumourToken size={64} />}
          title="How it works"
          body="Three-phase round: Confidant places signals and plays cards. Suitor chooses tone, asks one question, sends the letter. Resolution reveals the Rival."
          href="/play"
          cta="Read by playing →"
        />
      </section>

      <section
        style={{
          padding: 28,
          border: "1px solid rgba(201,163,95,0.2)",
          background: "rgba(14, 19, 38, 0.4)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            margin: "0 0 16px",
            color: "var(--cream)",
            letterSpacing: "0.04em",
          }}
        >
          The vocabulary at a glance
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 18,
          }}
        >
          {(Object.entries(SIGNAL_COMPONENTS) as [keyof typeof SIGNAL_COMPONENTS, (typeof SIGNAL_COMPONENTS)[keyof typeof SIGNAL_COMPONENTS]][]).map(([k, Sig]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <Sig size={64} />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  marginTop: 6,
                  color: "var(--cream)",
                  fontSize: 16,
                  letterSpacing: "0.04em",
                  textTransform: "capitalize",
                }}
              >
                {k}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <APPip size={64} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                marginTop: 6,
                color: "var(--cream)",
                fontSize: 16,
                letterSpacing: "0.04em",
              }}
            >
              AP
            </div>
          </div>
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--cream-shadow)",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          — Court Silence is in force. —
        </p>
      </section>
    </main>
  );
}

const Tile = ({
  icon,
  title,
  body,
  href,
  cta,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
  primary?: boolean;
}) => (
  <Link
    href={href}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 26,
      background: primary ? "rgba(110, 31, 46, 0.22)" : "rgba(43, 19, 46, 0.28)",
      border: `1px solid ${primary ? "rgba(233, 196, 122, 0.45)" : "rgba(201, 163, 95, 0.2)"}`,
      textDecoration: "none",
      color: "var(--cream)",
      transition: "all 200ms ease",
    }}
  >
    <div>{icon}</div>
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 26,
        margin: "4px 0 0",
        color: "var(--gold-bright)",
        letterSpacing: "0.02em",
      }}
    >
      {title}
    </h3>
    <p style={{ margin: 0, color: "var(--cream)", lineHeight: 1.55, fontSize: 14 }}>{body}</p>
    <span
      style={{
        marginTop: "auto",
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--gold-bright)",
      }}
    >
      {cta}
    </span>
  </Link>
);
