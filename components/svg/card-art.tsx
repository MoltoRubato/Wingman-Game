import type { ComponentType, ReactNode } from "react";
import { cardAssetUrl } from "@/lib/art/manifest";

type ArtBGProps = { gradient?: string; children?: ReactNode };

/**
 * Drop a PNG into `public/art/cards/<key>.png` and flip `enabled: true`
 * in `lib/art/manifest.ts` to replace the programmatic SVG art for that card.
 * The card art slot is 600×500 (6:5).
 */
const withAICardArt = (key: string, SvgFallback: ComponentType): ComponentType => {
  const Wrapped = () => {
    const ai = cardAssetUrl(key);
    if (!ai) return <SvgFallback />;
    return (
      <g>
        <rect x="0" y="0" width="600" height="500" fill="url(#candle-vignette)" />
        <image
          href={ai}
          x="0"
          y="0"
          width="600"
          height="500"
          preserveAspectRatio="xMidYMid slice"
        />
        <rect x="0" y="0" width="600" height="500" fill="url(#candle-vignette)" opacity="0.35" />
      </g>
    );
  };
  Wrapped.displayName = `CardArt_${key}`;
  return Wrapped;
};

/**
 * CARD CENTER ILLUSTRATIONS — 24 total.
 * 12 Confidant + 6 Suitor + 6 Rival traits.
 * Each rendered into the 600×500 art window of CardFrame.
 * Painterly stylized SVG.
 */

const ArtBG = ({ gradient, children }: ArtBGProps) => (
  <g>
    <rect x="0" y="0" width="600" height="500" fill={`url(#${gradient || "candle-vignette"})`} />
    <g filter="url(#brush-soft)">{children}</g>
  </g>
);

/* ═════════ CONFIDANT CARDS (12) ═════════ */

