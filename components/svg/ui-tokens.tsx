import type { ComponentType, ReactNode } from "react";
import type { ToneKey } from "@/lib/game/content";

export const HeartToken = ({ size = 64, active = true }: { size?: number; active?: boolean }) => (
  <svg viewBox="0 0 128 128" width={size} height={size}>
    <defs>
      <radialGradient id={`heart-${size}`} cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#f1d68d" />
        <stop offset="55%" stopColor="#c9a35f" />
        <stop offset="100%" stopColor="#6e5320" />
      </radialGradient>
    </defs>
    <circle cx="64" cy="64" r="58" fill={active ? `url(#heart-${size})` : "#2a2024"} stroke={active ? "#5e4519" : "#3a2418"} strokeWidth="2" />
    <g filter="url(#brush-soft)">
      <path d="M64 100 C 40 84, 28 70, 28 54 C 28 42, 38 32, 50 32 C 56 32, 60 36, 64 42 C 68 36, 72 32, 78 32 C 90 32, 100 42, 100 54 C 100 70, 88 84, 64 100 Z" fill={active ? "#6e1f2e" : "#1a0a0e"} stroke={active ? "#3a0b13" : "#0a0608"} strokeWidth="2" />
      <path d="M48 50 Q 60 44, 70 48" stroke="#d8556a" strokeWidth="1.8" fill="none" opacity={active ? "0.9" : "0"} />
    </g>
    {active && (
      <g stroke="#5e4519" strokeWidth="1.2" fill="none">
        <path d="M22 70 Q 32 80, 30 96" />
        <path d="M26 76 L 32 78" />
        <path d="M28 84 L 34 86" />
        <path d="M106 70 Q 96 80, 98 96" />
        <path d="M102 76 L 96 78" />
        <path d="M100 84 L 94 86" />
      </g>
    )}
  </svg>
);

export const RumourToken = ({ size = 64, active = true }: { size?: number; active?: boolean }) => (
  <svg viewBox="0 0 128 128" width={size} height={size}>
    <circle cx="64" cy="64" r="58" fill={active ? "#1a1216" : "#2a2024"} stroke={active ? "#3a0b13" : "#3a2418"} strokeWidth="2" opacity={active ? 1 : 0.35} />
    <g filter="url(#brush-heavy)">
      <path d="M64 18 C 80 22, 90 32, 94 50 C 102 56, 106 70, 100 84 C 106 96, 96 110, 80 106 C 70 116, 54 114, 46 102 C 30 102, 22 88, 28 74 C 22 60, 32 44, 46 44 C 50 28, 60 18, 64 18 Z" fill={active ? "#0a0608" : "#1a1216"} stroke={active ? "#3a0b13" : "transparent"} strokeWidth="1.5" opacity={active ? 1 : 0.4} />
    </g>
    {active && (
      <g stroke="#6e1f2e" strokeWidth="1" fill="none" opacity="0.7">
        <path d="M48 60 L 56 68 L 50 76" />
        <path d="M72 50 L 78 56" />
        <path d="M76 88 L 82 94" />
      </g>
    )}
    {active && <ellipse cx="52" cy="40" rx="10" ry="5" fill="#6e1f2e" opacity="0.35" />}
  </svg>
);

export const QuestionToken = ({ size = 80, used = false }: { size?: number; used?: boolean }) => (
  <svg viewBox="0 0 128 128" width={size} height={size}>
    <circle cx="64" cy="64" r="58" fill={used ? "#2a2024" : "url(#gold-coin-bronze)"} stroke={used ? "#3a2418" : "#3a2010"} strokeWidth="2.5" />
    <circle cx="64" cy="64" r="50" fill="none" stroke={used ? "#3a2418" : "#3a2010"} strokeWidth="1" />
    <text x="64" y="86" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="60" fontWeight="700" fill={used ? "#5e4519" : "#1a0f12"} opacity={used ? 0.5 : 1}>?</text>
    {!used && <ellipse cx="48" cy="40" rx="14" ry="6" fill="#f1d68d" opacity="0.4" />}
  </svg>
);

