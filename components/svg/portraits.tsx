import type { ComponentType, ReactNode } from "react";
import { portraitAssetUrl } from "@/lib/art/manifest";

export type PortraitKey = "suitor" | "confidant" | "rival" | "celeste" | "aureon" | "mira" | "heir";

export type PortraitProps = { w?: number; h?: number };

type FrameProps = {
  children?: ReactNode;
  bgGradient?: string;
  w?: number;
  h?: number;
  label?: string;
};

export const PortraitFrame = ({ children, bgGradient = "candle-vignette", w = 320, h = 400, label }: FrameProps) => (
  <svg viewBox="0 0 400 500" width={w} height={h} style={{ display: "block" }}>
    <rect x="0" y="0" width="400" height="500" fill="#1a0f12" />
    <rect x="8" y="8" width="384" height="484" fill="none" stroke="url(#gold-leaf)" strokeWidth="4" />
    <rect x="14" y="14" width="372" height="472" fill="none" stroke="#5e4519" strokeWidth="1" />
    <rect x="18" y="18" width="364" height="464" fill="#0e1326" />
    <rect x="18" y="18" width="364" height="464" fill={`url(#${bgGradient})`} />
    <rect x="18" y="18" width="364" height="464" fill="url(#candle-vignette)" />
    {children}
    {([[26, 26, 0], [374, 26, 90], [374, 474, 180], [26, 474, 270]] as const).map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} fill="url(#gold-coin)">
        <path d="M-12 0 Q -10 -8, -2 -8 L 0 0 L -2 8 Q -10 8, -12 0 Z" opacity="0.85" />
        <circle cx="-6" cy="0" r="1.5" fill="#5e4519" />
      </g>
    ))}
    {label && (
      <g>
        <rect x="60" y="442" width="280" height="34" rx="2" fill="#1a0f12" stroke="url(#gold-leaf)" strokeWidth="1" />
        <text x="200" y="464" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="18" letterSpacing="3" fill="#e9c47a" fontStyle="italic">{label}</text>
      </g>
    )}
  </svg>
);

type HeadBlockProps = {
  skin?: string; skinShade?: string;
  hairFront?: ReactNode; hairBack?: ReactNode; hairColor?: string; hairHi?: string;
  garment?: string; garmentHi?: string; garmentShadow?: string;
  collar?: ReactNode; jewelry?: ReactNode; accent?: ReactNode;
  keyLight?: string;
  background?: ReactNode;
  faceDetail?: ReactNode;
  expressionLine?: ReactNode;
};

const HeadBlock = ({
  skin = "#d8b394", skinShade = "#a87a55",
  hairFront, hairBack, hairColor = "#3a2418",
  garment, garmentHi, garmentShadow,
  collar, jewelry, accent,
  keyLight = "#f1d68d",
  background,
  faceDetail,
  expressionLine,
}: HeadBlockProps) => (
  <g filter="url(#brush-soft)">
    {background}
    {hairBack}
    <g>
      <path d="M80 500 L 80 380 Q 100 340, 140 322 Q 180 312, 200 312 Q 220 312, 260 322 Q 300 340, 320 380 L 320 500 Z" fill={garment} stroke={garmentShadow} strokeWidth="1" />
      <path d="M120 360 Q 160 340, 200 332" stroke={garmentHi} strokeWidth="2.5" fill="none" opacity="0.6" />
    </g>
    {collar}
    <path d="M180 310 Q 180 332, 184 348 Q 200 354, 216 348 Q 220 332, 220 310 Z" fill={skin} stroke={skinShade} strokeWidth="0.6" />
    <path d="M186 340 Q 200 348, 214 340" stroke={skinShade} strokeWidth="0.8" fill="none" opacity="0.5" />
    <ellipse cx="200" cy="248" rx="62" ry="76" fill={skin} stroke={skinShade} strokeWidth="0.8" />
    <ellipse cx="174" cy="232" rx="30" ry="38" fill={keyLight} opacity="0.18" />
    <path d="M212 200 Q 232 240, 224 296 Q 218 312, 200 318 Q 224 300, 224 250 Z" fill={skinShade} opacity="0.4" />
    {hairFront}
    {faceDetail || (
      <>
        <ellipse cx="180" cy="246" rx="4" ry="2" fill="#1a0f12" />
        <ellipse cx="220" cy="246" rx="4" ry="2" fill="#1a0f12" />
        <path d="M174 240 Q 180 238, 186 240" stroke={hairColor} strokeWidth="0.8" fill="none" />
        <path d="M214 240 Q 220 238, 226 240" stroke={hairColor} strokeWidth="0.8" fill="none" />
        <path d="M198 252 Q 200 270, 200 278 Q 198 282, 200 284 Q 204 284, 204 280" stroke={skinShade} strokeWidth="0.8" fill="none" />
        {expressionLine || <path d="M188 296 Q 200 302, 212 296" stroke="#8a3a3a" strokeWidth="1.2" fill="none" />}
      </>
    )}
    {jewelry}
    {accent}
  </g>
);