export const Art_TraceFootsteps = () => (
  <ArtBG gradient="plum-vignette">
    {/* dust ground with lantern light fall-off */}
    <ellipse cx="300" cy="430" rx="280" ry="100" fill="#3a2418" opacity="0.7" />
    <ellipse cx="180" cy="180" rx="200" ry="80" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
    {/* boot prints — receding */}
    {[
      [120, 420, 1.0, -8],
      [200, 380, 0.85, -12],
      [270, 340, 0.7, -8],
      [330, 300, 0.55, -12],
      [380, 270, 0.45, -10],
      [420, 250, 0.36, -8],
      [450, 232, 0.3, -12],
    ].map(([x, y, s, rot], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
        <path d="M0 0 Q -8 -22, 4 -34 Q 22 -36, 26 -20 Q 24 -4, 14 0 Q 8 6, 4 4 Z" fill="#1a0f12" opacity="0.9" />
        <ellipse cx="0" cy="2" rx="14" ry="6" fill="#1a0f12" opacity="0.85" />
      </g>
    ))}
    {/* dust motes */}
    <g fill="#e9c47a" opacity="0.5">
      {[[140,200],[220,160],[300,140],[80,260],[400,180],[260,220]].map(([x,y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="1.5" />
      ))}
    </g>
  </ArtBG>
);

export const Art_ReadTheSeal = () => (
  <ArtBG gradient="plum-vignette">
    {/* candle flame */}
    <g transform="translate(440 380)">
      <ellipse cx="0" cy="0" rx="14" ry="22" fill="#f1d68d" opacity="0.95" filter="url(#soft-glow)" />
      <ellipse cx="0" cy="2" rx="6" ry="12" fill="#e9c47a" />
      <ellipse cx="0" cy="6" rx="3" ry="6" fill="#c44a18" />
      <ellipse cx="0" cy="-4" rx="40" ry="60" fill="#e9c47a" opacity="0.25" filter="url(#soft-glow)" />
      <rect x="-8" y="14" width="16" height="60" fill="#f3e7d0" />
    </g>
    {/* hand */}
    <g transform="translate(120 200) rotate(-12)">
      <path d="M0 60 Q 20 0, 80 -10 L 200 -10 L 280 80 Q 240 140, 160 130 Q 80 130, 0 60 Z" fill="#d4a584" stroke="#8a5a40" strokeWidth="1.2" />
      <path d="M260 60 Q 280 60, 280 80" fill="none" stroke="#8a5a40" strokeWidth="0.8" />
    </g>
    {/* letter held up — seal glowing through */}
    <g transform="translate(160 100) rotate(-8)">
      <rect x="0" y="0" width="260" height="200" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="1.2" />
      <rect x="0" y="0" width="260" height="200" fill="#e9c47a" opacity="0.35" />
      <g stroke="#3a2418" strokeWidth="1.2" fill="none" opacity="0.45">
        <line x1="16" y1="40" x2="240" y2="40" />
        <line x1="16" y1="60" x2="220" y2="60" />
        <line x1="16" y1="80" x2="240" y2="80" />
        <line x1="16" y1="100" x2="200" y2="100" />
        <line x1="16" y1="120" x2="232" y2="120" />
      </g>
      {/* seal — red glowing */}
      <circle cx="130" cy="150" r="32" fill="#c44a4a" opacity="0.95" filter="url(#brush-soft)" />
      <circle cx="130" cy="150" r="32" fill="none" stroke="#3a0b13" strokeWidth="1.5" />
      <ellipse cx="130" cy="150" rx="60" ry="40" fill="#c44a4a" opacity="0.3" filter="url(#soft-glow)" />
    </g>
  </ArtBG>
);

export const Art_DistractGuard = () => (
  <ArtBG gradient="plum-vignette">
    {/* polearm */}
    <line x1="80" y1="440" x2="500" y2="120" stroke="#8c6c2d" strokeWidth="8" strokeLinecap="round" />
    <path d="M490 110 L 528 80 L 520 124 L 510 122 Z" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1.5" />
    {/* wine cup mid-fall */}
    <g transform="translate(280 200) rotate(40)">
      <path d="M0 0 L 60 0 L 56 36 Q 30 42, 4 36 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.5" />
      <rect x="26" y="36" width="8" height="28" fill="#8c6c2d" />
      <ellipse cx="30" cy="68" rx="28" ry="6" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1" />
    </g>
    {/* spilled wine droplets */}
    <g fill="#6e1f2e" opacity="0.95" filter="url(#brush-soft)">
      <path d="M260 280 Q 270 320, 250 360" />
      <ellipse cx="300" cy="280" rx="10" ry="6" />
      <ellipse cx="220" cy="320" rx="6" ry="10" />
      <ellipse cx="320" cy="340" rx="5" ry="8" />
      <ellipse cx="180" cy="380" rx="8" ry="12" />
      <ellipse cx="260" cy="420" rx="18" ry="6" />
      <path d="M240 270 Q 260 290, 240 310 Q 220 290, 240 270 Z" />
    </g>
    {/* candlelight catching droplets */}
    <ellipse cx="280" cy="320" rx="40" ry="40" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
  </ArtBG>
);

export const Art_ClearGossip = () => (
  <ArtBG gradient="plum-vignette">
    {/* fading speech bubbles */}
    <g fill="#f3e7d0" stroke="#5e4519" strokeWidth="1">
      <ellipse cx="120" cy="180" rx="40" ry="26" opacity="0.3" />
      <ellipse cx="200" cy="220" rx="34" ry="22" opacity="0.45" />
      <ellipse cx="270" cy="180" rx="36" ry="24" opacity="0.6" />
      <ellipse cx="340" cy="220" rx="30" ry="20" opacity="0.75" />
    </g>
    {/* hand & finger to lips */}
    <g transform="translate(380 240)">
      {/* face hint — mouth and finger only */}
      <path d="M0 80 Q 30 60, 70 70" stroke="#8a3a3a" strokeWidth="3" fill="none" />
      {/* finger */}
      <g transform="rotate(-12)">
        <path d="M30 90 Q 30 30, 38 0 Q 50 0, 50 30 Q 50 70, 50 96 Z" fill="#d4a584" stroke="#8a5a40" strokeWidth="1.2" />
        <ellipse cx="40" cy="-4" rx="12" ry="6" fill="#d4a584" stroke="#8a5a40" strokeWidth="1" />
      </g>
      {/* hand body */}
      <path d="M0 90 Q 0 130, 40 140 L 100 140 Q 130 130, 130 90 Z" fill="#d4a584" stroke="#8a5a40" strokeWidth="1.2" />
    </g>
    {/* shhh swirls */}
    <g stroke="#c9a35f" strokeWidth="2" fill="none" opacity="0.6">
      <path d="M460 180 Q 480 200, 460 220" />
      <path d="M480 160 Q 510 200, 480 240" />
    </g>
  </ArtBG>
);

export const Art_FindKey = () => (
  <ArtBG gradient="plum-vignette">
    {/* velvet cushion */}
    <g filter="url(#brush)">
      <path d="M60 320 Q 60 280, 120 270 L 480 270 Q 540 280, 540 320 L 540 400 Q 540 440, 480 450 L 120 450 Q 60 440, 60 400 Z" fill="#2b132e" stroke="#1a0820" strokeWidth="2" />
      <path d="M80 290 Q 100 282, 130 282" stroke="#6b3a6f" strokeWidth="2" fill="none" opacity="0.7" />
      {/* tassels */}
      <g fill="url(#gold-coin)">
        <circle cx="68" cy="320" r="8" /><line x1="68" y1="328" x2="60" y2="356" stroke="#8c6c2d" strokeWidth="2" />
        <circle cx="532" cy="320" r="8" /><line x1="532" y1="328" x2="540" y2="356" stroke="#8c6c2d" strokeWidth="2" />
      </g>
    </g>
    {/* key being lifted */}
    <g transform="translate(280 200)">
      <g transform="rotate(-18)">
        <circle cx="0" cy="-30" r="34" fill="none" stroke="url(#gold-coin)" strokeWidth="10" />
        <circle cx="0" cy="-30" r="16" fill="#2b132e" />
        <rect x="-7" y="0" width="14" height="100" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.5" />
        <rect x="7" y="60" width="20" height="8" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" />
        <rect x="7" y="76" width="14" height="6" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" />
        <rect x="7" y="90" width="20" height="8" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" />
      </g>
    </g>
    {/* fingers lifting */}
    <g fill="#d4a584" stroke="#8a5a40" strokeWidth="1.2">
      <ellipse cx="290" cy="160" rx="14" ry="22" transform="rotate(-15 290 160)" />
      <ellipse cx="270" cy="160" rx="11" ry="18" transform="rotate(-15 270 160)" />
      <ellipse cx="250" cy="170" rx="9" ry="14" transform="rotate(-15 250 170)" />
    </g>
    <ellipse cx="290" cy="200" rx="60" ry="80" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
  </ArtBG>
);

export const Art_SafePassage = () => (
  <ArtBG gradient="plum-vignette">
    {/* railing */}
    <line x1="80" y1="380" x2="520" y2="380" stroke="#5e4519" strokeWidth="6" />
    {[120, 180, 240, 300, 360, 420, 480].map(x => (
      <line key={x} x1={x} y1="380" x2={x} y2="480" stroke="#5e4519" strokeWidth="3" />
    ))}
    {/* draped cloak forming arch */}
    <path d="M120 370 Q 100 100, 300 80 Q 500 100, 480 370" fill="#2b132e" stroke="#1a0820" strokeWidth="2" filter="url(#brush)" />
    <path d="M150 370 Q 140 140, 300 120 Q 460 140, 450 370" fill="#3a1a3e" filter="url(#brush)" />
    {/* candlelight beyond */}
    <ellipse cx="300" cy="280" rx="120" ry="100" fill="#e9c47a" opacity="0.35" filter="url(#soft-glow)" />
    <ellipse cx="300" cy="300" rx="60" ry="50" fill="#f1d68d" opacity="0.7" filter="url(#soft-glow)" />
    {/* cloak fold highlights */}
    <path d="M180 200 Q 200 250, 240 320" stroke="#4a234e" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M420 200 Q 400 250, 360 320" stroke="#4a234e" strokeWidth="2" fill="none" opacity="0.6" />
  </ArtBG>
);

export const Art_DelayRival = () => (
  <ArtBG gradient="plum-vignette">
    {/* upturned rug */}
    <g filter="url(#brush)">
      <path d="M60 420 L 540 420 L 540 460 L 60 460 Z" fill="#6e1f2e" />
      <path d="M540 420 Q 600 400, 580 360 Q 560 380, 540 420" fill="#8a2d3a" />
      <path d="M80 440 L 520 440" stroke="#c9a35f" strokeWidth="1" opacity="0.5" />
      <path d="M80 450 L 520 450" stroke="#c9a35f" strokeWidth="1" opacity="0.5" />
      {/* tassels */}
      <g stroke="#c9a35f" strokeWidth="2">
        {[80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520].map(x => (
          <line key={x} x1={x} y1="460" x2={x} y2="478" />
        ))}
      </g>
    </g>
    {/* boot catching */}
    <g transform="translate(380 280) rotate(28)">
      <path d="M0 0 L 80 0 L 100 100 L 120 110 L 120 140 L 0 140 Z" fill="#1a0f12" stroke="#06080a" strokeWidth="1.5" />
      <path d="M0 20 L 80 20" stroke="#3a2418" strokeWidth="1.2" />
      <ellipse cx="60" cy="120" rx="50" ry="12" fill="#3a2418" />
      {/* spur glint */}
      <circle cx="116" cy="120" r="6" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.6" />
    </g>
    {/* leg of dark cloak */}
    <path d="M380 0 L 460 0 L 480 320 L 360 320 Z" fill="#06080a" filter="url(#brush)" />
    {/* motion lines */}
    <g stroke="#c9a35f" strokeWidth="1.5" fill="none" opacity="0.55">
      <path d="M120 320 Q 200 300, 280 320" />
      <path d="M140 360 Q 220 340, 300 360" />
      <path d="M160 280 Q 240 260, 320 280" />
    </g>
  </ArtBG>
);

export const Art_MisdirectMessenger = () => (
  <ArtBG gradient="plum-vignette">
    {/* silver tray */}
    <ellipse cx="300" cy="340" rx="240" ry="60" fill="#c9c4d4" stroke="#8a89a4" strokeWidth="2.5" filter="url(#brush-soft)" />
    <ellipse cx="300" cy="335" rx="220" ry="46" fill="#dcd8e4" />
    <ellipse cx="200" cy="320" rx="60" ry="14" fill="#f3e7d0" opacity="0.4" />
    {/* letter 1 */}
    <g transform="translate(160 220) rotate(-8)">
      <rect x="0" y="0" width="180" height="120" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="1.5" />
      <circle cx="90" cy="60" r="18" fill="url(#wax-red)" />
    </g>
    {/* letter 2 */}
    <g transform="translate(280 200) rotate(12)">
      <rect x="0" y="0" width="180" height="120" fill="#e8d4ad" stroke="#b89c6e" strokeWidth="1.5" />
      <circle cx="90" cy="60" r="18" fill="url(#wax-red)" />
    </g>
    {/* gloved fingers — switching */}
    <g fill="#1a0820" stroke="#06080a" strokeWidth="1.2">
      <path d="M340 160 Q 380 160, 400 210 L 380 230 Q 360 230, 340 210 Z" />
      <ellipse cx="370" cy="210" rx="8" ry="14" />
      <path d="M180 280 Q 220 270, 240 300 L 220 320 Q 190 320, 180 300 Z" />
    </g>
    {/* exchange motion */}
    <g stroke="#c9c4d4" strokeWidth="1.5" fill="none" opacity="0.7" strokeDasharray="4 4">
      <path d="M250 270 Q 300 200, 370 250" />
    </g>
  </ArtBG>
);

export const Art_EncouragingNote = () => (
  <ArtBG gradient="plum-vignette">
    {/* sleeve cuff */}
    <g filter="url(#brush)">
      <path d="M60 200 L 540 200 L 560 340 L 40 340 Z" fill="#3a1a3e" stroke="#1a0820" strokeWidth="2" />
      <path d="M60 200 L 540 200 L 542 230 L 60 230 Z" fill="#6b3a6f" />
      {/* embroidery */}
      <g stroke="#c9a35f" strokeWidth="0.8" fill="none" opacity="0.7">
        <path d="M80 218 Q 90 212, 100 218 Q 110 212, 120 218" />
        <path d="M480 218 Q 490 212, 500 218 Q 510 212, 520 218" />
      </g>
      {/* cuff button */}
      <circle cx="100" cy="280" r="6" fill="url(#gold-coin)" stroke="#5e4519" />
    </g>
    {/* folded note tucked in */}
    <g transform="translate(220 200) rotate(-6)">
      <rect x="0" y="0" width="160" height="100" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="1.5" />
      <path d="M0 0 L 80 50 L 160 0" stroke="#b89c6e" strokeWidth="1.2" fill="none" />
      {/* tiny heart seal */}
      <g transform="translate(80 70)">
        <path d="M0 10 C -10 0, -16 -8, -10 -16 C -6 -20, 0 -16, 0 -10 C 0 -16, 6 -20, 10 -16 C 16 -8, 10 0, 0 10 Z" fill="#c44a4a" stroke="#3a0b13" strokeWidth="0.8" />
      </g>
    </g>
    {/* warm glow */}
    <ellipse cx="300" cy="260" rx="120" ry="60" fill="#e9c47a" opacity="0.2" filter="url(#soft-glow)" />
  </ArtBG>
);

export const Art_SecretMap = () => (
  <ArtBG gradient="plum-vignette">
    {/* unrolled scroll */}
    <g filter="url(#brush)">
      <path d="M40 100 Q 40 80, 60 80 L 540 80 Q 560 80, 560 100 L 560 420 Q 560 440, 540 440 L 60 440 Q 40 440, 40 420 Z" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="2" />
      {/* rolled ends */}
      <ellipse cx="40" cy="260" rx="20" ry="180" fill="#e8d4ad" stroke="#8c6c2d" strokeWidth="2" />
      <ellipse cx="560" cy="260" rx="20" ry="180" fill="#e8d4ad" stroke="#8c6c2d" strokeWidth="2" />
    </g>
    {/* palace floor plan */}
    <g stroke="#3a2418" strokeWidth="1.5" fill="none">
      <rect x="100" y="140" width="160" height="120" />
      <rect x="280" y="140" width="100" height="80" />
      <rect x="400" y="140" width="120" height="160" />
      <rect x="100" y="280" width="120" height="100" />
      <rect x="240" y="240" width="160" height="140" />
      <rect x="420" y="320" width="100" height="60" />
      {/* corridors */}
      <line x1="260" y1="200" x2="280" y2="200" />
      <line x1="380" y1="200" x2="400" y2="200" />
      <line x1="160" y1="260" x2="160" y2="280" />
      <line x1="400" y1="300" x2="420" y2="320" />
    </g>
    {/* compass rose */}
    <g transform="translate(478 348)">
      <circle r="32" fill="none" stroke="url(#gold-leaf)" strokeWidth="1.5" />
      <path d="M0 -28 L 6 0 L 0 28 L -6 0 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.8" />
      <path d="M-28 0 L 0 6 L 28 0 L 0 -6 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.8" />
      <text y="-32" textAnchor="middle" fontSize="10" fontFamily="Cormorant Garamond, serif" fill="#5e4519">N</text>
    </g>
    {/* X mark */}
    <g stroke="#6e1f2e" strokeWidth="3" strokeLinecap="round">
      <line x1="316" y1="296" x2="332" y2="312" /><line x1="332" y1="296" x2="316" y2="312" />
    </g>
  </ArtBG>
);

export const Art_CorrectAddress = () => (
  <ArtBG gradient="plum-vignette">
    {/* envelope laid flat */}
    <g filter="url(#brush)">
      <rect x="60" y="120" width="480" height="280" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="2" />
      <path d="M60 120 L 300 280 L 540 120" stroke="#b89c6e" strokeWidth="1.5" fill="none" />
    </g>
    {/* smudged old name */}
    <g opacity="0.4">
      <line x1="120" y1="320" x2="320" y2="320" stroke="#3a2418" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="200" cy="320" rx="40" ry="6" fill="#3a2418" />
    </g>
    {/* corrected line below */}
    <g>
      <path d="M120 360 Q 240 354, 460 360" stroke="#1a0f12" strokeWidth="3" fill="none" />
      <text x="120" y="356" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="22" fill="#1a0f12">Lady Celeste, Hall West</text>
    </g>
    {/* quill */}
    <g transform="translate(380 220) rotate(-30)">
      <path d="M0 0 Q -10 -120, 0 -180 Q 30 -200, 60 -180 Q 80 -120, 30 0 Z" fill="#e8d4ad" stroke="#b89c6e" strokeWidth="1.2" />
      <path d="M28 -160 L 28 -20" stroke="#8c6c2d" strokeWidth="1" />
      <path d="M0 0 L -10 12" stroke="#1a0f12" strokeWidth="2" />
    </g>
    {/* ink drop */}
    <g fill="#1a0f12" filter="url(#brush-soft)">
      <ellipse cx="220" cy="420" rx="14" ry="20" />
      <ellipse cx="222" cy="402" rx="3" ry="6" />
    </g>
  </ArtBG>
);

export const Art_CoverStory = () => (
  <ArtBG gradient="plum-vignette">
    {/* two courtiers — silhouettes facing each other */}
    <g filter="url(#brush)">
      {/* left figure */}
      <path d="M40 460 L 40 280 Q 50 200, 130 180 Q 180 200, 200 280 L 200 460 Z" fill="#3a1a3e" stroke="#1a0820" strokeWidth="1.5" />
      <ellipse cx="130" cy="180" rx="44" ry="56" fill="#3a1a3e" />
      {/* right figure */}
      <path d="M400 460 L 400 280 Q 410 200, 480 180 Q 540 200, 560 280 L 560 460 Z" fill="#2b132e" stroke="#1a0820" strokeWidth="1.5" />
      <ellipse cx="480" cy="180" rx="44" ry="56" fill="#2b132e" />
    </g>
    {/* glances — eyes turned toward each other */}
    <g fill="#e9c47a">
      <ellipse cx="158" cy="178" rx="5" ry="2" />
      <ellipse cx="170" cy="180" rx="3" ry="2" />
      <ellipse cx="448" cy="178" rx="5" ry="2" />
      <ellipse cx="436" cy="180" rx="3" ry="2" />
    </g>
    {/* fans */}
    <g transform="translate(160 280)">
      <path d="M0 0 L -34 -56 Q -28 -64, 0 -64 Q 28 -64, 34 -56 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" />
      <g stroke="#5e4519" strokeWidth="0.4" fill="none">
        <line x1="0" y1="0" x2="-30" y2="-58" />
        <line x1="0" y1="0" x2="-12" y2="-62" />
        <line x1="0" y1="0" x2="0" y2="-64" />
        <line x1="0" y1="0" x2="12" y2="-62" />
        <line x1="0" y1="0" x2="30" y2="-58" />
      </g>
    </g>
    {/* slightly lowered fan on right */}
    <g transform="translate(440 300) rotate(20)">
      <path d="M0 0 L -34 -56 Q -28 -64, 0 -64 Q 28 -64, 34 -56 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" opacity="0.85" />
    </g>
    {/* candle glow between */}
    <ellipse cx="300" cy="240" rx="80" ry="100" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
  </ArtBG>
);

/* ═════════ SUITOR CARDS (6) ═════════ */

export const Art_BraveShortcut = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* moonlit garden hint */}
    <rect x="0" y="0" width="600" height="500" fill="#1a2a52" opacity="0.6" />
    <circle cx="80" cy="80" r="40" fill="#f3e7d0" opacity="0.5" filter="url(#soft-glow)" />
    {/* hedge */}
    <g filter="url(#brush-heavy)">
      <ellipse cx="300" cy="380" rx="280" ry="60" fill="#0e2329" />
      <g fill="#f3e7d0" opacity="0.8">
        {[100,160,220,300,400,480].map(x => <circle key={x} cx={x} cy="350" r="4" />)}
      </g>
    </g>
    {/* vaulting figure mid-jump */}
    <g transform="translate(280 200)" filter="url(#brush)">
      {/* body */}
      <path d="M0 80 Q -40 60, -40 0 Q -30 -40, 10 -40 Q 50 -40, 50 0 Q 50 60, 20 80 Z" fill="#1a0f12" />
      {/* arms outstretched */}
      <path d="M-30 0 L -90 30 L -100 50 L -40 30 Z" fill="#1a0f12" />
      <path d="M40 0 L 100 -10 L 110 10 L 50 20 Z" fill="#1a0f12" />
      {/* legs split */}
      <path d="M-10 70 L -40 140 L -20 150 L 0 80 Z" fill="#1a0f12" />
      <path d="M20 70 L 60 130 L 80 120 L 30 70 Z" fill="#1a0f12" />
      {/* coat tails flying */}
      <path d="M-30 30 L -110 80 L -90 100 L -10 60 Z" fill="#6e1f2e" filter="url(#brush-heavy)" />
      <path d="M30 30 L 120 60 L 110 90 L 30 80 Z" fill="#6e1f2e" filter="url(#brush-heavy)" />
    </g>
    {/* motion lines */}
    <g stroke="#e9c47a" strokeWidth="1.5" fill="none" opacity="0.4">
      <path d="M40 200 Q 100 190, 160 200" />
      <path d="M40 240 Q 100 230, 160 240" />
    </g>
  </ArtBG>
);

