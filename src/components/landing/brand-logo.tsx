export function BrandLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(244,63,94,0.4)]"
        role="img"
        aria-label="Mayalu Logo"
      >
        <title>Mayalu Logo</title>
        <defs>
          <linearGradient id="mayalu-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>

        {/* Outer squircle base matching Trakt's geometric signature */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="#121316"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Ambient subtle back glow inside card */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="11"
          fill="url(#mayalu-glow)"
          opacity="0.15"
        />

        {/* Graph Nodes and Connections forming the iconic interlocking M Heart */}
        <g
          stroke="url(#mayalu-glow)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left arc of heart */}
          <path d="M12 24 C 12 16, 20 14, 24 20" />
          {/* Right arc of heart */}
          <path d="M36 24 C 36 16, 28 14, 24 20" />
          {/* Bottom convergence */}
          <path d="M12 24 C 12 30, 24 38, 24 38 C 24 38, 36 30, 36 24" />
          {/* Central graph bridge */}
          <line
            x1="18"
            y1="20"
            x2="30"
            y2="20"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </g>

        {/* Graph Relationship Nodes (Neo4j connection points) */}
        <circle cx="12" cy="24" r="3" fill="#FB7185" />
        <circle cx="36" cy="24" r="3" fill="#A855F7" />
        <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" />
        <circle cx="24" cy="38" r="2.5" fill="#F43F5E" />
      </svg>
    </div>
  );
}