export const PortraitSuitor = (props: PortraitProps) => (
  <PortraitFrame label="The Suitor" bgGradient="burgundy-vignette" {...props}>
    <g opacity="0.4" filter="url(#brush-heavy)">
      <rect x="60" y="80" width="40" height="280" fill="#c9a35f" opacity="0.2" />
      <rect x="300" y="80" width="40" height="280" fill="#c9a35f" opacity="0.2" />
      <circle cx="200" cy="120" r="42" fill="#e9c47a" opacity="0.2" filter="url(#soft-glow)" />
    </g>
    <HeadBlock
      skin="#d4a584" skinShade="#9a6e48"
      hairColor="#3a2418"
      keyLight="#e9c47a"
      hairBack={<path d="M138 200 Q 122 246, 132 320 L 156 322 Q 144 280, 152 220 Z" fill="#3a2418" />}
      hairFront={<>
        <path d="M148 200 Q 156 168, 200 162 Q 244 168, 254 204 Q 248 188, 232 184 Q 224 198, 218 202 Q 210 192, 200 194 Q 188 196, 178 208 Q 168 192, 158 196 Q 152 200, 148 200 Z" fill="#3a2418" stroke="#1a0f12" strokeWidth="0.6" />
        <path d="M158 196 Q 168 188, 180 198" stroke="#6e4a2a" strokeWidth="1" fill="none" opacity="0.6" />
      </>}
      garment="#6e1f2e" garmentHi="#983044" garmentShadow="#3a0b13"
      collar={<>
        <path d="M150 322 Q 200 312, 250 322 L 250 360 Q 200 348, 150 360 Z" fill="#c9a35f" stroke="#5e4519" strokeWidth="1" />
        <path d="M150 322 Q 200 312, 250 322" stroke="#f1d68d" strokeWidth="1" fill="none" />
        <g fill="#5e4519">{[170, 190, 210, 230].map((x) => <circle key={x} cx={x} cy="336" r="1.5" />)}</g>
      </>}
      accent={<>
        <g transform="translate(0 0)">
          <rect x="158" y="396" width="84" height="56" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1" transform="rotate(-6 200 424)" />
          <circle cx="200" cy="420" r="9" fill="url(#wax-red)" stroke="#3a0b13" strokeWidth="0.8" transform="rotate(-6 200 420)" />
        </g>
        <path d="M256 460 Q 268 470, 270 484 Q 262 478, 252 480 Z" fill="#c9a35f" stroke="#5e4519" strokeWidth="0.6" />
      </>}
      expressionLine={<path d="M190 296 Q 200 300, 210 296" stroke="#8a3a3a" strokeWidth="1.2" fill="none" />}
    />
  </PortraitFrame>
);

