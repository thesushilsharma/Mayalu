"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Flame,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/badge";
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
  graphPoints: string[];
  avatarGradient: string;
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
    bio: "Spontaneous mountain cafe hunts, vinyl records, and hiking trails around Shivapuri. Looking for someone with genuine curiosity.",
    sharedInterests: [
      "Himalayan Treks",
      "Specialty Coffee",
      "Indie Cinema",
      "Architecture",
    ],
    graphPoints: [
      "Both love 35mm film",
      "Shared favorite band",
      "Weekend trekker",
    ],
    avatarGradient: "from-rose-500 via-pink-600 to-indigo-700",
    verified: true,
  },
  {
    id: "p2",
    name: "Dr. Rohan Adhikari",
    age: 29,
    location: "Pokhara / Lalitpur",
    role: "Cardiologist & Classical Guitarist",
    mode: "matrimonial",
    matchRate: 95,
    bio: "Passionate about medicine, family traditions, and tranquil weekends by Phewa Lake. Seeking a life partner with shared core values and kindness.",
    sharedInterests: [
      "Family Values",
      "Classical Music",
      "Healthcare",
      "Mindful Living",
    ],
    graphPoints: [
      "Astrological Match 32/36",
      "Shared Family Heritage",
      "Doctorate Degree",
    ],
    avatarGradient: "from-amber-500 via-orange-600 to-rose-700",
    verified: true,
  },
  {
    id: "p3",
    name: "Prashant Thapa",
    age: 27,
    location: "Lalitpur, Nepal",
    role: "AI Engineer & Rock Climber",
    mode: "dating",
    matchRate: 93,
    bio: "Training for bouldering competitions, experimenting with local micro-roasteries, and exploring late-night deep tech podcasts.",
    sharedInterests: [
      "Rock Climbing",
      "Tech & AI",
      "Specialty Coffee",
      "Podcast Binging",
    ],
    graphPoints: [
      "Mutual friends in tech",
      "Climbing gym regular",
      "Night owl energy",
    ],
    avatarGradient: "from-violet-600 via-purple-700 to-blue-800",
    verified: true,
  },
];

