import type { ComponentType, ReactNode } from "react";
import type { RouteKey } from "@/lib/game/content";
import { routeAssetUrl } from "@/lib/art/manifest";

export type RouteProps = { w?: number; h?: number };
type BaseProps = RouteProps & { children?: ReactNode };

const RouteBase = ({ children, w = 768, h = 384 }: BaseProps) => (
  <svg viewBox="0 0 1536 768" width={w} height={h} style={{ display: "block" }} preserveAspectRatio="xMidYMid slice">
    {children}
    <rect width="1536" height="768" fill="url(#candle-vignette)" opacity="0.6" />
  </svg>
);

/* Deterministic variance - same seed → same value, so SSR & client agree. */
const variance = (i: number) => Math.abs(Math.sin(i * 9301 + 49297));

export const RouteGarden = (p: RouteProps) => (
  <RouteBase {...p}>
    <defs>
      <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a2a52" />
        <stop offset="55%" stopColor="#2a4a72" />
        <stop offset="100%" stopColor="#5a6e8a" />
      </linearGradient>
      <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f3e7d0" />
        <stop offset="60%" stopColor="#f3e7d0" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f3e7d0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="garden-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1f3a4a" />
        <stop offset="100%" stopColor="#0e1f2a" />
      </linearGradient>
    </defs>
    <rect width="1536" height="500" fill="url(#garden-sky)" />
    <circle cx="1180" cy="160" r="120" fill="url(#moon-glow)" />
    <circle cx="1180" cy="160" r="48" fill="#f3e7d0" filter="url(#brush-soft)" />
    <g fill="#f3e7d0">
      {([[200,80],[330,140],[480,60],[640,120],[780,90],[900,180],[1020,80],[1380,260],[100,200]] as const).map(([x, y], i) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={1.2 + variance(i) * 0.8} opacity="0.85" />
      ))}
    </g>
    <g filter="url(#brush-soft)">
      <rect x="720" y="380" width="36" height="48" fill="#e9c47a" />
      <rect x="720" y="380" width="36" height="48" fill="url(#candle-vignette)" opacity="0.3" />
      <ellipse cx="738" cy="404" rx="80" ry="36" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
    </g>
    <rect y="500" width="1536" height="268" fill="url(#garden-ground)" />
    <g filter="url(#brush)" fill="#0e2329" opacity="0.95">
      <path d="M680 500 Q 680 380, 738 360 Q 796 380, 796 500 L 760 500 Q 760 420, 738 408 Q 716 420, 716 500 Z" />
    </g>
    <g filter="url(#brush-heavy)" fill="#0e2329">
      <ellipse cx="120" cy="540" rx="180" ry="80" />
      <ellipse cx="280" cy="560" rx="140" ry="60" />
      <ellipse cx="1100" cy="540" rx="180" ry="80" />
      <ellipse cx="1380" cy="560" rx="160" ry="70" />
      <ellipse cx="540" cy="540" rx="60" ry="40" />
      <ellipse cx="936" cy="540" rx="60" ry="40" />
    </g>
    <g fill="#f3e7d0" opacity="0.85" filter="url(#brush-soft)">
      {([[80, 510], [140, 500], [200, 515], [240, 530], [1080, 510], [1140, 500], [1200, 520], [1340, 500], [1400, 540], [560, 526], [930, 526]] as const).map(([x, y], i) => (
        <circle key={`r-${x}-${y}`} cx={x} cy={y} r={5 + variance(i + 11) * 3} />
      ))}
    </g>
    <g filter="url(#brush-soft)">
      <path d="M0 768 L 540 768 Q 720 700, 738 460 L 740 460 Q 720 700, 560 768 L 1536 768 Z" fill="#5a4a3a" />
      <path d="M120 768 Q 600 720, 738 480" stroke="#8c6c2d" strokeWidth="2" fill="none" opacity="0.6" />
      <g stroke="#3a2418" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M200 720 L 280 700" />
        <path d="M340 696 L 420 678" />
        <path d="M480 666 L 540 644" />
      </g>
    </g>
    <g filter="url(#brush-soft)">
      <line x1="380" y1="660" x2="380" y2="540" stroke="#3a2418" strokeWidth="3" />
      <rect x="370" y="540" width="22" height="30" fill="#1a0f12" stroke="#5e4519" strokeWidth="1" />
      <circle cx="381" cy="554" r="18" fill="#e9c47a" opacity="0.6" filter="url(#soft-glow)" />
      <ellipse cx="380" cy="554" rx="6" ry="8" fill="#f1d68d" />
      <line x1="1140" y1="660" x2="1140" y2="540" stroke="#3a2418" strokeWidth="3" />
      <rect x="1130" y="540" width="22" height="30" fill="#1a0f12" stroke="#5e4519" strokeWidth="1" />
      <circle cx="1141" cy="554" r="18" fill="#e9c47a" opacity="0.6" filter="url(#soft-glow)" />
      <ellipse cx="1140" cy="554" rx="6" ry="8" fill="#f1d68d" />
    </g>
  </RouteBase>
);

