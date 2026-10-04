"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Flame,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

export function InteractiveModeToggle() {
  const [activeMode, setActiveMode] = useState<"dating" | "matrimonial">(
    "dating",
  );

  return (
    <section id="dual-modes" className="py-20 relative overflow-hidden">
      {/* Dynamic ambient background glow that shifts based on mode */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 -z-10 ${
          activeMode === "dating"
            ? "bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.12),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_70%)]"
        }`}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title & interactive toggle switch */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-muted-foreground"
          >
            Dual-Intent Architecture
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Two distinct worlds.{" "}
            <span
              className={`transition-colors duration-500 ${
                activeMode === "dating"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent"
              }`}
            >
              One unified profile.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base">
            Toggle below to preview how Mayalu dynamically alters the discovery
            engine, card metrics, and compatibility factors based on your real
            intention.
          </p>

          {/* Master Mode Switcher Control */}
          <div className="inline-flex p-1.5 rounded-full border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl mt-4">
            <button
              type="button"
              onClick={() => setActiveMode("dating")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeMode === "dating"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 scale-102"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${activeMode === "dating" ? "fill-white" : ""}`}
              />
              Dating Mode
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("matrimonial")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeMode === "matrimonial"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25 scale-102"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Matrimonial Mode
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: Mode Features & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeMode === "dating" ? (
                <motion.div
                  key="dating-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5" /> High Chemistry ·
                    Spontaneous Vibes
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Connect over mutual sparks, vibes, and weekend adventures.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In Dating Mode, profiles emphasize lifestyle synergy,
                    Spotify listening tastes, spontaneous date ideas, and
                    real-time vibe compatibility. No awkward resumes—just
                    authentic chemistry.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                      <div className="font-bold text-xs text-rose-500 mb-1">
                        ⚡ Vibe Check Prompt
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Interactive questions to skip dry texting and discover
                        shared humour.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                      <div className="font-bold text-xs text-rose-500 mb-1">
                        🎵 Shared Passions
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Graph matching across concerts, indie films, cafe hunts,
                        and travel.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="matrimonial-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" /> Lifelong Partnership ·
                    Shared Values
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Build a future with verified compatibility and family
                    alignment.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In Matrimonial Mode, Mayalu shifts focus to long-term life
                    vision, career aspirations, family background, and
                    cultural/horoscope alignment—with privacy filters and
                    family-friendly verification.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                      <div className="font-bold text-xs text-amber-500 mb-1">
                        🏛️ Cultural & Family Alignment
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Detailed value models, horoscope compatibility (Gunas),
                        and roots.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                      <div className="font-bold text-xs text-amber-500 mb-1">
                        🎓 Verified Credentials
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Trust badge for education, profession, and identity
                        verification.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Live Transformed Profile Card */}
          <div className="lg:col-span-6 flex justify-center">
            <AnimatePresence mode="wait">
              {activeMode === "dating" ? (
                <motion.div
                  key="dating-card"
                  initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[380px] rounded-3xl border border-rose-500/30 bg-gradient-to-b from-card via-card/95 to-background p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Mode Badge & Compatibility */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      💖 Dating Vibe
                    </Badge>
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 97% Spark Index
                    </span>
                  </div>

                  {/* Profile Mockup */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      SM
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-1">
                        Smarika M., 24
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> Jhamsikhel,
                        Lalitpur
                      </p>
                      <p className="text-xs text-rose-500 font-semibold mt-0.5">
                        "Looking for good chai & deep conversations"
                      </p>
                    </div>
                  </div>

                  {/* Dating Mode Tags */}
                  <div className="space-y-2 mb-4 bg-muted/30 p-3 rounded-2xl border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Passions & Weekend Mood
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] bg-background px-2.5 py-1 rounded-lg border border-border/70 font-medium">
                        ☕ Chemex Pour-overs
                      </span>
                      <span className="text-[11px] bg-background px-2.5 py-1 rounded-lg border border-border/70 font-medium">
                        🏔️ Langtang Trek
                      </span>
                      <span className="text-[11px] bg-background px-2.5 py-1 rounded-lg border border-border/70 font-medium">
                        🎸 Oasis & The Edge Band
                      </span>
                    </div>
                  </div>

                  {/* Dating Icebreaker Prompt */}
                  <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs">
                    <p className="text-rose-500 font-bold text-[11px] uppercase tracking-wider mb-1">
                      Audio Icebreaker Prompt:
                    </p>
                    <p className="text-foreground/90 italic">
                      "What's your most controversial opinion about Nepali
                      street food?"
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="matrimonial-card"
                  initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[380px] rounded-3xl border border-amber-500/30 bg-gradient-to-b from-card via-card/95 to-background p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Mode Badge & Compatibility */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      💍 Matrimonial Profile
                    </Badge>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> 34/36 Guna Alignment
                    </span>
                  </div>

                  {/* Profile Mockup */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      AK
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-1">
                        Anish Koirala, 28
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-amber-500" /> Senior
                        Financial Analyst, MBA
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        Family Roots: Kathmandu & Biratnagar
                      </p>
                    </div>
                  </div>

                  {/* Matrimonial Mode Credentials */}
                  <div className="space-y-2 mb-4 bg-muted/30 p-3 rounded-2xl border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Life Values & Vision
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="bg-background p-2 rounded-lg border border-border/70">
                        <span className="text-[10px] text-muted-foreground block">
                          Education
                        </span>
                        <span className="font-semibold text-foreground">
                          Master's Degree
                        </span>
                      </div>
                      <div className="bg-background p-2 rounded-lg border border-border/70">
                        <span className="text-[10px] text-muted-foreground block">
                          Lifestyle
                        </span>
                        <span className="font-semibold text-foreground">
                          Non-smoker, Vegetarian
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Family values snippet */}
                  <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <p className="text-amber-500 font-bold text-[11px] uppercase tracking-wider mb-1">
                      Family & Long-Term Goals:
                    </p>
                    <p className="text-foreground/90 italic">
                      "Looking for an equal partner who values mutual respect,
                      career ambition, and family festivals."
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