export const PortraitConfidant = (props: PortraitProps) => (
  <PortraitFrame label="The Confidant" bgGradient="plum-vignette" {...props}>
    <g opacity="0.35" filter="url(#brush-heavy)">
      <path d="M40 60 Q 80 160, 60 280 Q 100 360, 60 460" stroke="#8c6c2d" strokeWidth="3" fill="none" opacity="0.4" />
      <path d="M360 60 Q 320 160, 340 280 Q 300 360, 340 460" stroke="#8c6c2d" strokeWidth="3" fill="none" opacity="0.4" />
      <g fill="#8c6c2d" opacity="0.3">
        <circle cx="100" cy="160" r="8" />
        <circle cx="300" cy="200" r="6" />
        <circle cx="80" cy="280" r="6" />
        <circle cx="320" cy="320" r="8" />
      </g>
    </g>
    <HeadBlock
      skin="#c9956b" skinShade="#8a5a32"
      hairColor="#1a0f12"
      keyLight="#e9c47a"
      hairBack={<path d="M134 196 Q 116 256, 130 332 L 156 332 Q 142 268, 154 216 Z" fill="#1a0f12" />}
      hairFront={<>
        <path d="M148 200 Q 154 162, 200 158 Q 248 162, 254 198 Q 246 184, 226 188 Q 222 200, 212 200 Q 202 192, 200 192 Q 196 196, 188 200 Q 174 200, 158 196 Z" fill="#1a0f12" />
        <path d="M156 196 Q 174 184, 198 192" stroke="#3a2418" strokeWidth="1" fill="none" opacity="0.7" />
      </>}
      garment="#2b132e" garmentHi="#4a234e" garmentShadow="#1a0820"
      collar={<>
        <path d="M80 380 Q 130 326, 180 320 L 200 318 L 220 320 Q 270 326, 320 380 L 320 500 L 80 500 Z" fill="#2b132e" stroke="#1a0820" strokeWidth="1" />
        <path d="M120 360 Q 160 332, 200 326" stroke="#4a234e" strokeWidth="2" fill="none" opacity="0.7" />
        <circle cx="200" cy="330" r="6" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.6" />
      </>}
      jewelry={<>
        <circle cx="252" cy="278" r="3" fill="#f1d68d" />
        <line x1="252" y1="282" x2="252" y2="294" stroke="#c9a35f" strokeWidth="1" />
        <circle cx="252" cy="296" r="3.5" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.6" />
      </>}
      accent={<>
        <g transform="rotate(-20 200 460)">
          <rect x="160" y="430" width="80" height="10" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.8" />
          <g stroke="#5e4519" strokeWidth="0.4" fill="none">
            {[164, 172, 180, 188, 196, 204, 212, 220, 228, 236].map((x) => <line key={x} x1={x} y1="430" x2={x} y2="440" />)}
          </g>
          <circle cx="240" cy="435" r="3" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.6" />
        </g>
      </>}
      expressionLine={<path d="M188 296 Q 200 290, 212 296" stroke="#6e1f2e" strokeWidth="1.2" fill="none" />}
    />
  </PortraitFrame>
);

export const PortraitRival = (props: PortraitProps) => (
  <PortraitFrame label="The Rival" bgGradient="teal-vignette" {...props}>
    <g opacity="0.45" filter="url(#brush-heavy)">
      {[80, 130, 270, 320].map((x) => <rect key={x} x={x} y="80" width="22" height="380" fill="#2a565d" opacity="0.5" />)}
      <ellipse cx="200" cy="440" rx="220" ry="40" fill="#3a6f76" opacity="0.4" filter="url(#soft-glow)" />
    </g>
    <g filter="url(#brush-soft)">
      <path d="M70 500 L 70 360 Q 90 300, 150 280 L 180 200 Q 200 180, 220 200 L 250 280 Q 310 300, 330 360 L 330 500 Z" fill="#06081c" stroke="#0d1733" strokeWidth="1" />
      <path d="M158 220 Q 200 200, 242 220 L 256 280 Q 230 296, 200 298 Q 170 296, 144 280 Z" fill="#1a0820" />
      <path d="M180 280 Q 200 286, 220 280" stroke="#3a2418" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M185 274 Q 200 278, 215 274" stroke="#c9a35f" strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M90 380 Q 130 360, 160 380" stroke="#1a0820" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M240 380 Q 280 360, 310 380" stroke="#1a0820" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 380 L 240 410 Q 250 416, 246 426 L 220 444 Q 208 444, 198 432 Z" fill="#1a0820" stroke="#06081c" strokeWidth="1" />
      <rect x="216" y="394" width="56" height="36" fill="#1a0f12" stroke="#3a2418" strokeWidth="0.8" transform="rotate(18 244 412)" />
      <circle cx="252" cy="406" r="6" fill="url(#wax-red)" transform="rotate(18 252 406)" />
    </g>
  </PortraitFrame>
);