export const Art_CarefulRewrite = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* parchment */}
    <rect x="80" y="100" width="440" height="300" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="2" filter="url(#brush-soft)" />
    {/* struck-through line */}
    <line x1="120" y1="180" x2="480" y2="180" stroke="#1a0f12" strokeWidth="3" opacity="0.9" />
    <line x1="100" y1="180" x2="500" y2="180" stroke="#6e1f2e" strokeWidth="3" />
    <text x="120" y="186" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="26" fill="#1a0f12" opacity="0.7">A hurried, ardent line…</text>
    {/* fresh line below */}
    <text x="120" y="240" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="22" fill="#1a0f12">Forgive the hour. I am yours,</text>
    <text x="120" y="270" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="22" fill="#1a0f12">considered, & still hopeful.</text>
    {/* quill striking */}
    <g transform="translate(380 320) rotate(-26)">
      <path d="M0 0 Q -14 -160, 8 -220 Q 40 -240, 70 -220 Q 92 -160, 36 0 Z" fill="#e8d4ad" stroke="#b89c6e" strokeWidth="1.2" />
      <path d="M0 0 L -14 16" stroke="#1a0f12" strokeWidth="3" />
    </g>
    <g fill="#1a0f12" opacity="0.85">
      <ellipse cx="-2" cy="20" rx="3" ry="6" transform="translate(380 320) rotate(-26)" />
    </g>
  </ArtBG>
);

