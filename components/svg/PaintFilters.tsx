/**
 * Shared SVG <defs> — painterly filters, gradients, textures.
 * Mount once in app/layout.tsx. Every SVG asset references these by id.
 */

export const PaintFilters = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.018" numOctaves="2" seed="3" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="brush-heavy" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.025" numOctaves="3" seed="7" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="brush-soft" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="0.3" />
      </filter>

      <filter id="canvas">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="1" />
        <feColorMatrix values="0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.65 0 0 0 0.18 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>

      <filter id="candle-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feColorMatrix in="b" values="1 0 0 0 0.1 0 1 0 0 0.05 0 0 1 0 -0.1 0 0 0 1.4 0" result="warm"/>
        <feMerge>
          <feMergeNode in="warm" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" />
      </filter>

      <filter id="inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="1" />
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>

      <linearGradient id="gold-leaf" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f1d68d" />
        <stop offset="35%" stopColor="#e9c47a" />
        <stop offset="55%" stopColor="#c9a35f" />
        <stop offset="80%" stopColor="#8c6c2d" />
        <stop offset="100%" stopColor="#5e4519" />
      </linearGradient>

      <linearGradient id="gold-leaf-h" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8c6c2d" />
        <stop offset="50%" stopColor="#f1d68d" />
        <stop offset="100%" stopColor="#8c6c2d" />
      </linearGradient>

      <radialGradient id="gold-coin" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f7e2a8" />
        <stop offset="40%" stopColor="#e9c47a" />
        <stop offset="75%" stopColor="#c9a35f" />
        <stop offset="100%" stopColor="#6e5320" />
      </radialGradient>

      <radialGradient id="gold-coin-bronze" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#d9a25e" />
        <stop offset="50%" stopColor="#9c6a2c" />
        <stop offset="100%" stopColor="#4e2f10" />
      </radialGradient>

      <radialGradient id="candle-vignette" cx="50%" cy="55%" r="65%">
        <stop offset="0%" stopColor="#3a2418" stopOpacity="0" />
        <stop offset="60%" stopColor="#0e1326" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#060b1c" stopOpacity="0.95" />
      </radialGradient>

      <radialGradient id="teal-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#2a565d" stopOpacity="0" />
        <stop offset="100%" stopColor="#0e2329" stopOpacity="0.9" />
      </radialGradient>

      <radialGradient id="plum-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#4a234e" stopOpacity="0" />
        <stop offset="100%" stopColor="#1a0820" stopOpacity="0.9" />
      </radialGradient>

      <radialGradient id="burgundy-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#8a2d3a" stopOpacity="0" />
        <stop offset="100%" stopColor="#2a0810" stopOpacity="0.9" />
      </radialGradient>

      <radialGradient id="wax-red" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#c44a4a" />
        <stop offset="60%" stopColor="#6e1f2e" />
        <stop offset="100%" stopColor="#3a0b13" />
      </radialGradient>

      <linearGradient id="parchment" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f3e7d0" />
        <stop offset="100%" stopColor="#c9b48a" />
      </linearGradient>

      <radialGradient id="midnight-coin" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#1a2750" />
        <stop offset="65%" stopColor="#0d1733" />
        <stop offset="100%" stopColor="#03061a" />
      </radialGradient>

      <pattern id="hatching" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeWidth="0.8" strokeOpacity="0.18" />
      </pattern>

      <pattern id="cross-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#000" strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="0" y1="0" x2="8" y2="0" stroke="#000" strokeWidth="0.5" strokeOpacity="0.12" />
      </pattern>
    </defs>
  </svg>
);