export const PortraitCeleste = (props: PortraitProps) => (
  <PortraitFrame label="Lady Celeste" bgGradient="teal-vignette" {...props}>
    <g opacity="0.55" filter="url(#brush-heavy)">
      <rect x="280" y="60" width="60" height="240" fill="#b8d4e0" opacity="0.5" />
      <line x1="310" y1="60" x2="310" y2="300" stroke="#e8d4ad" strokeWidth="2" opacity="0.7" />
      <line x1="280" y1="180" x2="340" y2="180" stroke="#e8d4ad" strokeWidth="2" opacity="0.7" />
    </g>
    <HeadBlock
      skin="#eed4b8" skinShade="#b8956e"
      hairColor="#8a6a4e"
      keyLight="#c8d8e8"
      hairBack={<path d="M132 196 Q 116 256, 134 332 L 158 332 Q 140 270, 154 218 Z" fill="#8a6a4e" />}
      hairFront={<>
        <path d="M146 198 Q 152 162, 200 156 Q 248 162, 254 198 Q 246 180, 228 184 Q 222 196, 212 196 Q 200 188, 200 188 Q 196 196, 188 200 Q 168 196, 158 196 Z" fill="#8a6a4e" />
        <path d="M148 198 Q 170 184, 200 188" stroke="#c9a578" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M204 188 Q 232 188, 252 198" stroke="#c9a578" strokeWidth="1.2" fill="none" opacity="0.7" />
        <g>
          <circle cx="158" cy="180" r="9" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.6" />
          <circle cx="158" cy="180" r="3" fill="#c9a578" />
          <circle cx="244" cy="184" r="8" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.6" />
          <circle cx="244" cy="184" r="2.5" fill="#c9a578" />
        </g>
      </>}
      garment="#c9c4d4" garmentHi="#e0dde6" garmentShadow="#7a7689"
      collar={<>
        <path d="M150 322 Q 200 314, 250 322 L 252 350 Q 200 342, 148 350 Z" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.8" />
        <g stroke="#b89c6e" strokeWidth="0.4" fill="none">
          <path d="M156 326 Q 162 330, 166 326 Q 170 330, 174 326 Q 178 330, 182 326" />
          <path d="M218 326 Q 222 330, 226 326 Q 230 330, 234 326 Q 238 330, 244 326" />
        </g>
        <circle cx="170" cy="354" r="3" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.4" />
        <circle cx="200" cy="362" r="3.5" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.4" />
        <circle cx="230" cy="354" r="3" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="0.4" />
      </>}
      accent={<>
        <rect x="156" y="396" width="88" height="64" fill="#5e2a2a" stroke="#3a1818" strokeWidth="1" />
        <rect x="160" y="400" width="80" height="56" fill="#8a3a3a" stroke="#3a1818" strokeWidth="0.6" />
        <line x1="200" y1="400" x2="200" y2="456" stroke="#3a1818" strokeWidth="0.8" />
        <text x="200" y="432" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="10" fill="#c9a35f">~ ~ ~</text>
        <ellipse cx="160" cy="442" rx="10" ry="14" fill="#eed4b8" stroke="#b8956e" strokeWidth="0.6" />
        <ellipse cx="240" cy="442" rx="10" ry="14" fill="#eed4b8" stroke="#b8956e" strokeWidth="0.6" />
      </>}
      faceDetail={<>
        <path d="M174 248 Q 180 246, 186 248" stroke="#1a0f12" strokeWidth="1.2" fill="none" />
        <path d="M214 248 Q 220 246, 226 248" stroke="#1a0f12" strokeWidth="1.2" fill="none" />
        <path d="M198 254 Q 200 270, 200 278 Q 198 282, 202 284" stroke="#b8956e" strokeWidth="0.6" fill="none" />
        <path d="M188 294 Q 200 300, 212 294" stroke="#a85055" strokeWidth="1.2" fill="none" />
      </>}
    />
  </PortraitFrame>
);