export const Art_SealedPromise = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* wax pool with rings */}
    <g filter="url(#brush)">
      <ellipse cx="300" cy="280" rx="160" ry="120" fill="#6e1f2e" />
      <ellipse cx="300" cy="280" rx="160" ry="120" fill="url(#wax-red)" />
      <ellipse cx="300" cy="280" rx="140" ry="105" fill="none" stroke="#3a0b13" strokeWidth="1.5" />
    </g>
    {/* impression — crown */}
    <g transform="translate(300 280)" filter="url(#brush-soft)" fill="#3a0b13">
      <path d="M-60 20 L -50 -10 L -30 10 L -20 -20 L 0 -10 L 20 -20 L 30 10 L 50 -10 L 60 20 L 50 30 L -50 30 Z" />
      <circle cx="-30" cy="-12" r="4" fill="#c44a4a" />
      <circle cx="0" cy="-22" r="5" fill="#c44a4a" />
      <circle cx="30" cy="-12" r="4" fill="#c44a4a" />
    </g>
    {/* signet ring pressing */}
    <g transform="translate(420 100) rotate(38)">
      <circle r="36" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="2" />
      <circle r="22" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="1.2" />
      <path d="M-8 4 L -2 -6 L 4 4 L 0 8 Z" fill="url(#gold-coin)" />
    </g>
    {/* highlight */}
    <ellipse cx="240" cy="220" rx="50" ry="20" fill="#f1d68d" opacity="0.4" />
  </ArtBG>
);