export const RouteGallery = (p: RouteProps) => (
  <RouteBase {...p}>
    <defs>
      <linearGradient id="gallery-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a132a" />
        <stop offset="50%" stopColor="#3a1a3a" />
        <stop offset="100%" stopColor="#1a0820" />
      </linearGradient>
      <linearGradient id="parquet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e4519" />
        <stop offset="100%" stopColor="#2a1a08" />
      </linearGradient>
    </defs>
    <rect width="1536" height="520" fill="url(#gallery-wall)" />
    <polygon points="0,520 1536,520 1336,768 200,768" fill="url(#parquet)" />
    <g stroke="#8c6c2d" strokeWidth="1" fill="none" opacity="0.4">
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
        const x1 = t * 1536;
        const x2 = 200 + t * (1536 - 400);
        return <line key={i} x1={x1} y1="520" x2={x2} y2="768" />;
      })}
      <line x1="100" y1="600" x2="1436" y2="600" />
      <line x1="60" y1="680" x2="1476" y2="680" />
    </g>
    {[80, 360, 1040, 1320].map((x) => (
      <g key={x} filter="url(#brush-soft)">
        <rect x={x} y="100" width="240" height="340" fill="url(#gold-leaf)" stroke="#5e4519" strokeWidth="3" />
        <rect x={x + 14} y="114" width="212" height="312" fill="#1a0a1a" />
        <ellipse cx={x + 120} cy="220" rx="42" ry="50" fill="#3a2a3a" filter="url(#brush)" />
        <path d={`M${x + 60} 380 Q ${x + 120} 280, ${x + 180} 380 L ${x + 180} 426 L ${x + 60} 426 Z`} fill="#3a2a3a" />
        <circle cx={x + 120} cy="106" r="6" fill="url(#gold-coin)" />
      </g>
    ))}
    <g filter="url(#brush-soft)">
      <path d="M704 130 Q 768 90, 832 130 L 832 460 L 704 460 Z" fill="#1a0820" />
      <path d="M704 130 Q 768 90, 832 130" stroke="url(#gold-leaf-h)" strokeWidth="4" fill="none" />
      <rect x="744" y="200" width="48" height="200" fill="#3a2a3a" />
    </g>
    {[200, 600, 940, 1340].map((x) => (
      <g key={x} filter="url(#brush-soft)">
        <line x1={x} y1="520" x2={x} y2="380" stroke="#5e4519" strokeWidth="4" />
        <circle cx={x} cy="380" r="6" fill="url(#gold-coin)" />
        <path d={`M${x - 30} 370 L ${x} 380 L ${x + 30} 370`} stroke="url(#gold-leaf-h)" strokeWidth="3" fill="none" />
        {[-30, 0, 30].map((dx) => (
          <g key={dx}>
            <rect x={x + dx - 2} y="356" width="4" height="14" fill="#f3e7d0" />
            <ellipse cx={x + dx} cy="350" rx="3" ry="6" fill="#f1d68d" />
            <ellipse cx={x + dx} cy="350" rx="14" ry="18" fill="#e9c47a" opacity="0.3" filter="url(#soft-glow)" />
          </g>
        ))}
      </g>
    ))}
    <ellipse cx="768" cy="680" rx="600" ry="32" fill="#e9c47a" opacity="0.12" filter="url(#soft-glow)" />
  </RouteBase>
);