export const PortraitAureon = (props: PortraitProps) => (
  <PortraitFrame label="Lord Aureon" bgGradient="burgundy-vignette" {...props}>
    <g opacity="0.4" filter="url(#brush-heavy)">
      <circle cx="80" cy="180" r="36" fill="#c9a35f" opacity="0.4" />
      <circle cx="80" cy="180" r="24" fill="none" stroke="#5e4519" strokeWidth="2" opacity="0.7" />
      <rect x="300" y="200" width="40" height="180" fill="#5e4519" opacity="0.4" />
      <path d="M310 320 L 340 320 L 340 200 L 350 220" stroke="#5e4519" strokeWidth="3" fill="none" opacity="0.4" />
    </g>
    <HeadBlock
      skin="#d4a584" skinShade="#9a6e48"
      hairColor="#3a2418"
      keyLight="#e9c47a"
      hairBack={<path d="M132 196 Q 116 250, 134 320 L 158 322 Q 142 264, 152 216 Z" fill="#3a2418" />}
      hairFront={<>
        <path d="M146 196 Q 152 156, 200 152 Q 250 158, 256 198 Q 248 180, 232 184 Q 224 200, 218 204 Q 210 194, 198 192 Q 184 196, 174 204 Q 162 196, 158 200 Z" fill="#3a2418" />
        <circle cx="148" cy="200" r="6" fill="#3a2418" />
        <circle cx="254" cy="208" r="6" fill="#3a2418" />
        <path d="M152 196 Q 180 184, 210 192" stroke="#6e4a2a" strokeWidth="1.2" fill="none" opacity="0.6" />
      </>}
      garment="#8a2d3a" garmentHi="#c44a4a" garmentShadow="#441119"
      collar={<>
        <path d="M150 322 Q 200 314, 250 322 L 252 360 Q 200 348, 148 360 Z" fill="#c9a35f" stroke="#5e4519" strokeWidth="1" />
        <path d="M170 332 L 200 358 L 230 332" fill="#8a2d3a" stroke="#441119" strokeWidth="1" />
        <g stroke="#f1d68d" strokeWidth="1" fill="none" opacity="0.8">
          <path d="M152 330 Q 200 322, 248 330" />
        </g>
      </>}
      accent={<>
        <g transform="translate(140 432)">
          <path d="M0 0 L 30 0 L 28 20 Q 15 24, 2 20 Z" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="1" />
          <rect x="13" y="20" width="4" height="14" fill="#8c6c2d" />
          <ellipse cx="15" cy="36" rx="14" ry="3" fill="url(#gold-coin)" stroke="#5e4519" strokeWidth="0.8" />
          <ellipse cx="15" cy="4" rx="13" ry="2" fill="#6e1f2e" stroke="#3a0b13" strokeWidth="0.4" />
        </g>
        <path d="M260 430 Q 280 430, 282 450 Q 280 466, 268 470 Q 256 466, 256 452 Z" fill="#1a0f12" stroke="#3a2418" strokeWidth="0.6" />
      </>}
      faceDetail={<>
        <path d="M170 240 Q 184 232, 192 240" stroke="#1a0f12" strokeWidth="1.4" fill="none" />
        <path d="M214 240 Q 222 234, 230 240" stroke="#1a0f12" strokeWidth="1.4" fill="none" />
        <ellipse cx="180" cy="250" rx="3.5" ry="2" fill="#1a0f12" />
        <ellipse cx="220" cy="250" rx="3.5" ry="2" fill="#1a0f12" />
        <path d="M198 256 Q 200 272, 200 280 Q 198 282, 202 284" stroke="#9a6e48" strokeWidth="0.8" fill="none" />
        <path d="M186 296 Q 200 304, 218 292" stroke="#8a3a3a" strokeWidth="1.4" fill="none" />
      </>}
    />
  </PortraitFrame>
);

