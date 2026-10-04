"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Flame,
  Heart,
  MapPin,
  Music,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

const WAVEFORM_BARS = [
  { id: "w1", height: 40, delay: 0 },
  { id: "w2", height: 70, delay: 0.08 },
  { id: "w3", height: 30, delay: 0.16 },
  { id: "w4", height: 90, delay: 0.24 },
  { id: "w5", height: 60, delay: 0.32 },
  { id: "w6", height: 100, delay: 0.4 },
  { id: "w7", height: 45, delay: 0.48 },
  { id: "w8", height: 80, delay: 0.56 },
  { id: "w9", height: 55, delay: 0.64 },
  { id: "w10", height: 95, delay: 0.72 },
  { id: "w11", height: 35, delay: 0.8 },
  { id: "w12", height: 65, delay: 0.88 },
  { id: "w13", height: 85, delay: 0.96 },
];

export function InteractiveModeToggle() {
  const [activeMode, setActiveMode] = useState<"dating" | "matrimonial">(
    "dating",
  );
  const [audioPlaying, setAudioPlaying] = useState(false);

  return (
    <section id="dual-modes" className="py-24 relative overflow-hidden">
      {/* Dynamic ambient background bloom that shifts based on mode */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-1000 -z-10 ${
          activeMode === "dating"
            ? "bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.14),transparent_65%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.14),transparent_65%)]"
        }`}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title & interactive toggle switch */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-14"
        >
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-muted-foreground shadow-xs"
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

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Toggle below to preview how Mayalu dynamically alters the discovery
            engine, card metrics, and compatibility factors based on your real
            intention.
          </p>

          {/* Master Mode Switcher Control with Framer Motion Layout Pill */}
          <div className="inline-flex p-1.5 rounded-full border border-border/70 bg-card/90 backdrop-blur-xl shadow-xl mt-4 relative">
            <button
              type="button"
              onClick={() => setActiveMode("dating")}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeMode === "dating"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeMode === "dating" && (
                <motion.div
                  layoutId="activeModeIndicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 shadow-lg shadow-rose-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Heart
                  className={`w-4 h-4 ${activeMode === "dating" ? "fill-white" : ""}`}
                />
                Dating Mode
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("matrimonial")}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeMode === "matrimonial"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeMode === "matrimonial" && (
                <motion.div
                  layoutId="activeModeIndicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 shadow-lg shadow-amber-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Matrimonial Mode
              </span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          {/* Left Column: Mode Features & Dynamic Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeMode === "dating" ? (
                <motion.div
                  key="dating-details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold shadow-xs">
                    <Flame className="w-3.5 h-3.5 fill-rose-500" /> High
                    Chemistry · Spontaneous Vibes
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                    Connect over mutual sparks, vibes, and weekend adventures.
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In Dating Mode, profiles emphasize lifestyle synergy,
                    Spotify listening tastes, spontaneous date ideas, and
                    real-time vibe compatibility. No awkward resumes—just
                    authentic chemistry.
                  </p>

                  {/* Compatibility Metric Gauges */}
                  <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-muted-foreground">
                        Spontaneous Energy Alignment
                      </span>
                      <span className="text-rose-500">96%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "96%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                      <span className="text-muted-foreground">
                        Weekend & Music Synergy
                      </span>
                      <span className="text-rose-500">92%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-rose-500/40 transition-colors">
                      <div className="font-bold text-xs text-rose-500 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Vibe Check Prompt
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Interactive questions to skip dry texting and discover
                        shared humour.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-rose-500/40 transition-colors">
                      <div className="font-bold text-xs text-rose-500 mb-1 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5" />
                        Shared Passions
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold shadow-xs">
                    <Award className="w-3.5 h-3.5" /> Lifelong Partnership ·
                    Shared Values
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                    Build a future with verified compatibility and family
                    alignment.
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In Matrimonial Mode, Mayalu shifts focus to long-term life
                    vision, career aspirations, family background, and
                    cultural/horoscope alignment—with privacy filters and
                    family-friendly verification.
                  </p>

                  {/* Compatibility Metric Gauges */}
                  <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-muted-foreground">
                        Horoscope & Guna Compatibility
                      </span>
                      <span className="text-amber-500">34 / 36 Gunas</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "94%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                      <span className="text-muted-foreground">
                        Family Values & Life Vision Harmony
                      </span>
                      <span className="text-amber-500">98% Match</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "98%" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-amber-500/40 transition-colors">
                      <div className="font-bold text-xs text-amber-500 mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        Cultural & Family Roots
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Detailed value models, horoscope compatibility, and
                        lineage alignment.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-amber-500/40 transition-colors">
                      <div className="font-bold text-xs text-amber-500 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Credentials
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Trust badges for education, profession, and identity
                        verification.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Live Transformed Profile Card with 3D Depth */}
          <div className="lg:col-span-6 flex justify-center">
            <AnimatePresence mode="wait">
              {activeMode === "dating" ? (
                <motion.div
                  key="dating-card"
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-[400px] rounded-3xl border border-rose-500/30 bg-gradient-to-b from-card via-card/95 to-background p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Mode Badge & Compatibility */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      💖 Dating Vibe
                    </Badge>
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" /> 97% Spark Index
                    </span>
                  </div>

                  {/* Profile Mockup */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                      SM
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-1.5">
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
                  <div className="space-y-2 mb-4 bg-muted/40 p-3.5 rounded-2xl border border-border/60">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Passions & Weekend Mood
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] bg-background/90 px-2.5 py-1 rounded-lg border border-border/80 font-medium text-foreground">
                        ☕ Chemex Pour-overs
                      </span>
                      <span className="text-[11px] bg-background/90 px-2.5 py-1 rounded-lg border border-border/80 font-medium text-foreground">
                        🏔️ Langtang Trek
                      </span>
                      <span className="text-[11px] bg-background/90 px-2.5 py-1 rounded-lg border border-border/80 font-medium text-foreground">
                        🎸 Oasis & The Edge Band
                      </span>
                    </div>
                  </div>

                  {/* Interactive Audio Icebreaker Prompt */}
                  <button
                    type="button"
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    className="w-full text-left p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 transition-all hover:bg-rose-500/15 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-rose-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        Audio Icebreaker Prompt
                      </p>
                      <span className="text-[10px] text-rose-500 font-bold underline">
                        {audioPlaying ? "Playing..." : "Tap to Play"}
                      </span>
                    </div>

                    <p className="text-foreground/90 italic text-xs mb-2">
                      "What's your most controversial opinion about Nepali
                      street food?"
                    </p>

                    {/* Animated Audio Waveform Mockup */}
                    <div className="flex items-center gap-1 h-4">
                      {WAVEFORM_BARS.map((bar) => (
                        <div
                          key={bar.id}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            audioPlaying
                              ? "bg-rose-500 animate-pulse"
                              : "bg-rose-500/40"
                          }`}
                          style={{
                            height: audioPlaying ? `${bar.height}%` : "30%",
                            animationDelay: `${bar.delay}s`,
                          }}
                        />
                      ))}
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="matrimonial-card"
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-[400px] rounded-3xl border border-amber-500/30 bg-gradient-to-b from-card via-card/95 to-background p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Mode Badge & Compatibility */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      💍 Matrimonial Profile
                    </Badge>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                      <Award className="w-3.5 h-3.5" /> 34/36 Guna Alignment
                    </span>
                  </div>

                  {/* Profile Mockup */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                      AK
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-1.5">
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
                  <div className="space-y-2 mb-4 bg-muted/40 p-3.5 rounded-2xl border border-border/60">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Life Values & Vision
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-background/90 p-2.5 rounded-xl border border-border/80">
                        <span className="text-[10px] text-muted-foreground block">
                          Education
                        </span>
                        <span className="font-semibold text-foreground">
                          Master's Degree
                        </span>
                      </div>
                      <div className="bg-background/90 p-2.5 rounded-xl border border-border/80">
                        <span className="text-[10px] text-muted-foreground block">
                          Diet & Lifestyle
                        </span>
                        <span className="font-semibold text-foreground">
                          Non-smoker, Vegetarian
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Family values snippet */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs">
                    <p className="text-amber-500 font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
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
