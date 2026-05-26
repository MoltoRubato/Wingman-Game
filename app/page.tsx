import Link from "next/link";
import type { CSSProperties } from "react";
import { HEARTS_TO_WIN, RUMOURS_TO_LOSE, SIGNAL_TYPES } from "@/lib/game/content";
import { TitleLogo, HeartToken, RumourToken } from "@/components/svg/ui-tokens";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { assetCssUrl } from "@/src/assets/assetManifest";

export default function HomePage() {
  const heroStyle = {
    "--hero-art": assetCssUrl("hero_background") ?? "none",
  } as CSSProperties;

  return (
    <main className="home">
      <header className="home-hero" style={heroStyle}>
        <div className="logo-wrap">
          <TitleLogo width={560} />
        </div>
        <p className="tagline">
          A two-player cooperative game of romance, rivalry, and symbolic trust.
          The Confidant knows the truth but can only place two signals. The Suitor reads them,
          chooses one route and one tone, and hopes the letter survives the court.
          Reach <strong>{HEARTS_TO_WIN} Hearts</strong> before <strong>{RUMOURS_TO_LOSE} Rumours</strong>.
        </p>
      </header>

      <div className="home-rule">Choose your seat at the court</div>

      <section className="play-modes" aria-label="Play modes">
        <Link href="/host" className="play-mode play-mode--primary">
          <div className="pm-icon"><HeartToken size={56} /></div>
          <div className="pm-eyebrow">Two devices</div>
          <h3>Host a match</h3>
          <p>
            Open a room, get a four-letter code, and share it. Hidden information stays hidden on each screen.
          </p>
          <span className="pm-cta">Open a room <span aria-hidden>→</span></span>
        </Link>

        <Link href="/join" className="play-mode">
          <div className="pm-icon"><RumourToken size={56} /></div>
          <div className="pm-eyebrow">Invited</div>
          <h3>Join with code</h3>
          <p>A friend has invited you. Enter their four-letter code to enter the court.</p>
          <span className="pm-cta">Enter a code <span aria-hidden>→</span></span>
        </Link>

        <Link href="/play" className="play-mode">
          <div className="pm-icon"><HeartToken size={56} active={false} /></div>
          <div className="pm-eyebrow">One device</div>
          <h3>Hot-seat</h3>
          <p>Pass the device after the Confidant encodes the hidden facts. Best for a first run.</p>
          <span className="pm-cta">Hand the device <span aria-hidden>→</span></span>
        </Link>
      </section>

      <section className="how-section" aria-label="How to play">
        <div className="section-head">
          <h2>First time at court?</h2>
          <Link href="/rules" className="head-meta" style={{ textDecoration: "none" }}>
            Read the full rules →
          </Link>
        </div>

        <div className="how-steps">
          <div className="how-step">
            <div className="num">i.</div>
            <h4>Two roles</h4>
            <p>
              The Confidant sees the mood, danger route, and Rival route. The Suitor does not.
            </p>
          </div>
          <div className="how-step">
            <div className="num">ii.</div>
            <h4>Two signals</h4>
            <p>
              Heart, Thorn, Clock, and Mask are the whole language. Signals guide interpretation but never resolve the round alone.
            </p>
          </div>
          <div className="how-step">
            <div className="num">iii.</div>
            <h4>One token</h4>
            <p>
              The Suitor chooses a route and tone. Resolution reveals the hidden facts and awards one Heart or one Rumour.
            </p>
          </div>
        </div>

        <div className="how-foot">
          <p>
            Court Silence is in force: the Confidant cannot speak, gesture, or write anything outside the two signals.
          </p>
          <Link href="/rules" className="btn">Read the rules</Link>
        </div>
      </section>

      <section className="vocab-band" aria-label="Signal vocabulary">
        <div className="section-head" style={{ borderBottom: "none", marginBottom: 18, paddingBottom: 0 }}>
          <h2 style={{ fontSize: 24 }}>The four silent signals</h2>
          <span className="head-meta">2 per round</span>
        </div>
        <div className="vocab-row">
          {SIGNAL_TYPES.map((key) => {
            const Sig = SIGNAL_COMPONENTS[key];
            return (
              <div key={key} className="vocab-cell">
                <Sig size={56} />
                <div className="vocab-name">{SIGNAL_META[key].label}</div>
                <div className="vocab-hint">{SIGNAL_META[key].hint}</div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="home-foot">
        <Link href="/library" className="foot-link">Browse the design library</Link>
        <span className="silence">Court Silence is in force.</span>
        <Link href="/rules" className="foot-link">How to play</Link>
      </footer>
    </main>
  );
}
