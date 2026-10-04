"use client";

import { useGSAP } from "@gsap/react";
import {
  AnimatePresence,
  type Variants,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

interface SpotlightProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  role: string;
  mode: "dating" | "matrimonial";
  matchRate: number;
  bio: string;
  sharedInterests: string[];
  initials: string;
  auraGradient: string;
  glowColor: string;
  eyebrow: string;
  verified: boolean;
}

const SPOTLIGHT_PROFILES: SpotlightProfile[] = [
  {
    id: "p1",
    name: "Aayusha Shrestha",
    age: 26,
    location: "Kathmandu & Remote",
    role: "Architect & Analog Photographer",
    mode: "dating",
    matchRate: 98,
    bio: "Spontaneous mountain cafe hunts, vinyl records, and hiking trails around Shivapuri.",
    sharedInterests: ["🏔️ Himalayan Treks", "☕ Pour-overs", "🎸 Oasis Band"],
    initials: "AS",
    auraGradient: "from-rose-500 via-pink-600 to-amber-500",
    glowColor: "rgba(244, 63, 94, 0.28)",
    eyebrow: "TRENDING MATCH · HIGH CHEMISTRY",
    verified: true,
  },
  {
    id: "p2",
    name: "Prashant Thapa",
    age: 27,
    location: "Lalitpur, Nepal",
    role: "AI Engineer & Rock Climber",
    mode: "dating",
    matchRate: 94,
    bio: "Training for bouldering competitions, experimenting with local micro-roasteries, and tech.",
    sharedInterests: [
      "🧗 Rock Climbing",
      "🤖 Tech & AI",
      "☕ Specialty Coffee",
    ],
    initials: "PT",
    auraGradient: "from-violet-600 via-indigo-600 to-cyan-600",
    glowColor: "rgba(139, 92, 246, 0.28)",
    eyebrow: "TRENDING MATCH · MUTUAL PASSIONS",
    verified: true,
  },
  {
    id: "p3",
    name: "Dr. Rohan Adhikari",
    age: 29,
    location: "Pokhara / Lalitpur",
    role: "Cardiologist & Classical Musician",
    mode: "matrimonial",
    matchRate: 96,
    bio: "Passionate about medicine, family traditions, and tranquil weekends by Phewa Lake.",
    sharedInterests: [
      "🏛️ Family Heritage",
      "🎵 Classical Sitar",
      "✨ 34/36 Gunas",
    ],
    initials: "RA",
    auraGradient: "from-amber-500 via-orange-600 to-emerald-700",
    glowColor: "rgba(245, 158, 11, 0.28)",
    eyebrow: "MATRIMONIAL SPOTLIGHT · LIFELONG PARTNER",
    verified: true,
  },
  {
    id: "p4",
    name: "Smarika Manandhar",
    age: 24,
    location: "Jhamsikhel, Lalitpur",
    role: "Indie Filmmaker & Barista",
    mode: "dating",
    matchRate: 97,
    bio: "Looking for good chai, deep late-night conversations, and live indie concerts.",
    sharedInterests: ["🎥 Arri 35mm", "☕ Chemex Brews", "🎵 Acoustic Nights"],
    initials: "SM",
    auraGradient: "from-fuchsia-600 via-rose-600 to-indigo-800",
    glowColor: "rgba(217, 70, 239, 0.28)",
    eyebrow: "TRENDING MATCH · HIGH SPARK INDEX",
    verified: true,
  },
];

