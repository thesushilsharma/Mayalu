"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Beautiful fluttering butterfly SVG component
export function ButterflyIcon({
  className = "w-6 h-6",
  color = "url(#butterfly-rainbow)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="butterfly-rainbow"
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
        <linearGradient id="butterfly-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Butterfly Body */}
      <ellipse cx="24" cy="24" rx="1.75" ry="9" fill="#E11D48" opacity="0.9" />

      {/* Antennae */}
      <path
        d="M23 15 C 22 10, 18 8, 16 9 M25 15 C 26 10, 30 8, 32 9"
        stroke="#E11D48"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="1.2" fill="#E11D48" />
      <circle cx="32" cy="9" r="1.2" fill="#E11D48" />

      {/* Upper Wings */}
      <path
        d="M23 20 C 18 10, 6 12, 5 22 C 4 29, 16 30, 23 24 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M25 20 C 30 10, 42 12, 43 22 C 44 29, 32 30, 25 24 Z"
        fill={color}
        opacity="0.85"
      />

      {/* Wing Inner Details / Veins */}
      <path
        d="M23 20 C 15 16, 10 20, 8 23 M25 20 C 33 16, 38 20, 40 23"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Lower Wings */}
      <path
        d="M23 24 C 17 28, 8 30, 10 38 C 12 43, 21 38, 23 27 Z"
        fill={color}
        opacity="0.75"
      />
      <path
        d="M25 24 C 31 28, 40 30, 38 38 C 36 43, 27 38, 25 27 Z"
        fill={color}
        opacity="0.75"
      />
    </svg>
  );
}

export function CloudAtmosphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* 9TH CLOUD LAYER 1: Celestial Rose & Morning Blush Orb */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] left-[5%] w-[680px] h-[680px] rounded-full bg-gradient-to-br from-rose-500/18 via-pink-400/12 to-transparent blur-[140px] dark:from-rose-600/20 dark:via-purple-900/15"
      />

      {/* 9TH CLOUD LAYER 2: Ethereal Lavender & Twilight Cloud Mist */}
      <motion.div
        animate={{
          x: [0, -50, 35, 0],
          y: [0, 45, -30, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{
          duration: 28,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-[35%] -right-[10%] w-[720px] h-[720px] rounded-full bg-gradient-to-bl from-violet-500/16 via-purple-400/10 to-transparent blur-[150px] dark:from-violet-600/22 dark:via-indigo-950/20"
      />

      {/* 9TH CLOUD LAYER 3: Golden Sunrise Sunset & Champagne Warmth */}
      <motion.div
        animate={{
          x: [0, 35, -45, 0],
          y: [0, -25, 40, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 24,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-400/12 via-rose-400/10 to-transparent blur-[130px] dark:from-rose-500/15 dark:via-amber-500/10"
      />

      {/* 9TH CLOUD LAYER 4: Deep Celestial Nebula (Footer & Bottom) */}
      <div className="absolute -bottom-[20%] right-[20%] w-[800px] h-[600px] rounded-full bg-gradient-to-t from-pink-500/15 via-purple-600/10 to-transparent blur-[160px] dark:from-purple-900/25 dark:via-rose-950/20" />

      {/* FLOATING BUTTERFLY 1: Top Left drifting towards center */}
      <motion.div
        initial={{ x: "-10vw", y: "15vh", opacity: 0 }}
        animate={{
          x: ["0vw", "25vw", "18vw", "35vw", "50vw", "75vw"],
          y: ["15vh", "22vh", "12vh", "28vh", "18vh", "25vh"],
          opacity: [0, 0.7, 0.85, 0.6, 0.75, 0],
        }}
        transition={{
          duration: 36,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-0 left-0"
      >
        <div className="butterfly-flutter">
          <ButterflyIcon className="w-9 h-9 drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)] rotate-12" />
        </div>
      </motion.div>

      {/* FLOATING BUTTERFLY 2: Mid-screen drifting right to left */}
      <motion.div
        initial={{ x: "95vw", y: "45vh", opacity: 0 }}
        animate={{
          x: ["95vw", "70vw", "55vw", "40vw", "20vw", "-5vw"],
          y: ["45vh", "38vh", "50vh", "42vh", "48vh", "40vh"],
          opacity: [0, 0.6, 0.75, 0.5, 0.7, 0],
        }}
        transition={{
          duration: 42,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: 8,
        }}
        className="absolute top-0 left-0"
      >
        <div className="butterfly-flutter-reverse">
          <ButterflyIcon
            className="w-7 h-7 drop-shadow-[0_4px_10px_rgba(168,85,247,0.4)] -rotate-12"
            color="url(#butterfly-rainbow)"
          />
        </div>
      </motion.div>

      {/* FLOATING BUTTERFLY 3: Playful ascending butterfly near hero spotlight */}
      <motion.div
        animate={{
          x: [0, 15, -12, 18, 0],
          y: [0, -22, -10, -32, 0],
          rotate: [8, 18, -4, 14, 8],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-[28%] right-[8%] hidden xl:block opacity-65 hover:opacity-100 transition-opacity"
      >
        <div className="butterfly-flutter">
          <ButterflyIcon
            className="w-8 h-8 drop-shadow-[0_4px_14px_rgba(251,113,133,0.5)]"
            color="url(#butterfly-gold)"
          />
        </div>
      </motion.div>

      {/* FLOATING BUTTERFLY 4: Lower section gentle flutter */}
      <motion.div
        animate={{
          x: [0, -20, 15, -10, 0],
          y: [0, 18, -15, 22, 0],
          rotate: [-10, 5, -15, 8, -10],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-[30%] left-[8%] hidden lg:block opacity-60 hover:opacity-100 transition-opacity"
      >
        <div className="butterfly-flutter">
          <ButterflyIcon
            className="w-7 h-7 drop-shadow-[0_4px_12px_rgba(244,63,94,0.45)]"
            color="url(#butterfly-rainbow)"
          />
        </div>
      </motion.div>

      {/* STARDUST SPARKLES DRIFTING UPWARD */}
      <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] dark:bg-[radial-gradient(#fb7185_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.14] dark:opacity-[0.18]" />
    </div>
  );
}