export const Art_SecondThoughts = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* three corridors radiating */}
    <g filter="url(#brush-heavy)">
      <polygon points="300,250 80,80 80,200" fill="#1a0820" />
      <polygon points="300,250 300,80 380,80" fill="#1a0820" />
      <polygon points="300,250 520,80 520,200" fill="#1a0820" />
      <polygon points="300,250 80,200 80,360" fill="#0e1326" />
      <polygon points="300,250 520,200 520,360" fill="#0e1326" />
      <polygon points="300,250 80,360 520,360" fill="#0e1f2a" />
      {/* glow at each end */}
      <ellipse cx="120" cy="140" rx="40" ry="30" fill="#e9c47a" opacity="0.3" filter="url(#soft-glow)" />
      <ellipse cx="300" cy="100" rx="40" ry="30" fill="#e9c47a" opacity="0.3" filter="url(#soft-glow)" />
      <ellipse cx="480" cy="140" rx="40" ry="30" fill="#e9c47a" opacity="0.3" filter="url(#soft-glow)" />
    </g>
    {/* figure at center, looking back */}
    <g transform="translate(300 360)" filter="url(#brush)">
      <ellipse cx="0" cy="-100" rx="32" ry="42" fill="#1a0f12" />
      <path d="M-40 -60 L -50 60 L 50 60 L 40 -60 Z" fill="#6e1f2e" />
      <path d="M-40 -60 Q 0 -80, 40 -60" stroke="#8a2d3a" strokeWidth="2" fill="none" />
      {/* turned face — only profile suggested */}
      <ellipse cx="-12" cy="-100" rx="6" ry="3" fill="#1a0f12" />
      <ellipse cx="-22" cy="-102" rx="2" ry="1.2" fill="#e9c47a" />
    </g>
  </ArtBG>
);

