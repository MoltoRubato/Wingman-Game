import type { ComponentType, ReactNode } from "react";
import type { SignalType } from "@/lib/game/content";

export type SignalProps = { size?: number; glow?: boolean };
type BaseProps = SignalProps & { children?: ReactNode };
const stableCoord = (n: number) => Number(n.toFixed(4));

const SignalBase = ({ size = 128, children, glow = false }: BaseProps) => (
  <svg viewBox="0 0 256 256" width={size} height={size} style={{ display: "block" }}>
    <circle cx="128" cy="128" r="120" fill="url(#midnight-coin)" />
    <circle cx="128" cy="128" r="118" fill="none" stroke="url(#gold-leaf)" strokeWidth="3.5" />
    <circle cx="128" cy="128" r="111" fill="none" stroke="#5e4519" strokeWidth="1" opacity="0.7" />
    <circle cx="128" cy="128" r="106" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
    <ellipse cx="92" cy="78" rx="42" ry="22" fill="#e9c47a" opacity="0.08" filter="url(#soft-glow)" />
    <g filter="url(#brush-soft)">{children}</g>
    {glow && <circle cx="128" cy="128" r="120" fill="none" stroke="#e9c47a" strokeWidth="2" opacity="0.6" filter="url(#soft-glow)" />}
  </svg>
);

export const SignalHeart = (p: SignalProps) => (
  <SignalBase {...p}>
    <g fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.5">
      <path d="M128 200 C 84 168, 60 142, 60 112 C 60 92, 76 76, 96 76 C 110 76, 122 84, 128 96 L 124 104 L 132 104 L 128 96 C 134 84, 146 76, 160 76 C 180 76, 196 92, 196 112 C 196 142, 172 168, 128 200 Z" />
      <path d="M118 82 L 122 70 L 128 78 L 134 70 L 138 82 Z" fill="#e9c47a" />
    </g>
    <path d="M82 100 Q 100 90, 122 96" fill="none" stroke="#f1d68d" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
  </SignalBase>
);

export const SignalThorn = (p: SignalProps) => (
  <SignalBase {...p}>
    <g fill="none" stroke="url(#gold-coin)" strokeWidth="6" strokeLinecap="round">
      <path d="M70 196 C 90 160, 110 130, 140 110 C 170 92, 188 76, 196 60" />
    </g>
    <g fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1">
      <path d="M104 152 L 88 138 L 100 144 Z" />
      <path d="M138 122 L 152 104 L 144 118 Z" />
      <path d="M170 96 L 156 82 L 168 92 Z" />
      <path d="M118 138 Q 132 130, 138 116 Q 124 122, 118 138 Z" />
    </g>
    <path d="M120 138 L 132 124" stroke="#5e4519" strokeWidth="1" />
  </SignalBase>
);

export const SignalEye = (p: SignalProps) => (
  <SignalBase {...p}>
    <g stroke="url(#gold-coin)" strokeWidth="5" fill="none" strokeLinecap="round">
      <path d="M58 132 Q 128 88, 198 132" />
      <path d="M62 138 Q 128 168, 194 138" />
    </g>
    <circle cx="128" cy="138" r="22" fill="url(#midnight-coin)" stroke="url(#gold-coin)" strokeWidth="3" />
    <circle cx="128" cy="138" r="10" fill="#0d1733" />
    <circle cx="122" cy="132" r="4" fill="#f1d68d" opacity="0.9" />
    <g stroke="#8c6c2d" strokeWidth="2" strokeLinecap="round">
      <line x1="72" y1="120" x2="68" y2="108" />
      <line x1="92" y1="106" x2="90" y2="92" />
      <line x1="128" y1="98" x2="128" y2="84" />
      <line x1="164" y1="106" x2="166" y2="92" />
      <line x1="184" y1="120" x2="188" y2="108" />
    </g>
    <path d="M128 168 Q 124 188, 130 198 Q 136 188, 132 168 Z" fill="#0d1733" stroke="#5e4519" strokeWidth="1" />
  </SignalBase>
);

