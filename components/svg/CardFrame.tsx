import type { ReactNode } from "react";

export type CardVariant = "confidant" | "suitor" | "rival";

export type CardFrameProps = {
  variant?: CardVariant;
  title?: string;
  cost?: number | null;
  type?: string;
  effect?: string;
  art?: ReactNode;
  width?: number;
  flipped?: boolean;
};

const PALETTES = {
  confidant: {
    base: "#2b132e", baseShadow: "#1a0820",
    filigree: "#c9c4d4", filigreeMid: "#8a89a4",
    banner: "#4a234e", bannerEdge: "#1a0820",
    plaque: "#f3e7d0", plaqueShadow: "#b89c6e",
  },
  suitor: {
    base: "#6e1f2e", baseShadow: "#441119",
    filigree: "#e9c47a", filigreeMid: "#c9a35f",
    banner: "#8a2d3a", bannerEdge: "#441119",
    plaque: "#f3e7d0", plaqueShadow: "#b89c6e",
  },
  rival: {
    base: "#1a1216", baseShadow: "#06080a",
    filigree: "#c9a35f", filigreeMid: "#8c6c2d",
    banner: "#261a1f", bannerEdge: "#06080a",
    plaque: "#e8d4ad", plaqueShadow: "#8c6c2d",
  },
};

export const CardFrame = ({
  variant = "confidant",
  title,
  cost,
  type,
  effect,
  art,
  width = 280,
  flipped = false,
}: CardFrameProps) => {
  const palette = PALETTES[variant];
  const h = (width * 1024) / 720;

  return (
    <svg viewBox="0 0 720 1024" width={width} height={h} style={{ display: "block" }}>
      <rect x="6" y="14" width="708" height="1004" rx="14" fill="#000" opacity="0.5" filter="url(#soft-glow)" />
      <rect x="0" y="0" width="720" height="1024" rx="14" fill={palette.base} />
      <rect x="0" y="0" width="720" height="1024" rx="14" fill="url(#candle-vignette)" opacity="0.4" />
      {flipped ? (
        <g>
          <rect x="20" y="20" width="680" height="984" rx="10" fill="none" stroke={palette.filigree} strokeWidth="2.5" />
          <rect x="32" y="32" width="656" height="960" rx="8" fill="none" stroke={palette.filigreeMid} strokeWidth="1" />
          <circle cx="360" cy="512" r="130" fill={palette.banner} stroke={palette.filigree} strokeWidth="3" />
          <circle cx="360" cy="512" r="90" fill="none" stroke={palette.filigreeMid} strokeWidth="1.5" strokeDasharray="3 5" />
          <text x="360" y="528" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="80" fontWeight="700" fill={palette.filigree} fontStyle="italic">
            {variant === "confidant" ? "C" : variant === "suitor" ? "S" : "R"}
          </text>
          {([[80, 80, 0], [640, 80, 90], [640, 944, 180], [80, 944, 270]] as const).map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M0 0 Q 40 -10, 60 -50 M 0 0 Q -10 40, -50 60" stroke={palette.filigree} strokeWidth="2" fill="none" />
              <circle cx="0" cy="0" r="4" fill={palette.filigree} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <rect x="20" y="20" width="680" height="984" rx="10" fill="none" stroke={palette.filigree} strokeWidth="2.5" />
          <rect x="32" y="32" width="656" height="960" rx="8" fill="none" stroke={palette.filigreeMid} strokeWidth="1" />
          <g>
            <path d="M60 60 L 660 60 L 680 110 L 660 160 L 60 160 L 40 110 Z" fill={palette.banner} stroke={palette.filigree} strokeWidth="2.5" />
            <path d="M40 110 L 30 102 L 28 114 L 36 122 Z" fill={palette.bannerEdge} stroke={palette.filigree} strokeWidth="1" />
            <path d="M680 110 L 690 102 L 692 114 L 684 122 Z" fill={palette.bannerEdge} stroke={palette.filigree} strokeWidth="1" />
            <text x="360" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="38" fontWeight="600" fill={palette.filigree} letterSpacing="2">{title}</text>
            <text x="360" y="148" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="14" fontStyle="italic" fill={palette.filigreeMid} letterSpacing="3">
              {(type || "ACTION").toUpperCase()}
            </text>
          </g>

          {cost !== undefined && cost !== null && (
            <g>
              <circle cx="58" cy="58" r="36" fill={palette.base} stroke={palette.filigree} strokeWidth="2.5" />
              <circle cx="58" cy="58" r="30" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1.2" />
              <text x="58" y="70" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="40" fontWeight="700" fill="#1a0f12">{cost}</text>
            </g>
          )}

          <g>
            <rect x="60" y="190" width="600" height="500" rx="6" fill="#0e1326" stroke={palette.filigreeMid} strokeWidth="1.5" />
            <rect x="60" y="190" width="600" height="500" rx="6" fill="url(#candle-vignette)" opacity="0.5" />
            {art && (
              <g transform="translate(60 190)" clipPath="url(#card-art-clip)">
                <defs>
                  <clipPath id="card-art-clip">
                    <rect x="0" y="0" width="600" height="500" rx="6" />
                  </clipPath>
                </defs>
                {art}
              </g>
            )}
            <rect x="68" y="198" width="584" height="484" rx="4" fill="none" stroke={palette.filigree} strokeWidth="0.8" opacity="0.4" />
          </g>

          <g>
            <rect x="60" y="720" width="600" height="240" rx="6" fill={palette.plaque} filter="url(#brush-soft)" />
            <rect x="60" y="720" width="600" height="240" rx="6" fill="none" stroke={palette.plaqueShadow} strokeWidth="2" />
            <rect x="72" y="732" width="576" height="216" rx="4" fill="none" stroke={palette.plaqueShadow} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" />
            {effect && (
              <foreignObject x="80" y="740" width="560" height="210">
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Garamond, serif",
                    fontSize: 22,
                    lineHeight: 1.3,
                    color: "#3a2418",
                    padding: "12px 14px",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {effect}
                </div>
              </foreignObject>
            )}
          </g>

          {([[42, 42, 0], [678, 42, 90], [678, 982, 180], [42, 982, 270]] as const).map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M0 0 L 24 0 M 0 0 L 0 24" stroke={palette.filigree} strokeWidth="2" fill="none" />
              <circle cx="0" cy="0" r="3" fill={palette.filigree} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};