export const Art_DirectConfession = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* hand 1 — pressing letter */}
    <g fill="#d4a584" stroke="#8a5a40" strokeWidth="1.5" filter="url(#brush)">
      <path d="M40 240 Q 60 200, 140 200 L 280 220 Q 320 240, 320 280 L 280 320 Q 200 320, 100 300 Q 40 300, 40 260 Z" />
    </g>
    {/* hand 2 — receiving */}
    <g fill="#eed4b8" stroke="#b8956e" strokeWidth="1.5" filter="url(#brush)">
      <path d="M560 240 Q 540 200, 460 200 L 320 220 Q 280 240, 280 280 L 320 320 Q 400 320, 500 300 Q 560 300, 560 260 Z" />
    </g>
    {/* letter pressed between */}
    <g transform="translate(300 250)" filter="url(#brush-soft)">
      <rect x="-80" y="-30" width="160" height="60" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="14" fill="url(#wax-red)" stroke="#3a0b13" strokeWidth="1" />
    </g>
    {/* warm bloom */}
    <ellipse cx="300" cy="280" rx="180" ry="80" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
    {/* fingers overlapping */}
    <g fill="#d4a584" stroke="#8a5a40" strokeWidth="1.5">
      <ellipse cx="280" cy="220" rx="14" ry="8" transform="rotate(-12 280 220)" />
      <ellipse cx="320" cy="220" rx="14" ry="8" transform="rotate(12 320 220)" />
    </g>
  </ArtBG>
);

export const Art_WaitForRightMoment = () => (
  <ArtBG gradient="burgundy-vignette">
    {/* palm holding watch */}
    <g fill="#d4a584" stroke="#8a5a40" strokeWidth="1.5" filter="url(#brush)">
      <path d="M120 460 Q 60 440, 80 360 Q 100 280, 200 260 L 400 260 Q 500 280, 520 360 Q 540 440, 480 460 Z" />
      {/* finger creases */}
      <path d="M150 360 Q 180 370, 200 360" stroke="#8a5a40" strokeWidth="0.8" fill="none" />
      <path d="M400 360 Q 420 370, 450 360" stroke="#8a5a40" strokeWidth="0.8" fill="none" />
    </g>
    {/* pocket watch */}
    <g transform="translate(300 340)" filter="url(#brush-soft)">
      <circle r="80" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="3" />
      <circle r="70" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1.5" />
      {Array.from({length:12}).map((_,i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <line key={i} x1={Math.cos(a)*60} y1={Math.sin(a)*60} x2={Math.cos(a)*52} y2={Math.sin(a)*52} stroke="#3a2418" strokeWidth={i%3===0?2.5:1.2} />;
      })}
      {/* hands — at 12:00 */}
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#1a0f12" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="0" x2="14" y2="0" stroke="#1a0f12" strokeWidth="2.5" strokeLinecap="round" />
      <circle r="4" fill="#1a0f12" />
      {/* crown */}
      <rect x="-8" y="-92" width="16" height="14" rx="2" fill="url(#gold-coin)" stroke="#5e4519" />
    </g>
    {/* window light beam crossing dial */}
    <g opacity="0.4">
      <path d="M120 100 L 480 480" stroke="#f1d68d" strokeWidth="60" opacity="0.4" filter="url(#soft-glow)" />
    </g>
  </ArtBG>
);

/* ═════════ RIVAL TRAITS (6) ═════════ */

export const Art_FastCourier = () => (
  <ArtBG gradient="teal-vignette">
    <rect x="0" y="0" width="600" height="500" fill="#0e2329" />
    {/* corridor perspective */}
    <g opacity="0.55" filter="url(#brush-heavy)">
      <polygon points="0,0 600,0 400,200 200,200" fill="#1a3a40" />
      <polygon points="0,500 600,500 400,300 200,300" fill="#1a3a40" />
      <polygon points="0,0 0,500 200,300 200,200" fill="#0e2329" />
      <polygon points="600,0 600,500 400,300 400,200" fill="#0e2329" />
    </g>
    {/* blurred figure mid-stride — multiple offsets */}
    {[
      { x: 240, o: 0.25 },
      { x: 270, o: 0.45 },
      { x: 300, o: 0.95 },
    ].map(({ x, o }, i) => (
      <g key={i} transform={`translate(${x} 250)`} opacity={o} filter="url(#brush)">
        {/* cloak */}
        <path d="M-30 100 L -50 0 L -20 -60 L 20 -60 L 50 0 L 30 100 Z" fill="#06080a" />
        {/* head */}
        <ellipse cx="0" cy="-80" rx="20" ry="26" fill="#1a0820" />
        {/* stride leg back */}
        <path d="M-10 100 L -40 180 L -20 184 L 0 100 Z" fill="#06080a" />
        {/* stride leg front */}
        <path d="M10 100 L 50 170 L 70 160 L 20 100 Z" fill="#06080a" />
      </g>
    ))}
    {/* smear of motion */}
    <g stroke="#c9a35f" strokeWidth="2" opacity="0.5" fill="none">
      <path d="M40 240 Q 160 230, 280 250" />
      <path d="M40 260 Q 160 250, 280 270" />
      <path d="M40 280 Q 160 270, 280 290" />
    </g>
  </ArtBG>
);