export const PortraitMira = (props: PortraitProps) => (
  <PortraitFrame label="Mira the Poet" bgGradient="plum-vignette" {...props}>
    <g opacity="0.5" filter="url(#brush-heavy)">
      <rect x="60" y="380" width="80" height="60" fill="#f3e7d0" opacity="0.6" />
      <line x1="60" y1="395" x2="140" y2="395" stroke="#5e4519" opacity="0.6" />
      <line x1="60" y1="410" x2="140" y2="410" stroke="#5e4519" opacity="0.6" />
      <circle cx="320" cy="120" r="14" fill="#e9c47a" opacity="0.7" filter="url(#soft-glow)" />
      <circle cx="320" cy="120" r="6" fill="#f1d68d" />
    </g>
    <HeadBlock
      skin="#c89674" skinShade="#8a5a40"
      hairColor="#1a0f12"
      keyLight="#e9c47a"
      hairBack={<path d="M120 200 Q 100 280, 128 360 L 156 348 Q 130 296, 142 220 Z" fill="#1a0f12" />}
      hairFront={<>
        <path d="M138 196 Q 144 152, 200 146 Q 256 152, 262 198 Q 270 230, 252 270 Q 248 230, 236 200 Q 224 200, 212 196 Q 200 188, 188 196 Q 174 198, 156 202 Q 146 210, 138 196 Z" fill="#1a0f12" />
        <path d="M150 220 Q 142 250, 156 280" stroke="#3a2418" strokeWidth="1" fill="none" />
        <path d="M254 218 Q 264 244, 256 272" stroke="#3a2418" strokeWidth="1" fill="none" />
        <path d="M148 200 Q 180 188, 210 194" stroke="#3a2418" strokeWidth="0.8" fill="none" opacity="0.8" />
      </>}
      garment="#5e4519" garmentHi="#8c6c2d" garmentShadow="#3a2418"
      collar={<>
        <path d="M120 340 Q 160 318, 200 318 Q 240 318, 280 340 L 320 380 L 320 500 L 80 500 L 80 380 Z" fill="#8a7349" stroke="#5e4519" strokeWidth="1" />
        <path d="M180 320 Q 200 326, 220 320 L 220 360 L 180 360 Z" fill="#3a2418" />
        <path d="M120 340 Q 180 332, 200 332" stroke="#b89c6e" strokeWidth="1.5" fill="none" opacity="0.6" />
      </>}
      jewelry={<>
        <circle cx="252" cy="282" r="4" fill="#c44a18" stroke="#5e4519" strokeWidth="0.6" />
        <circle cx="148" cy="282" r="4" fill="#c44a18" stroke="#5e4519" strokeWidth="0.6" />
      </>}
      accent={<>
        <rect x="120" y="420" width="160" height="60" fill="#f3e7d0" stroke="#b89c6e" strokeWidth="1" transform="rotate(-3 200 450)" />
        <g stroke="#1a0f12" strokeWidth="0.8" fill="none" opacity="0.7" transform="rotate(-3 200 450)">
          <line x1="132" y1="430" x2="266" y2="430" />
          <line x1="132" y1="440" x2="260" y2="440" />
          <line x1="132" y1="450" x2="240" y2="450" />
          <line x1="132" y1="460" x2="200" y2="460" />
        </g>
        <ellipse cx="148" cy="438" rx="10" ry="14" fill="#c89674" stroke="#8a5a40" strokeWidth="0.6" />
        <path d="M142 446 Q 154 442, 156 432" stroke="#3a2418" strokeWidth="2" fill="none" opacity="0.7" />
      </>}
      faceDetail={<>
        <ellipse cx="180" cy="248" rx="3.5" ry="2.5" fill="#1a0f12" />
        <ellipse cx="220" cy="248" rx="3.5" ry="2.5" fill="#1a0f12" />
        <path d="M172 242 Q 180 238, 188 242" stroke="#1a0f12" strokeWidth="1" fill="none" />
        <path d="M212 242 Q 220 238, 228 242" stroke="#1a0f12" strokeWidth="1" fill="none" />
        <path d="M198 256 Q 200 274, 200 280" stroke="#8a5a40" strokeWidth="0.8" fill="none" />
        <path d="M190 296 L 210 296" stroke="#8a3a3a" strokeWidth="1.4" fill="none" />
      </>}
    />
  </PortraitFrame>
);

