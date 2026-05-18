import type { ComponentType, ReactNode } from "react";
import type { ObstacleKey } from "@/lib/game/content";

export type ObstacleProps = { size?: number };
type BaseProps = ObstacleProps & { children?: ReactNode };

const ObstacleBase = ({ size = 128, children }: BaseProps) => (
  <svg viewBox="0 0 256 256" width={size} height={size} style={{ display: "block" }}>
    <circle cx="128" cy="128" r="120" fill="#0e2329" />
    <circle cx="128" cy="128" r="120" fill="url(#teal-vignette)" />
    <circle cx="128" cy="128" r="118" fill="none" stroke="url(#gold-leaf)" strokeWidth="3" />
    <circle cx="128" cy="128" r="111" fill="none" stroke="#8c6c2d" strokeWidth="1" />
    <g stroke="#c9a35f" strokeWidth="0.6" fill="none">
      <circle cx="128" cy="128" r="115" strokeDasharray="2 4" opacity="0.5" />
    </g>
    {[0, 90, 180, 270].map((deg) => (
      <g key={deg} transform={`rotate(${deg} 128 128)`}>
        <path d="M128 10 Q 132 16, 128 24 Q 124 16, 128 10 Z" fill="url(#gold-coin)" />
      </g>
    ))}
    <g filter="url(#brush-soft)">{children}</g>
  </svg>
);

export const ObsGossip = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <g fill="#f3e7d0" stroke="#5e4519" strokeWidth="1.5">
      <path d="M58 100 Q 58 78, 84 78 L 130 78 Q 156 78, 156 100 Q 156 124, 130 124 L 96 124 L 78 138 L 86 124 Q 58 122, 58 100 Z" opacity="0.95" />
      <path d="M88 130 Q 88 108, 114 108 L 160 108 Q 186 108, 186 130 Q 186 154, 160 154 L 126 154 L 108 168 L 116 154 Q 88 152, 88 130 Z" opacity="0.92" fill="#e8d4ad" />
      <path d="M118 150 Q 118 128, 144 128 L 190 128 Q 216 128, 216 150 Q 216 174, 190 174 L 156 174 L 138 188 L 146 174 Q 118 172, 118 150 Z" opacity="0.9" fill="#d4bf8c" />
    </g>
    <path d="M180 140 L 170 150 L 178 156 L 168 164" stroke="#5e4519" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M180 140 L 170 150" stroke="#3a2418" strokeWidth="1" fill="none" />
    <g stroke="#5e4519" strokeWidth="2" fill="none">
      <path d="M62 188 Q 130 160, 218 132" />
    </g>
    <path d="M58 192 Q 50 198, 56 204 L 76 184 Q 70 180, 58 192 Z" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1" />
    <path d="M62 188 L 76 184" stroke="#8c6c2d" strokeWidth="0.6" />
  </ObstacleBase>
);

export const ObsGuard = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <g fill="#e8d4ad" stroke="#5e4519" strokeWidth="2">
      <path d="M88 92 Q 88 64, 128 60 Q 168 64, 168 92 L 168 144 Q 168 168, 128 172 Q 88 168, 88 144 Z" />
      <rect x="86" y="108" width="84" height="10" fill="#0e2329" stroke="#5e4519" />
      <rect x="92" y="112" width="14" height="2" fill="#f3e7d0" />
      <rect x="116" y="112" width="14" height="2" fill="#f3e7d0" />
      <rect x="140" y="112" width="14" height="2" fill="#f3e7d0" />
      <path d="M124 60 Q 128 44, 132 60 Z" fill="#6e1f2e" />
    </g>
    <g stroke="#8c6c2d" strokeWidth="6" strokeLinecap="round">
      <line x1="40" y1="200" x2="216" y2="56" />
    </g>
    <path d="M210 50 L 230 40 L 224 64 L 218 60 Z" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1.5" />
    <path d="M214 54 L 220 60" stroke="#5e4519" strokeWidth="1" />
    <rect x="80" y="180" width="14" height="18" fill="#5e4519" transform="rotate(-38 87 189)" />
  </ObstacleBase>
);

export const ObsLockedDoor = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <path d="M76 196 L 76 108 Q 76 60, 128 60 Q 180 60, 180 108 L 180 196 Z" fill="#e8d4ad" stroke="#5e4519" strokeWidth="2.5" />
    <path d="M88 188 L 88 112 Q 88 72, 128 72 Q 168 72, 168 112 L 168 188 Z" fill="none" stroke="#5e4519" strokeWidth="1.5" />
    <path d="M88 140 L 168 140" stroke="#5e4519" strokeWidth="1.2" />
    <circle cx="128" cy="130" r="11" fill="#0e2329" stroke="#5e4519" strokeWidth="2" />
    <rect x="124" y="138" width="8" height="18" fill="#0e2329" stroke="#5e4519" strokeWidth="2" />
    <rect x="84" y="118" width="6" height="14" fill="#8c6c2d" />
    <rect x="84" y="166" width="6" height="14" fill="#8c6c2d" />
    <circle cx="148" cy="148" r="6" fill="none" stroke="#8c6c2d" strokeWidth="2" />
  </ObstacleBase>
);

