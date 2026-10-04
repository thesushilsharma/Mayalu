export function BrandLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(244,63,94,0.38)] transition-transform duration-300 group-hover:scale-105 active:scale-95"
        role="img"
        aria-label="Mayalu Logo - Heart, Butterfly & Graph Intelligence Monogram"
      >
        <title>Mayalu - Love Connected</title>
        <defs>
          {/* Main Butterfly & Heart Iridescent Brand Gradient */}
          <linearGradient
            id="mayalu-brand-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="35%" stopColor="#F43F5E" />
            <stop offset="70%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Golden Starlight Accent Gradient */}
          <linearGradient
            id="mayalu-starlight"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>

          {/* Subtle Glass Rim Reflection */}
          <linearGradient
            id="mayalu-glass-rim"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="40%" stopColor="rgba(244, 63, 94, 0.35)" />
            <stop offset="100%" stopColor="rgba(192, 132, 252, 0.4)" />
          </linearGradient>

          {/* Internal Cloud Nine Ambient Radial Aura */}
          <radialGradient id="mayalu-cloud-aura" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#A855F7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#121316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Frosted Squircle Shield Base */}
        <rect
          x="2.5"
          y="2.5"
          width="43"
          height="43"
          rx="13.5"
          fill="#0F1015"
          stroke="url(#mayalu-glass-rim)"
          strokeWidth="1.5"
        />

        {/* 2. Soft Cloud Nine Radial Glow inside Squircle */}
        <rect
          x="3.25"
          y="3.25"
          width="41.5"
          height="41.5"
          rx="12.75"
          fill="url(#mayalu-cloud-aura)"
        />

        {/* 3. Subtle Ambient Constellation Sparkles */}
        <circle cx="10" cy="11" r="0.75" fill="#FFFFFF" opacity="0.6" />
        <circle cx="38" cy="37" r="0.75" fill="#C084FC" opacity="0.6" />

        {/* 4. Delicate Butterfly Antennae with Starlight Tips */}
        <path
          d="M22.5 15.5 C 20.5 11.5, 17 9.5, 14 10.5"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="10.5" r="1.2" fill="url(#mayalu-starlight)" />

        <path
          d="M25.5 15.5 C 27.5 11.5, 31 9.5, 34 10.5"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="34" cy="10.5" r="1.2" fill="url(#mayalu-starlight)" />

        {/* 5. Butterfly Upper Wings / Heart 'M' Arches */}
        {/* Left Upper Wing */}
        <path
          d="M24 19 C 20 12, 11 12, 8.5 19 C 6.5 24.5, 11 31, 15 34 C 18 36, 21.5 38.5, 24 40.5"
          fill="url(#mayalu-brand-gradient)"
          fillOpacity="0.22"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Upper Wing */}
        <path
          d="M24 19 C 28 12, 37 12, 39.5 19 C 41.5 24.5, 37 31, 33 34 C 30 36, 26.5 38.5, 24 40.5"
          fill="url(#mayalu-brand-gradient)"
          fillOpacity="0.22"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Inner Butterfly Wings / 'M' Monogram Inner Fold */}
        <path
          d="M17 19.5 C 13.5 22, 12 26.5, 14.5 30 C 17 33, 21 34, 24 33"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M31 19.5 C 34.5 22, 36 26.5, 33.5 30 C 31 33, 27 34, 24 33"
          stroke="url(#mayalu-brand-gradient)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 7. Neo4j Graph Relationship Filaments (Connecting Nodes) */}
        <g
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 2"
        >
          {/* Bridge between left wing and right wing */}
          <line x1="13.5" y1="17.5" x2="24" y2="23.5" />
          <line x1="34.5" y1="17.5" x2="24" y2="23.5" />
          {/* Vertical axis line down to heart tip */}
          <line x1="24" y1="23.5" x2="24" y2="39.5" />
        </g>

        {/* 8. Graph Relationship Constellation Nodes (Neo4j Connection Points) */}
        {/* Left Wing Peak Node */}
        <circle cx="13.5" cy="17.5" r="2.5" fill="#FB7185" />
        <circle cx="13.5" cy="17.5" r="1.1" fill="#FFFFFF" />

        {/* Right Wing Peak Node */}
        <circle cx="34.5" cy="17.5" r="2.5" fill="#C084FC" />
        <circle cx="34.5" cy="17.5" r="1.1" fill="#FFFFFF" />

        {/* Central Heart Core Node (Spark of Connection) */}
        <circle cx="24" cy="23.5" r="3.2" fill="#FFFFFF" />
        <circle cx="24" cy="23.5" r="1.6" fill="#F43F5E" />

        {/* Left Wing Lower Flank Node */}
        <circle cx="11.5" cy="27" r="1.8" fill="#F43F5E" />
        <circle cx="11.5" cy="27" r="0.8" fill="#FFFFFF" />

        {/* Right Wing Lower Flank Node */}
        <circle cx="36.5" cy="27" r="1.8" fill="#818CF8" />
        <circle cx="36.5" cy="27" r="0.8" fill="#FFFFFF" />

        {/* Bottom Heart Anchor Node (Lifelong Matrimonial Foundation) */}
        <circle cx="24" cy="40.5" r="2.4" fill="#F43F5E" />
        <circle cx="24" cy="40.5" r="1" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