export const PortraitHeir = (props: PortraitProps) => (
  <PortraitFrame label="The Masked Heir" bgGradient="plum-vignette" {...props}>
    <g opacity="0.5" filter="url(#brush-heavy)">
      {[100, 200, 300].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={80 + i * 20} r="20" fill="#e9c47a" opacity="0.45" filter="url(#soft-glow)" />
          <circle cx={x} cy={80 + i * 20} r="6" fill="#f1d68d" />
        </g>
      ))}
      <ellipse cx="200" cy="420" rx="200" ry="40" fill="#6b3a6f" opacity="0.3" filter="url(#soft-glow)" />
    </g>
    <HeadBlock
      skin="#e0c0a0" skinShade="#a8825e"
      hairColor="#1a0f12"
      keyLight="#c9a35f"
      hairBack={<path d="M132 196 Q 116 256, 134 332 L 158 332 Q 142 268, 154 216 Z" fill="#1a0f12" />}
      hairFront={<path d="M144 196 Q 152 156, 200 152 Q 248 156, 256 196 Q 248 178, 230 184 Q 222 198, 212 198 Q 200 188, 200 188 Q 196 196, 188 200 Q 170 196, 156 200 Z" fill="#1a0f12" />}
      garment="#3a5a6e"
      garmentHi="#6b8a96"
      garmentShadow="#1a2e3a"
      collar={<>
        <defs>
          <linearGradient id="iridescent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b3a6f" />
            <stop offset="50%" stopColor="#3a5a6e" />
            <stop offset="100%" stopColor="#3a6e5a" />
          </linearGradient>
        </defs>
        <path d="M150 322 Q 200 314, 250 322 L 254 358 Q 200 346, 146 358 Z" fill="url(#iridescent)" stroke="#5e4519" strokeWidth="0.8" />
        <path d="M152 326 Q 200 320, 248 326" stroke="#c9a35f" strokeWidth="1" fill="none" />
      </>}
      accent={<>
        <g transform="translate(248 420) rotate(18)">
          <path d="M-30 0 Q -26 -10, -10 -10 L 10 -10 Q 26 -10, 30 0 Q 30 10, 16 10 L -16 10 Q -30 10, -30 0 Z" fill="#1a0f12" stroke="#c9a35f" strokeWidth="1" />
          <ellipse cx="-12" cy="0" rx="5" ry="3" fill="#3a2418" />
          <ellipse cx="12" cy="0" rx="5" ry="3" fill="#3a2418" />
        </g>
        <ellipse cx="240" cy="430" rx="12" ry="14" fill="#e0c0a0" stroke="#a8825e" strokeWidth="0.6" />
      </>}
      faceDetail={<>
        <path d="M140 230 Q 200 210, 260 230 L 254 268 Q 234 280, 200 282 Q 166 280, 146 268 Z" fill="#f3e7d0" stroke="#5e4519" strokeWidth="1.5" filter="url(#brush-soft)" />
        <g stroke="#c9a35f" strokeWidth="1.2" fill="none">
          <path d="M148 250 Q 158 240, 170 244" />
          <path d="M230 244 Q 242 240, 252 250" />
          <path d="M200 218 Q 208 224, 200 234 Q 192 224, 200 218 Z" />
        </g>
        <ellipse cx="180" cy="250" rx="9" ry="5" fill="#1a0f12" />
        <ellipse cx="220" cy="250" rx="9" ry="5" fill="#1a0f12" />
        <circle cx="176" cy="248" r="1.2" fill="#f1d68d" />
        <circle cx="216" cy="248" r="1.2" fill="#f1d68d" />
        <path d="M198 274 Q 200 284, 202 286" stroke="#a8825e" strokeWidth="0.8" fill="none" />
        <path d="M188 298 Q 200 304, 212 298" stroke="#8a3a3a" strokeWidth="1.4" fill="none" />
      </>}
    />
  </PortraitFrame>
);

type FrameConfig = { label: string; bg: string };

const PORTRAIT_FRAME: Record<PortraitKey, FrameConfig> = {
  suitor:    { label: "The Suitor",      bg: "burgundy-vignette" },
  confidant: { label: "The Confidant",   bg: "plum-vignette" },
  rival:     { label: "The Rival",       bg: "teal-vignette" },
  celeste:   { label: "Lady Celeste",    bg: "teal-vignette" },
  aureon:    { label: "Lord Aureon",     bg: "burgundy-vignette" },
  mira:      { label: "Mira the Poet",   bg: "plum-vignette" },
  heir:      { label: "The Masked Heir", bg: "plum-vignette" },
};

const withAIArt = (key: PortraitKey, SvgFallback: ComponentType<PortraitProps>): ComponentType<PortraitProps> => {
  const Wrapped = (props: PortraitProps) => {
    const ai = portraitAssetUrl(key);
    if (!ai) return <SvgFallback {...props} />;
    const { label, bg } = PORTRAIT_FRAME[key];
    return (
      <PortraitFrame label={label} bgGradient={bg} {...props}>
        <image
          href={ai}
          x="18"
          y="18"
          width="364"
          height="464"
          preserveAspectRatio="xMidYMid slice"
        />
      </PortraitFrame>
    );
  };
  Wrapped.displayName = `Portrait_${key}`;
  return Wrapped;
};

export const PORTRAITS: Record<PortraitKey, ComponentType<PortraitProps>> = {
  suitor:    withAIArt("suitor",    PortraitSuitor),
  confidant: withAIArt("confidant", PortraitConfidant),
  rival:     withAIArt("rival",     PortraitRival),
  celeste:   withAIArt("celeste",   PortraitCeleste),
  aureon:    withAIArt("aureon",    PortraitAureon),
  mira:      withAIArt("mira",      PortraitMira),
  heir:      withAIArt("heir",      PortraitHeir),
};