export const Art_SilverTongue = () => (
  <ArtBG gradient="teal-vignette">
    {/* dark lips */}
    <g filter="url(#brush)">
      <path d="M180 260 Q 240 220, 300 220 Q 360 220, 420 260" fill="#1a0f12" stroke="#06080a" strokeWidth="2" />
      <path d="M180 260 Q 240 300, 300 300 Q 360 300, 420 260 Z" fill="#1a0f12" stroke="#06080a" strokeWidth="2" />
      <path d="M200 260 Q 300 244, 400 260" stroke="#3a0b13" strokeWidth="1" fill="none" />
    </g>
    {/* half-mask above */}
    <g transform="translate(300 200)" filter="url(#brush-soft)">
      <path d="M-100 -20 Q -90 -50, -40 -50 L 40 -50 Q 90 -50, 100 -20 Q 100 0, 60 10 L -60 10 Q -100 0, -100 -20 Z" fill="#1a0f12" stroke="#c9a35f" strokeWidth="1.5" />
      <ellipse cx="-40" cy="-20" rx="14" ry="8" fill="#3a2418" />
      <ellipse cx="40" cy="-20" rx="14" ry="8" fill="#3a2418" />
      <circle cx="-40" cy="-22" r="2" fill="#e9c47a" />
      <circle cx="40" cy="-22" r="2" fill="#e9c47a" />
    </g>
    {/* tongue of pale flame */}
    <g transform="translate(300 280)" filter="url(#brush)">
      <path d="M0 0 Q -20 60, -10 100 Q 0 120, 10 100 Q 20 60, 0 0 Z" fill="#c9c4d4" />
      <path d="M0 10 Q -10 50, -4 80 Q 0 90, 4 80 Q 10 50, 0 10 Z" fill="#f3e7d0" />
      <ellipse cx="0" cy="60" rx="40" ry="80" fill="#c9c4d4" opacity="0.25" filter="url(#soft-glow)" />
    </g>
  </ArtBG>
);

export const Art_CourtFavourite = () => (
  <ArtBG gradient="teal-vignette">
    {/* black lapel */}
    <g filter="url(#brush)">
      <path d="M40 60 L 320 100 L 360 460 L 40 460 Z" fill="#06080a" />
      <path d="M40 60 L 320 100" stroke="#1a3a40" strokeWidth="2" fill="none" />
      {/* lapel highlight */}
      <path d="M60 80 Q 200 120, 340 140" stroke="#1a3a40" strokeWidth="1.2" fill="none" opacity="0.6" />
    </g>
    {/* ribbon */}
    <g filter="url(#brush)">
      <path d="M380 80 L 460 80 L 460 220 L 420 240 L 380 220 Z" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="1.5" />
      <path d="M380 80 L 460 80" stroke="#8a2d3a" strokeWidth="2" />
      <path d="M380 100 L 460 100" stroke="#8a2d3a" strokeWidth="0.8" opacity="0.6" />
    </g>
    {/* medal */}
    <g transform="translate(420 280)" filter="url(#brush-soft)">
      <circle r="56" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="2.5" />
      <circle r="40" fill="none" stroke="#5e4519" strokeWidth="1" />
      <path d="M0 -32 L 6 -10 L 30 -10 L 12 4 L 18 28 L 0 14 L -18 28 L -12 4 L -30 -10 L -6 -10 Z" fill="#5e4519" />
      {/* candle glint */}
      <ellipse cx="-20" cy="-26" rx="14" ry="6" fill="#f1d68d" opacity="0.6" />
    </g>
  </ArtBG>
);

export const Art_HiddenSeal = () => (
  <ArtBG gradient="teal-vignette">
    {/* parchment */}
    <rect x="60" y="120" width="480" height="300" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="2" filter="url(#brush-soft)" />
    {/* wax seal */}
    <circle cx="300" cy="270" r="60" fill="url(#wax-red)" stroke="#3a0b13" strokeWidth="2" filter="url(#brush)" />
    <circle cx="300" cy="270" r="46" fill="none" stroke="#3a0b13" strokeWidth="0.8" opacity="0.5" />
    {/* design behind ribbon — barely visible */}
    <g opacity="0.3">
      <path d="M280 256 L 320 256 L 320 286 L 280 286 Z" fill="#3a0b13" />
    </g>
    {/* black ribbon across */}
    <g filter="url(#brush)">
      <path d="M40 240 L 560 280 L 540 320 L 40 280 Z" fill="#06080a" />
      <path d="M40 240 L 560 280" stroke="#1a0f12" strokeWidth="1" />
      <path d="M40 280 L 540 320" stroke="#1a0f12" strokeWidth="1" />
    </g>
    {/* ribbon ends fluttering */}
    <path d="M520 280 Q 580 280, 590 310 L 570 320 Q 560 300, 540 310 Z" fill="#06080a" filter="url(#brush)" />
  </ArtBG>
);