export const RouteCorridor = (p: RouteProps) => (
  <RouteBase {...p}>
    <defs>
      <linearGradient id="corridor-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a2a1a" />
        <stop offset="100%" stopColor="#1a1208" />
      </linearGradient>
    </defs>
    <rect width="1536" height="768" fill="#1a0f0a" />
    <polygon points="0,0 800,300 800,520 0,768" fill="url(#corridor-wall)" />
    <polygon points="1536,0 800,300 800,520 1536,768" fill="url(#corridor-wall)" />
    <polygon points="0,768 800,520 1536,768" fill="#2a1a08" />
    <polygon points="0,0 1536,0 800,300" fill="#1a0f0a" />
    <g stroke="#0a0608" strokeWidth="1" fill="none" opacity="0.7">
      {[80, 200, 340, 500].map((y) => (
        <path key={y} d={`M0 ${y} L 800 ${y * 0.55 + 130}`} />
      ))}
      {[60, 180, 320, 480, 640].map((x) => (
        <path key={x} d={`M${x} 0 L ${800 - (800 - x) * 0.4} 300`} />
      ))}
    </g>
    <g stroke="#0a0608" strokeWidth="1" fill="none" opacity="0.7">
      {[80, 200, 340, 500].map((y) => (
        <path key={y} d={`M1536 ${y} L 800 ${y * 0.55 + 130}`} />
      ))}
    </g>
    <g filter="url(#brush-soft)">
      <path d="M0 80 L 800 290" stroke="url(#gold-leaf)" strokeWidth="14" />
      <path d="M0 96 L 800 296" stroke="#8c6c2d" strokeWidth="3" opacity="0.7" />
      <path d="M1536 80 L 800 290" stroke="url(#gold-leaf)" strokeWidth="14" />
      <path d="M1536 96 L 800 296" stroke="#8c6c2d" strokeWidth="3" opacity="0.7" />
    </g>
    <g filter="url(#brush)">
      <rect x="60" y="500" width="120" height="120" fill="#5e4519" stroke="#3a2418" strokeWidth="2" />
      <rect x="60" y="500" width="120" height="20" fill="#3a2418" />
      <g stroke="#8c6c2d" strokeWidth="2" fill="none">
        <line x1="60" y1="540" x2="180" y2="540" />
        <line x1="60" y1="570" x2="180" y2="570" />
        <line x1="60" y1="600" x2="180" y2="600" />
      </g>
      <path d="M80 500 Q 100 484, 140 500 Q 160 488, 168 500" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.8" />
    </g>
    <g filter="url(#brush-soft)">
      <line x1="200" y1="380" x2="240" y2="380" stroke="#5e4519" strokeWidth="3" />
      <circle cx="240" cy="380" r="14" fill="#e9c47a" />
      <ellipse cx="240" cy="380" rx="50" ry="34" fill="#e9c47a" opacity="0.4" filter="url(#soft-glow)" />
      <ellipse cx="240" cy="380" rx="120" ry="80" fill="#e9c47a" opacity="0.15" filter="url(#soft-glow)" />
    </g>
    <g opacity="0.5">
      <path d="M240 380 L 100 768 L 400 768 Z" fill="#e9c47a" opacity="0.1" filter="url(#soft-glow)" />
    </g>
    <g filter="url(#brush-soft)">
      <rect x="752" y="380" width="40" height="120" fill="#3a2418" stroke="#1a0f0a" strokeWidth="1.5" />
      <rect x="756" y="382" width="14" height="116" fill="#e9c47a" opacity="0.95" />
      <ellipse cx="772" cy="440" rx="50" ry="80" fill="#e9c47a" opacity="0.2" filter="url(#soft-glow)" />
      <path d="M752 500 L 720 600 L 820 600 L 792 500 Z" fill="#e9c47a" opacity="0.18" filter="url(#soft-glow)" />
    </g>
    <ellipse cx="600" cy="640" rx="80" ry="14" fill="#e9c47a" opacity="0.1" filter="url(#soft-glow)" />
  </RouteBase>
);

const withAIRoute = (key: RouteKey, SvgFallback: ComponentType<RouteProps>): ComponentType<RouteProps> => {
  const Wrapped = ({ w = 768, h = 384 }: RouteProps) => {
    const ai = routeAssetUrl(key);
    if (!ai) return <SvgFallback w={w} h={h} />;
    return (
      <svg viewBox="0 0 1536 768" width={w} height={h} style={{ display: "block" }} preserveAspectRatio="xMidYMid slice">
        <image href={ai} x="0" y="0" width="1536" height="768" preserveAspectRatio="xMidYMid slice" />
        <rect width="1536" height="768" fill="url(#candle-vignette)" opacity="0.45" />
      </svg>
    );
  };
  Wrapped.displayName = `Route_${key}`;
  return Wrapped;
};

export const ROUTE_COMPONENTS: Record<RouteKey, ComponentType<RouteProps>> = {
  fast:   withAIRoute("fast", RouteGarden),
  safe:   withAIRoute("safe", RouteGallery),
  secret: withAIRoute("secret", RouteCorridor),
};

export const ROUTE_META: Record<RouteKey, { label: string; hint: string; artSource: string }> = {
  fast:   { label: "Fast Route",   hint: "Shortest path, easiest to rush, hardest to read.", artSource: "garden" },
  safe:   { label: "Safe Route",   hint: "Public path, steady pace, often the obvious choice.", artSource: "gallery" },
  secret: { label: "Secret Route", hint: "Hidden path, tempting when the court is watching.", artSource: "corridor" },
};
