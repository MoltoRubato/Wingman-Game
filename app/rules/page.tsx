import Link from "next/link";
import { SIGNAL_COMPONENTS, SIGNAL_META } from "@/components/svg/signals";
import { TONE_COMPONENTS, TONE_META } from "@/components/svg/ui-tokens";
import { ROUTE_COMPONENTS, ROUTE_META } from "@/components/svg/routes";
import {
  CONFIDANT_ACTIONS,
  CONFIDANT_ACTION_KEYS,
  HEARTS_TO_WIN,
  RUMOURS_TO_LOSE,
  ROUTE_KEYS,
  SIGNAL_TYPES,
  TONE_KEYS,
} from "@/lib/game/content";

export const metadata = {
  title: "How to play - Rival Hearts",
  description: "The simplified rules of Rival Hearts.",
};

export default function RulesPage() {
  return (
    <main className="rules">
      <Link href="/" className="rules-back">
        <span aria-hidden>←</span> Back to the court
      </Link>

      <header className="rules-hero">
        <div className="rules-eyebrow">How to play</div>
        <h1>Rival Hearts</h1>
        <p className="rules-sub">
          Two players, one secretive court, and a tiny shared language. The Confidant knows the truth but cannot speak.
          The Suitor must read two symbols and decide how the letter travels.
        </p>
      </header>

      <section className="rule-block">
        <div className="rule-num">i · goal</div>
        <h2>Win 3 Hearts before 3 Rumours</h2>
        <p className="lede">
          Each round awards exactly one token. A Heart means the letter survives the court. A Rumour means danger or the Rival
          turned the moment against you.
        </p>
        <div className="rule-win">
          <div className="rule-win-box win">
            <div className="win-label">Victory</div>
            <div className="win-head">{HEARTS_TO_WIN} Hearts</div>
            <p>The romance becomes clear enough to survive attention.</p>
          </div>
          <div className="rule-win-box lose">
            <div className="win-label">Exposure</div>
            <div className="win-head">{RUMOURS_TO_LOSE} Rumours</div>
            <p>The court owns the story before the lovers do.</p>
          </div>
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">ii · roles</div>
        <h2>One sees. One chooses.</h2>
        <div className="rule-roles">
          <div className="rule-role">
            <div className="role-name">The Confidant</div>
            <div className="role-tag">Knows the hidden truth</div>
            <ul>
              <li>Sees the recipient mood, danger route, and Rival route.</li>
              <li>Places exactly two signals on routes or tones.</li>
              <li>Chooses one secret action: Clear Danger, Delay Rival, or Strengthen Letter.</li>
            </ul>
          </div>
          <div className="rule-role">
            <div className="role-name">The Suitor</div>
            <div className="role-tag">Makes the final choice</div>
            <ul>
              <li>Sees the three routes, three tones, and two placed signals.</li>
              <li>Does not see mood, danger route, Rival route, or action before choosing.</li>
              <li>Chooses one route and one tone on the same screen.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">iii · round flow</div>
        <h2>Five clear steps</h2>
        <div className="rule-flow">
          {[
            ["1", "Reveal to Confidant", "The Confidant sees mood, danger route, and Rival route."],
            ["2", "Signal", "The Confidant places exactly two signals on routes or tones."],
            ["3", "Secret action", "The Confidant chooses Clear Danger, Delay Rival, or Strengthen Letter."],
            ["4", "Suitor choice", "The Suitor chooses one route and one tone from the visible information."],
            ["5", "Resolution", "Reveal the hidden facts and award one Heart or one Rumour."],
          ].map(([num, title, copy]) => (
            <div key={num} className="rule-phase">
              <div className="phase-num">{num}</div>
              <div className="phase-body">
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">iv · routes and tones</div>
        <h2>The visible choices</h2>
        <div className="route-strip">
          {ROUTE_KEYS.map((key) => {
            const RouteArt = ROUTE_COMPONENTS[key];
            return (
              <div key={key} className="route-art-card">
                <RouteArt w={900} h={280} />
                <div className="meta">
                  <div className="name">{ROUTE_META[key].label}</div>
                  <div className="desc">{ROUTE_META[key].hint}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rule-glossary" style={{ marginTop: 18 }}>
          {TONE_KEYS.map((key) => {
            const Tone = TONE_COMPONENTS[key];
            return (
              <div key={key} className="gloss-row">
                <Tone size={44} />
                <div>
                  <div className="gloss-name">{TONE_META[key].label}</div>
                  <div className="gloss-hint">{TONE_META[key].hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">v · signals</div>
        <h2>The complete vocabulary</h2>
        <p className="lede">
          Signals never resolve the round by themselves. Their power is communication. The same Heart can mean a safe route,
          a fitting tone, or a gentle warning depending on where it is placed.
        </p>
        <div className="rule-glossary">
          {SIGNAL_TYPES.map((key) => {
            const Sig = SIGNAL_COMPONENTS[key];
            return (
              <div key={key} className="gloss-row">
                <Sig size={44} />
                <div>
                  <div className="gloss-name">{SIGNAL_META[key].label}</div>
                  <div className="gloss-hint">{SIGNAL_META[key].hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">vi · actions</div>
        <h2>One action, one protection</h2>
        <div className="rule-design-grid">
          {CONFIDANT_ACTION_KEYS.map((key) => (
            <div key={key} className="rule-design-card">
              <div className="design-label">{CONFIDANT_ACTIONS[key].shortLabel}</div>
              <h3>{CONFIDANT_ACTIONS[key].label}</h3>
              <p>{CONFIDANT_ACTIONS[key].effect}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">vii · win a round</div>
        <h2>How resolution works</h2>
        <div className="rule-design-grid">
          <div className="rule-design-card">
            <div className="design-label">Rumour</div>
            <h3>Danger first</h3>
            <p>If the Suitor chose the danger route and Clear Danger was not used, gain 1 Rumour.</p>
          </div>
          <div className="rule-design-card">
            <div className="design-label">Rumour</div>
            <h3>Rival second</h3>
            <p>If the Suitor chose the Rival route, Delay Rival was not used, and the tone does not fit, gain 1 Rumour.</p>
          </div>
          <div className="rule-design-card">
            <div className="design-label">Heart</div>
            <h3>Otherwise</h3>
            <p>Gain 1 Heart. Strengthen Letter makes any tone count as fitting the mood.</p>
          </div>
        </div>
      </section>

      <section className="rule-block">
        <div className="rule-num">viii · design logic</div>
        <h2>Simple rules, deep play</h2>
        <p>
          The theme and mechanics share the same pressure: love must move through a court that listens. The Confidant's
          silence is not a restriction outside the game. It is the game. Every round asks whether two players can build a
          shared meaning from a tiny symbolic language.
        </p>
        <p>
          Depth comes from interpretation rather than extra systems. A Mask on the Secret Route might warn about the Rival,
          or suggest that deception is the right plan. A Clock on Bold might mean speed matters, or that the obvious fast
          route is bait. The rules stay small while the readings multiply.
        </p>
      </section>

      <div className="rules-foot">
        <Link href="/host" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Host a match
        </Link>
        <span className="silence">Court Silence is in force.</span>
        <Link href="/play" className="btn btn-ghost" style={{ textDecoration: "none" }}>
          Try hot-seat
        </Link>
      </div>
    </main>
  );
}