export const APPip = ({ size = 36, spent = false }: { size?: number; spent?: boolean }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <circle cx="32" cy="32" r="22" fill={spent ? "#3a2418" : "url(#gold-coin)"} stroke={spent ? "#1a0f12" : "#5e4519"} strokeWidth="1.5" opacity={spent ? 0.4 : 1} />
    <circle cx="32" cy="32" r="17" fill="none" stroke={spent ? "#1a0f12" : "#5e4519"} strokeWidth="0.6" />
    {!spent && (
      <>
        <path d="M14 22 L 8 32 L 14 42 L 18 32 Z" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="0.8" />
        <path d="M50 22 L 56 32 L 50 42 L 46 32 Z" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="0.8" />
        <text x="32" y="38" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#1a0f12">A</text>
      </>
    )}
  </svg>
);

type ToneBaseProps = { size?: number; active?: boolean; children?: ReactNode };
const ToneBase = ({ size, children, active }: ToneBaseProps) => (
  <svg viewBox="0 0 128 128" width={size} height={size}>
    <circle cx="64" cy="64" r="58" fill={active ? "url(#parchment)" : "#1a0f12"} stroke={active ? "#5e4519" : "#3a2418"} strokeWidth="2" />
    <circle cx="64" cy="64" r="53" fill="none" stroke={active ? "#8c6c2d" : "#3a2418"} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
    <g filter="url(#brush-soft)" opacity={active ? 1 : 0.45}>{children}</g>
  </svg>
);

export type ToneGlyphProps = { size?: number; active?: boolean };

export const ToneTender = ({ size = 64, active = true }: ToneGlyphProps) => (
  <ToneBase size={size} active={active}>
    <g stroke="#5e4519" strokeWidth="2" fill="#e8d4ad">
      <rect x="32" y="50" width="64" height="40" rx="2" />
      <path d="M32 50 L 64 78 L 96 50" fill="#d4bf8c" />
    </g>
    <circle cx="64" cy="80" r="10" fill="url(#wax-red)" stroke="#3a0b13" strokeWidth="1" />
    <path d="M64 76 Q 68 78, 64 84 Q 60 78, 64 76 Z" fill="#d8556a" />
    <path d="M60 80 Q 64 78, 68 80" fill="none" stroke="#3a0b13" strokeWidth="0.6" />
  </ToneBase>
);

export const ToneBold = ({ size = 64, active = true }: ToneGlyphProps) => (
  <ToneBase size={size} active={active}>
    <g stroke="#5e4519" strokeWidth="2" fill="#e8d4ad">
      <rect x="28" y="54" width="72" height="42" rx="2" />
      <path d="M28 54 L 50 50 L 78 50 L 100 54 L 64 32 Z" fill="#f3e7d0" />
    </g>
    <g fill="none" stroke="#6e1f2e" strokeWidth="3" strokeLinecap="round">
      <path d="M40 76 Q 56 64, 72 78 Q 84 88, 96 72" />
    </g>
    <circle cx="96" cy="72" r="2.5" fill="#6e1f2e" />
  </ToneBase>
);

export const ToneHonest = ({ size = 64, active = true }: ToneGlyphProps) => (
  <ToneBase size={size} active={active}>
    <rect x="34" y="40" width="56" height="60" fill="#f3e7d0" stroke="#5e4519" strokeWidth="2" rx="1" />
    <line x1="34" y1="70" x2="90" y2="70" stroke="#5e4519" strokeWidth="1" />
    <g transform="rotate(-22 64 70)">
      <path d="M30 76 Q 64 70, 96 64 Q 100 64, 100 68 Q 84 76, 30 80 Z" fill="#e8d4ad" stroke="#5e4519" strokeWidth="1.2" />
      <path d="M28 76 L 22 80 L 30 80 Z" fill="#3a2418" />
      <path d="M40 74 L 86 68" stroke="#8c6c2d" strokeWidth="0.6" />
    </g>
  </ToneBase>
);