export function HeroSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeProfile = SPOTLIGHT_PROFILES[currentIndex];

  // Drag motion values for swipe physics
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-220, 220], [-18, 18]);
  const opacityLike = useTransform(dragX, [20, 90], [0, 1]);
  const opacityPass = useTransform(dragX, [-20, -90], [0, 1]);

  // GSAP Entrance Timeline for Left Hero Content
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-chip", {
        y: -25,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-title-line",
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.5",
        )
        .from(
          ".hero-subtitle",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          ".hero-cta",
          {
            scale: 0.92,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.4",
        )
        .from(
          ".hero-stat-item",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.3",
        )
        .set(
          [
            ".hero-chip",
            ".hero-title-line",
            ".hero-subtitle",
            ".hero-cta",
            ".hero-stat-item",
          ],
          { clearProps: "opacity,transform" },
        );
    },
    { scope: containerRef },
  );

  const paginate = (newDirection: number, feedbackAction?: string) => {
    setDirection(newDirection);
    if (feedbackAction) {
      setSwipeFeedback(feedbackAction);
      setTimeout(() => setSwipeFeedback(null), 900);
    }
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return (prev + 1) % SPOTLIGHT_PROFILES.length;
      }
      return (prev - 1 + SPOTLIGHT_PROFILES.length) % SPOTLIGHT_PROFILES.length;
    });
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (info.offset.x > 60 || info.velocity.x > 400) {
      paginate(1, "Liked! 💖");
    } else if (info.offset.x < -60 || info.velocity.x < -400) {
      paginate(1, "Passed ✕");
    }
  };

  // Profiles in the cascading stack behind
  const nextProfile =
    SPOTLIGHT_PROFILES[(currentIndex + 1) % SPOTLIGHT_PROFILES.length];
  const next2Profile =
    SPOTLIGHT_PROFILES[(currentIndex + 2) % SPOTLIGHT_PROFILES.length];

  const cardVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      rotate: dir > 0 ? 6 : -6,
      scale: 0.94,
      opacity: 0,
    }),
    center: {
      x: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 320,
        damping: 26,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -180 : 180,
      rotate: dir > 0 ? -14 : 14,
      scale: 0.88,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeIn" as const,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      id="spotlight"
      className="relative overflow-hidden py-16 sm:py-24 md:py-28"
    >
      {/* Dynamic ambient backdrop illumination matching active card's aura */}
      <div
        className="pointer-events-none absolute top-1/2 right-[10%] -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[140px] -z-10 transition-all duration-700"
        style={{ backgroundColor: activeProfile.glowColor }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Brand Story & High-Impact Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="hero-chip inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-500 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>Neo4j Relationship Graph · Nepal Edition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
              <span className="hero-title-line block">
                Your true match isn’t
              </span>
              <span className="hero-title-line block">a roll of the dice.</span>
              <span className="hero-title-line block bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                It’s connected.
              </span>
            </h1>

            <p className="hero-subtitle text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Mayalu blends high-dimensional graph intelligence with modern
              dual-intent matchmaking. Move past superficial swiping to discover
              deep lifestyle chemistry and family alignment.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-8 py-6 text-base font-bold text-white shadow-xl shadow-rose-500/30 hover:shadow-rose-500/45 hover:scale-105 active:scale-95 transition-all"
                >
                  Start Discovery Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>

              <a href="#graph-match" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-border/80 px-7 py-6 text-base font-semibold hover:bg-muted/60 transition-colors"
                >
                  Explore Graph Match
                </Button>
              </a>
            </div>

            {/* Trakt-style Platform Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60 max-w-lg mx-auto lg:mx-0">
              <div className="hero-stat-item">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  100%
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Verified Nepali Profiles
                </p>
              </div>
              <div className="hero-stat-item">
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-500 tracking-tight">
                  96.4%
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Graph Affinity Rate
                </p>
              </div>
              <div className="hero-stat-item">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight">
                  2 Modes
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Dating & Matrimony
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Trakt-Style 3D Cascading Poster Deck with Swipe */}
          <section
            aria-label="Interactive Trakt-style spotlight carousel"
            className="lg:col-span-5 flex flex-col items-center select-none"
          >
            {/* The 3D Fan-out Card Deck Container */}
            <div className="relative w-[300px] sm:w-[330px] h-[430px] sm:h-[460px] perspective-1200 flex items-center justify-center">
              {/* Card 3: Deepest fanned card */}
              <button
                type="button"
                aria-label={`View ${next2Profile.name}`}
                onClick={() => paginate(1)}
                className="absolute inset-0 rounded-[28px] border border-white/10 shadow-xl overflow-hidden cursor-pointer transition-transform duration-500 text-left p-0"
                style={{
                  transform:
                    "translateX(72px) translateY(24px) rotate(14deg) scale(0.86)",
                  zIndex: 10,
                  opacity: 0.45,
                }}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${next2Profile.auraGradient} p-5 flex flex-col justify-between text-white relative`}
                >
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase bg-black/40 px-2 py-0.5 rounded-full">
                      {next2Profile.mode}
                    </span>
                    <span className="text-[10px] font-bold">
                      {next2Profile.matchRate}%
                    </span>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 mx-auto flex items-center justify-center text-xl font-black">
                      {next2Profile.initials}
                    </div>
                  </div>
                  <div className="relative z-10 text-center">
                    <p className="font-extrabold text-sm text-white">
                      {next2Profile.name}
                    </p>
                  </div>
                </div>
              </button>

              {/* Card 2: Intermediate fanned card */}
              <button
                type="button"
                aria-label={`View ${nextProfile.name}`}
                onClick={() => paginate(1)}
                className="absolute inset-0 rounded-[28px] border border-white/15 shadow-2xl overflow-hidden cursor-pointer transition-transform duration-500 text-left p-0"
                style={{
                  transform:
                    "translateX(38px) translateY(12px) rotate(7deg) scale(0.93)",
                  zIndex: 20,
                  opacity: 0.78,
                }}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${nextProfile.auraGradient} p-6 flex flex-col justify-between text-white relative`}
                >
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                      {nextProfile.mode === "dating"
                        ? "💖 Dating"
                        : "💍 Matrimonial"}
                    </span>
                    <span className="text-[11px] font-extrabold bg-emerald-500/30 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                      {nextProfile.matchRate}%
                    </span>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-2xl font-black shadow-lg">
                      {nextProfile.initials}
                    </div>
                  </div>
                  <div className="relative z-10 text-center space-y-0.5">
                    <p className="font-extrabold text-base text-white">
                      {nextProfile.name}, {nextProfile.age}
                    </p>
                    <p className="text-[11px] text-white/80">
                      {nextProfile.location}
                    </p>
                  </div>
                </div>
              </button>

              {/* Card 1: Front Active Poster (Trakt-Style Full-Bleed Showcase) */}
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.div
                  key={activeProfile.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={handleDragEnd}
                  style={{ x: dragX, rotate: dragRotate, zIndex: 30 }}
                  className="absolute inset-0 w-full h-full rounded-[28px] border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-xl"
                >
                  {/* Poster Graphic Background Canvas */}
                  <div
                    className={`w-full h-full bg-gradient-to-br ${activeProfile.auraGradient} p-6 sm:p-7 flex flex-col justify-between text-white relative overflow-hidden`}
                  >
                    {/* Atmospheric Glow Circles inside Poster */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/25 rounded-full blur-2xl pointer-events-none" />

                    {/* Drag Like / Pass Feedback Stamps */}
                    <motion.div
                      style={{ opacity: opacityLike }}
                      className="absolute top-6 right-6 z-40 border-3 border-emerald-400 text-emerald-300 bg-black/40 backdrop-blur-md text-xs font-black px-3.5 py-1 rounded-xl rotate-12 shadow-lg pointer-events-none"
                    >
                      LIKE 💖
                    </motion.div>
                    <motion.div
                      style={{ opacity: opacityPass }}
                      className="absolute top-6 left-6 z-40 border-3 border-rose-400 text-rose-300 bg-black/40 backdrop-blur-md text-xs font-black px-3.5 py-1 rounded-xl -rotate-12 shadow-lg pointer-events-none"
                    >
                      PASS ✕
                    </motion.div>

                    {/* Instant Swipe Feedback Stamp */}
                    {swipeFeedback && (
                      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-white px-5 py-2.5 rounded-2xl bg-white/15 border border-white/30 shadow-2xl animate-bounce">
                          {swipeFeedback}
                        </span>
                      </div>
                    )}

                    {/* Top Row: Mode Badge + Neo4j Score Pill */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/35 backdrop-blur-md border border-white/25 text-white shadow-xs">
                        {activeProfile.mode === "dating"
                          ? "💖 Dating Mode"
                          : "💍 Matrimonial"}
                      </span>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/30 backdrop-blur-md border border-emerald-400/50 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                        {activeProfile.matchRate}% Match
                      </span>
                    </div>

                    {/* Middle Poster Emblem: Artistic Avatar Monogram */}
                    <div className="relative z-10 flex flex-col items-center my-auto">
                      <div className="relative">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
                          {activeProfile.initials}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-white/95 font-medium italic text-center max-w-[240px] drop-shadow-sm">
                        "{activeProfile.bio}"
                      </p>
                    </div>

                    {/* Bottom of Poster: Frosted Glass Shared Interest Tags */}
                    <div className="relative z-10 pt-3 border-t border-white/20">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {activeProfile.sharedInterests.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-black/35 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Trakt-Style Metadata Below Poster */}
            <div className="mt-8 text-center space-y-1.5 max-w-sm">
              {/* Category Eyebrow */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`eyebrow-${activeProfile.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="block text-[11px] font-extrabold uppercase tracking-widest text-rose-500 dark:text-rose-400"
                >
                  {activeProfile.eyebrow}
                </motion.span>
              </AnimatePresence>

              {/* Bold Title */}
              <AnimatePresence mode="wait">
                <motion.h3
                  key={`title-${activeProfile.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center justify-center gap-1.5"
                >
                  {activeProfile.name}, {activeProfile.age}
                  {activeProfile.verified && (
                    <ShieldCheck className="w-5 h-5 text-sky-500 inline-block" />
                  )}
                </motion.h3>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`subtitle-${activeProfile.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center justify-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {activeProfile.location} · {activeProfile.role}
                </motion.p>
              </AnimatePresence>

              {/* Trakt Segmented Horizontal Pagination Indicator */}
              <div className="pt-3 flex items-center justify-center gap-2">
                {SPOTLIGHT_PROFILES.map((profile, idx) => (
                  <button
                    type="button"
                    key={profile.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? "w-10 bg-gradient-to-r from-rose-500 to-violet-500 shadow-sm shadow-rose-500/50"
                        : "w-6 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to ${profile.name}`}
                  />
                ))}
              </div>

              {/* Trakt Carousel Quick Actions (Prev / Pass / Super Like / Like / Next) */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous Profile"
                  className="w-9 h-9 rounded-full border border-border/80 bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => paginate(1, "Passed ✕")}
                  aria-label="Pass"
                  className="w-11 h-11 rounded-full border border-border/80 bg-card hover:bg-muted/80 flex items-center justify-center text-rose-500 hover:text-rose-600 transition-all hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => paginate(1, "Super Liked! ⭐")}
                  aria-label="Super Like"
                  className="w-11 h-11 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-500 transition-all hover:scale-110 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  <Star className="w-5 h-5 fill-amber-500" />
                </button>

                <button
                  type="button"
                  onClick={() => paginate(1, "Liked! 💖")}
                  aria-label="Like"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-rose-500/35 cursor-pointer"
                >
                  <Heart className="w-6 h-6 fill-white" />
                </button>

                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next Profile"
                  className="w-9 h-9 rounded-full border border-border/80 bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground/70 italic pt-1">
                Drag card left or right to swipe · Click background card to
                cycle
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