export const Art_FalseTrail = () => (
  <ArtBG gradient="teal-vignette">
    {/* dusty floor */}
    <rect x="0" y="240" width="600" height="260" fill="#3a2418" filter="url(#brush)" />
    <ellipse cx="300" cy="260" rx="320" ry="80" fill="#1a0f12" opacity="0.5" filter="url(#soft-glow)" />
    {/* footprints converge then split */}
    {[
      [80, 460, 0, 1.0],
      [120, 420, 0, 0.9],
      [160, 380, 0, 0.85],
      [200, 340, 0, 0.8],
      [240, 300, 0, 0.75],
      [280, 260, 0, 0.7],
      // branch 1 — left
      [310, 230, -20, 0.65],
      [330, 200, -20, 0.6],
      [340, 170, -20, 0.55],
      [340, 140, -20, 0.5],
      // branch 2 — right
      [320, 230, 25, 0.65],
      [350, 200, 25, 0.6],
      [380, 170, 25, 0.55],
      [400, 140, 25, 0.5],
    ].map(([x, y, rot, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <path d="M0 0 Q -8 -22, 4 -34 Q 22 -36, 26 -20 Q 24 -4, 14 0 Q 8 6, 4 4 Z" fill="#1a0f12" opacity="0.9" />
        <ellipse cx="0" cy="2" rx="14" ry="6" fill="#1a0f12" opacity="0.85" />
      </g>
    ))}
    {/* light from above hints at deception */}
    <ellipse cx="300" cy="100" rx="160" ry="40" fill="#e9c47a" opacity="0.15" filter="url(#soft-glow)" />
  </ArtBG>
);

export const Art_JealousRival = () => (
  <ArtBG gradient="teal-vignette">
    {/* tarnished mirror oval */}
    <ellipse cx="300" cy="250" rx="180" ry="220" fill="none" stroke="url(#gold-coin)" strokeWidth="10" filter="url(#brush-soft)" />
    <ellipse cx="300" cy="250" rx="170" ry="210" fill="#1a3038" />
    <ellipse cx="300" cy="250" rx="170" ry="210" fill="url(#teal-vignette)" />
    {/* tarnish */}
    <g opacity="0.45" filter="url(#brush-heavy)">
      <path d="M140 100 Q 200 250, 140 400" stroke="#0e2329" strokeWidth="14" fill="none" />
      <path d="M460 100 Q 400 250, 460 400" stroke="#0e2329" strokeWidth="14" fill="none" />
      <path d="M260 60 L 320 80" stroke="#0e2329" strokeWidth="8" fill="none" />
    </g>
    {/* eye reflected */}
    <g transform="translate(300 250)" filter="url(#brush-soft)">
      <path d="M-90 0 Q 0 -60, 90 0 Q 0 60, -90 0 Z" fill="#e8d4ad" stroke="#5e4519" strokeWidth="2" />
      <circle r="34" fill="#3a6e5a" />
      <circle r="34" fill="url(#teal-vignette)" />
      <circle r="14" fill="#0e1f2a" />
      <circle cx="-6" cy="-6" r="5" fill="#f1d68d" />
      {/* long lashes */}
      <g stroke="#1a0f12" strokeWidth="2" strokeLinecap="round">
        <line x1="-70" y1="-20" x2="-80" y2="-32" />
        <line x1="-40" y1="-40" x2="-44" y2="-56" />
        <line x1="0" y1="-50" x2="0" y2="-66" />
        <line x1="40" y1="-40" x2="44" y2="-56" />
        <line x1="70" y1="-20" x2="80" y2="-32" />
      </g>
    </g>
    {/* green tint glow */}
    <ellipse cx="300" cy="250" rx="80" ry="60" fill="#3a6e5a" opacity="0.25" filter="url(#soft-glow)" />
  </ArtBG>
);

export const CARD_ART: Record<string, ComponentType> = {
  /* Confidant */
  trace_footsteps:     withAICardArt("trace_footsteps",     Art_TraceFootsteps),
  read_the_seal:       withAICardArt("read_the_seal",       Art_ReadTheSeal),
  distract_guard:      withAICardArt("distract_guard",      Art_DistractGuard),
  clear_gossip:        withAICardArt("clear_gossip",        Art_ClearGossip),
  find_key:            withAICardArt("find_key",            Art_FindKey),
  safe_passage:        withAICardArt("safe_passage",        Art_SafePassage),
  delay_rival:         withAICardArt("delay_rival",         Art_DelayRival),
  misdirect_messenger: withAICardArt("misdirect_messenger", Art_MisdirectMessenger),
  encouraging_note:    withAICardArt("encouraging_note",    Art_EncouragingNote),
  secret_map:          withAICardArt("secret_map",          Art_SecretMap),
  correct_address:     withAICardArt("correct_address",     Art_CorrectAddress),
  cover_story:         withAICardArt("cover_story",         Art_CoverStory),
  /* Suitor */
  brave_shortcut:    withAICardArt("brave_shortcut",    Art_BraveShortcut),
  careful_rewrite:   withAICardArt("careful_rewrite",   Art_CarefulRewrite),
  sealed_promise:    withAICardArt("sealed_promise",    Art_SealedPromise),
  second_thoughts:   withAICardArt("second_thoughts",   Art_SecondThoughts),
  direct_confession: withAICardArt("direct_confession", Art_DirectConfession),
  wait_right_moment: withAICardArt("wait_right_moment", Art_WaitForRightMoment),
  /* Rival */
  fast_courier:    withAICardArt("fast_courier",    Art_FastCourier),
  silver_tongue:   withAICardArt("silver_tongue",   Art_SilverTongue),
  court_favourite: withAICardArt("court_favourite", Art_CourtFavourite),
  hidden_seal:     withAICardArt("hidden_seal",     Art_HiddenSeal),
  false_trail:     withAICardArt("false_trail",     Art_FalseTrail),
  jealous_rival:   withAICardArt("jealous_rival",   Art_JealousRival),
};

// CARD_ART exported above