export const TonePlayful = ({ size = 64, active = true }: ToneGlyphProps) => (
  <ToneBase size={size} active={active}>
    <g stroke="#5e4519" strokeWidth="2" fill="#e8d4ad">
      <rect x="32" y="48" width="64" height="44" rx="2" />
      <path d="M32 48 L 64 74 L 96 48" fill="#d4bf8c" />
    </g>
    <g fill="#6e1f2e" stroke="#3a0b13" strokeWidth="1">
      <path d="M64 50 L 56 60 L 64 64 L 72 60 Z" />
      <path d="M56 60 Q 36 64, 32 84 Q 44 76, 56 70 Z" />
      <path d="M72 60 Q 92 64, 96 84 Q 84 76, 72 70 Z" />
      <circle cx="64" cy="58" r="3" />
    </g>
  </ToneBase>
);

export const TONE_COMPONENTS: Record<ToneKey, ComponentType<ToneGlyphProps>> = {
  tender: ToneTender,
  bold: ToneBold,
  honest: ToneHonest,
  playful: TonePlayful,
};

export const TONE_META: Record<ToneKey, { label: string; travelDelta: number; powerDelta: number; hint: string }> = {
  tender:  { label: "Tender",  travelDelta: +1, powerDelta: +1, hint: "Slower, fonder. Wins ties." },
  bold:    { label: "Bold",    travelDelta: -1, powerDelta: -1, hint: "Faster, riskier. Loses ties." },
  honest:  { label: "Honest",  travelDelta:  0, powerDelta:  0, hint: "Cancels Rival's Gossip bonus." },
  playful: { label: "Playful", travelDelta:  0, powerDelta:  0, hint: "Tie-breaks IF Encouraging Note played." },
};

export const TitleLogo = ({ width = 480 }: { width?: number }) => (
  <svg viewBox="-40 0 1080 320" width={width} style={{ display: "block" }}>
    <rect x="-40" width="1080" height="320" fill="url(#midnight-coin)" rx="6" opacity="0.001" />
    <text x="500" y="140" textAnchor="middle" fontFamily="Cormorant Garamond, Garamond, serif" fontSize="120" fontWeight="600" letterSpacing="14" fill="url(#gold-leaf)" filter="url(#brush)">RIVAL HEARTS</text>
    <line x1="160" y1="170" x2="840" y2="170" stroke="url(#gold-leaf-h)" strokeWidth="2" />
    <text x="500" y="220" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="44" fontWeight="400" letterSpacing="6" fill="#e9c47a">The Confidant</text>
    <g transform="translate(500 270)">
      <g transform="rotate(38)">
        <rect x="-2" y="-50" width="4" height="64" fill="url(#gold-leaf)" />
        <path d="M-2 14 L -2 18 L 0 24 L 2 18 L 2 14 Z" fill="#8c6c2d" />
        <rect x="-8" y="-50" width="16" height="3" fill="#c9a35f" />
        <circle cx="0" cy="-54" r="3" fill="#e9c47a" />
      </g>
      <g transform="rotate(-38)">
        <circle cx="0" cy="-32" r="14" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="1.5" />
        <path d="M-10 -32 Q 0 -42, 10 -32 Q 4 -36, 0 -32 Q -4 -36, -10 -32 Z" fill="#8a2d3a" />
        <circle cx="0" cy="-32" r="4" fill="#3a0b13" />
        <path d="M0 -18 Q 4 -6, 0 8" fill="none" stroke="#3a5e2e" strokeWidth="2" />
        <path d="M-2 -2 Q -10 -4, -8 4 Q -2 2, -2 -2 Z" fill="#3a5e2e" />
      </g>
    </g>
  </svg>
);