export function HeroSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);

  const activeProfile = SPOTLIGHT_PROFILES[currentIndex];

  const handleNext = (action: string) => {
    setSwipeFeedback(action);
    setTimeout(() => {
      setSwipeFeedback(null);
      setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_PROFILES.length);
    }, 300);
  };

  return (
    <section
      id="spotlight"
      className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24"
    >
      {/* Trakt-style ambient backdrop light */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-rose-500/15 via-purple-500/15 to-amber-500/10 blur-[130px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Evocative Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trakt-style Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-medium text-rose-500 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Neo4j Graph Relationship Intelligence</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80">
                Free on Web, iOS & Android
              </span>
            </div>

            {/* Trakt-styled Massive Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Your true match isn’t a roll of the dice.{" "}
              <span className="block mt-1 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                It’s connected.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Mayalu maps mutual passions, life values, and relationship intent
              using graph databases. Toggle effortlessly between high-energy{" "}
              <strong>Dating Mode</strong> and lifelong{" "}
              <strong>Matrimonial Mode</strong>, earning XP as your journey
              unfolds.
            </p>

            {/* Call to actions cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-6 text-base font-semibold text-white shadow-xl shadow-rose-500/25 transition-all duration-300 hover:shadow-rose-500/40 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Find Your Match Free
                </Button>
              </Link>

              <a href="#dual-modes" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-border/80 bg-background/50 backdrop-blur-md px-6 py-6 text-base font-medium hover:bg-muted/80 transition-all"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4 text-amber-500" />
                  Explore Dual Modes
                </Button>
              </a>
            </div>

            {/* Trakt-style Platform Stats */}
            <div className="pt-6 border-t border-border/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  150k+
                </p>
                <p className="text-xs text-muted-foreground">
                  Connections Made
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-500 tracking-tight">
                  98.6%
                </p>
                <p className="text-xs text-muted-foreground">
                  Graph Affinity Rate
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight">
                  2 Modes
                </p>
                <p className="text-xs text-muted-foreground">
                  Dating & Matrimony
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Trakt-Inspired 3D Spotlight Card Stack */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] h-[480px]">
              {/* Back Card (Layer 3) */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md shadow-xl transition-all duration-500 -rotate-6 scale-90 translate-y-6 opacity-40 pointer-events-none" />

              {/* Middle Card (Layer 2) */}
              <div className="absolute inset-0 rounded-3xl border border-white/15 bg-card/70 backdrop-blur-md shadow-2xl transition-all duration-500 rotate-3 scale-95 translate-y-3 opacity-75 pointer-events-none" />

              {/* Front Card (Active Layer) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.id}
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative h-full w-full rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card/95 to-background p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
                >
                  {/* Floating Action feedback indicator */}
                  {swipeFeedback && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 rounded-3xl backdrop-blur-sm"
                    >
                      <span className="text-xl font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                        {swipeFeedback}
                      </span>
                    </motion.div>
                  )}

                  {/* Top card header: Mode badge + Match score */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 font-semibold text-xs rounded-full border ${
                        activeProfile.mode === "dating"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      }`}
                    >
                      {activeProfile.mode === "dating"
                        ? "💖 Dating Mode"
                        : "💍 Matrimonial Mode"}
                    </Badge>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{activeProfile.matchRate}% Graph Match</span>
                    </div>
                  </div>

                  {/* Profile Visual Emblem / Avatar Representation */}
                  <div className="relative my-3 flex flex-col items-center">
                    <div
                      className={`w-28 h-28 rounded-2xl bg-gradient-to-tr ${activeProfile.avatarGradient} p-1 shadow-lg shadow-black/20`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-card/20 backdrop-blur-xs flex items-center justify-center text-white">
                        <span className="text-3xl font-bold tracking-tight">
                          {activeProfile.name.split(" ")[0][0]}
                          {activeProfile.name.split(" ")[1]?.[0]}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-xl font-bold text-foreground">
                          {activeProfile.name}, {activeProfile.age}
                        </h3>
                        {activeProfile.verified && (
                          <span
                            title="Verified Profile"
                            className="inline-flex items-center"
                          >
                            <ShieldCheck className="w-4 h-4 text-sky-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-muted-foreground" />
                        {activeProfile.role}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {activeProfile.location}
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-muted-foreground/90 line-clamp-2 italic text-center px-2">
                    "{activeProfile.bio}"
                  </p>

                  {/* Graph Relationship Match points */}
                  <div className="space-y-1.5 bg-muted/40 p-2.5 rounded-xl border border-border/50 text-[11px]">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-violet-500" />
                        Neo4j Relationship Edge
                      </span>
                      <span className="text-violet-500 font-bold">
                        Mutual Passions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeProfile.sharedInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded-md bg-background/80 border border-border/60 text-[10px] font-medium text-foreground"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trakt-style Spotlight Quick Controls */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleNext("Passed")}
                      aria-label="Pass"
                      className="w-11 h-11 rounded-full border border-border/70 bg-card hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95 shadow-sm"
                    >
                      <X className="w-5 h-5 text-rose-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNext("Super Liked! ⭐")}
                      aria-label="Super Like"
                      className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-500 transition-all hover:scale-110 active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNext("Matched! 💖")}
                      aria-label="Like"
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-rose-500/30"
                    >
                      <Heart className="w-7 h-7 fill-white" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Trakt-style Spotlight Caption & Navigation Dots */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                Featured Graph Matches Today
              </span>

              {/* Dots navigation */}
              <div className="flex items-center gap-1.5">
                {SPOTLIGHT_PROFILES.map((profile, idx) => (
                  <button
                    type="button"
                    key={profile.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-6 bg-rose-500"
                        : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                    aria-label={`Jump to profile ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