export const SignalClock = (p: SignalProps) => (
  <SignalBase {...p}>
    <circle cx="128" cy="134" r="62" fill="none" stroke="url(#gold-coin)" strokeWidth="5" />
    <circle cx="128" cy="134" r="56" fill="none" stroke="#5e4519" strokeWidth="1" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x1 = stableCoord(128 + Math.cos(a) * 54);
      const y1 = stableCoord(134 + Math.sin(a) * 54);
      const x2 = stableCoord(128 + Math.cos(a) * (i % 3 === 0 ? 46 : 50));
      const y2 = stableCoord(134 + Math.sin(a) * (i % 3 === 0 ? 46 : 50));
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a35f" strokeWidth={i % 3 === 0 ? 2.5 : 1.5} strokeLinecap="round" />;
    })}
    <line x1="128" y1="134" x2="120" y2="92" stroke="#f1d68d" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="128" y1="134" x2="112" y2="124" stroke="#f1d68d" strokeWidth="4" strokeLinecap="round" />
    <circle cx="128" cy="134" r="4" fill="#f1d68d" />
    <rect x="120" y="60" width="16" height="12" rx="2" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1" />
    <rect x="124" y="52" width="8" height="10" rx="2" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1" />
  </SignalBase>
);

export const SignalMask = (p: SignalProps) => (
  <SignalBase {...p}>
    <g transform="rotate(-12 128 128)">
      <path d="M52 100 Q 60 84, 84 82 L 172 82 Q 196 84, 204 100 Q 208 124, 196 140 Q 178 156, 152 152 Q 140 148, 128 142 Q 116 148, 104 152 Q 78 156, 60 140 Q 48 124, 52 100 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="2" />
      <ellipse cx="92" cy="116" rx="14" ry="10" fill="#0d1733" />
      <ellipse cx="164" cy="116" rx="14" ry="10" fill="#06081c" />
      <path d="M150 110 Q 164 106, 178 110 L 178 122 Q 164 126, 150 122 Z" fill="#03061a" opacity="0.6" />
      <path d="M70 96 Q 90 88, 110 94" stroke="#5e4519" strokeWidth="1.5" fill="none" />
      <path d="M150 94 Q 170 88, 188 96" stroke="#5e4519" strokeWidth="1.5" fill="none" />
      <path d="M68 92 Q 92 80, 116 86" stroke="#f1d68d" strokeWidth="1.5" fill="none" opacity="0.7" />
    </g>
  </SignalBase>
);

export const SignalKey = (p: SignalProps) => (
  <SignalBase {...p}>
    <g fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="2">
      <path d="M128 60 C 108 44, 86 56, 86 78 C 86 96, 108 110, 128 130 C 148 110, 170 96, 170 78 C 170 56, 148 44, 128 60 Z" />
      <circle cx="128" cy="82" r="10" fill="#0d1733" />
      <rect x="122" y="126" width="12" height="62" />
      <rect x="134" y="158" width="14" height="6" />
      <rect x="134" y="172" width="10" height="6" />
      <rect x="134" y="184" width="14" height="6" />
    </g>
    <path d="M100 76 Q 110 64, 124 66" stroke="#f1d68d" strokeWidth="1.5" fill="none" opacity="0.8" />
  </SignalBase>
);

export const SIGNAL_COMPONENTS: Record<SignalType, ComponentType<SignalProps>> = {
  heart: SignalHeart,
  thorn: SignalThorn,
  clock: SignalClock,
  mask:  SignalMask,
};

export const SIGNAL_META: Record<SignalType, { label: string; hint: string }> = {
  heart: { label: "Heart", hint: "Good choice or fitting tone" },
  thorn: { label: "Thorn", hint: "Danger" },
  clock: { label: "Clock", hint: "Timing or speed" },
  mask:  { label: "Mask",  hint: "Deception or Rival" },
};