export const ObsCrowded = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <g fill="#1a3038" stroke="#5e4519" strokeWidth="1">
      <ellipse cx="68" cy="180" rx="22" ry="34" />
      <ellipse cx="100" cy="170" rx="22" ry="36" />
      <ellipse cx="132" cy="165" rx="22" ry="38" />
      <ellipse cx="164" cy="170" rx="22" ry="36" />
      <ellipse cx="196" cy="180" rx="22" ry="34" />
    </g>
    <g fill="#e8d4ad" opacity="0.7" stroke="#5e4519" strokeWidth="0.6">
      {[68, 100, 132, 164, 196].map((cx, i) => {
        const cy = [180, 170, 165, 170, 180][i];
        return (
          <g key={cx}>
            <circle cx={cx - 12} cy={cy - 20} r="5" />
            <circle cx={cx} cy={cy - 28} r="6" />
            <circle cx={cx + 12} cy={cy - 20} r="5" />
          </g>
        );
      })}
    </g>
    <g transform="rotate(-15 128 90)">
      <path d="M128 60 L 84 130 Q 90 138, 128 138 Q 166 138, 172 130 Z" fill="#f3e7d0" stroke="#5e4519" strokeWidth="2" />
      <g stroke="#5e4519" strokeWidth="1" fill="none">
        <path d="M128 60 L 90 128" />
        <path d="M128 60 L 110 132" />
        <path d="M128 60 L 128 138" />
        <path d="M128 60 L 146 132" />
        <path d="M128 60 L 166 128" />
      </g>
      <circle cx="128" cy="60" r="4" fill="url(#gold-coin)" stroke="#5e4519" />
    </g>
  </ObstacleBase>
);

export const ObsFalseAddress = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <g fill="#f3e7d0" stroke="#5e4519" strokeWidth="2">
      <rect x="56" y="84" width="144" height="96" rx="3" />
      <path d="M56 84 L 128 144 L 200 84" fill="#e8d4ad" stroke="#5e4519" strokeWidth="2" />
    </g>
    <g stroke="#3a2418" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
      <line x1="72" y1="156" x2="138" y2="156" />
      <line x1="72" y1="166" x2="124" y2="166" />
    </g>
    <g fill="#3a2418" opacity="0.3">
      <circle cx="118" cy="156" r="6" />
      <circle cx="106" cy="166" r="5" />
    </g>
    <circle cx="172" cy="158" r="20" fill="url(#wax-red)" stroke="#3a0b13" strokeWidth="1.5" />
    <text x="172" y="166" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="24" fontWeight="700" fill="#f3e7d0">?</text>
  </ObstacleBase>
);

export const ObsSecretPassage = (p: ObstacleProps) => (
  <ObstacleBase {...p}>
    <rect x="56" y="60" width="144" height="148" fill="#5e4519" stroke="#3a2418" strokeWidth="2" />
    <g transform="rotate(-22 128 134)">
      <rect x="124" y="64" width="78" height="140" fill="#8c6c2d" stroke="#3a2418" strokeWidth="2" />
      <g>
        {[72, 90, 108, 126, 144, 162, 180].map((y, i) => (
          <rect key={y} x={130 + (i % 2) * 2} y={y} width={66} height={14} fill={["#6e1f2e", "#2b132e", "#0e2329", "#5e4519", "#6e1f2e", "#2b132e", "#1a3a40"][i]} stroke="#3a2418" strokeWidth="0.6" />
        ))}
      </g>
    </g>
    <rect x="56" y="60" width="64" height="148" fill="#8c6c2d" stroke="#3a2418" strokeWidth="2" />
    {[72, 90, 108, 126, 144, 162, 180].map((y, i) => (
      <rect key={y} x={60 + (i % 2) * 2} y={y} width={56} height={14} fill={["#6e1f2e", "#2b132e", "#0e2329", "#5e4519", "#0e2329", "#2b132e", "#6e1f2e"][i]} stroke="#3a2418" strokeWidth="0.6" />
    ))}
    <path d="M120 60 L 120 208 L 136 208 L 132 60 Z" fill="#1a0f0a" />
    <g fill="#c9a35f" opacity="0.85">
      <rect x="121" y="180" width="14" height="4" />
      <rect x="122" y="172" width="12" height="3" />
      <rect x="123" y="166" width="10" height="2.5" />
      <rect x="124" y="160" width="8" height="2" />
    </g>
    <ellipse cx="128" cy="190" rx="18" ry="22" fill="#e9c47a" opacity="0.25" filter="url(#soft-glow)" />
  </ObstacleBase>
);

export const OBSTACLE_COMPONENTS: Record<ObstacleKey, ComponentType<ObstacleProps>> = {
  gossip: ObsGossip,
  guard: ObsGuard,
  locked_door: ObsLockedDoor,
  crowded_hall: ObsCrowded,
  false_address: ObsFalseAddress,
  secret_passage: ObsSecretPassage,
};

export const OBSTACLE_META: Record<ObstacleKey, { label: string; blocking: boolean; mvp: boolean; desc: string }> = {
  gossip:        { label: "Gossip",         blocking: false, mvp: true,  desc: "Whispers travel faster than the Suitor." },
  guard:         { label: "Guard",          blocking: false, mvp: true,  desc: "+2 Travel Time unless distracted." },
  locked_door:   { label: "Locked Door",    blocking: true,  mvp: true,  desc: "Requires Find Key. Otherwise: fail." },
  crowded_hall:  { label: "Crowded Hall",   blocking: false, mvp: false, desc: "Wait for the Right Moment recommended." },
  false_address: { label: "False Address",  blocking: true,  mvp: false, desc: "Requires Correct Address. Otherwise: fail." },
  secret_passage:{ label: "Secret Passage", blocking: false, mvp: true,  desc: "Hidden route — only the Confidant sees it." },
};
