"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import {
  CheckCircle2,
  Circle,
  Flame,
  Lock,
  Palette,
  Trophy,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";

interface ThemeOption {
  id: string;
  name: string;
  levelRequired: number;
  unlocked: boolean;
  gradient: string;
  accent: string;
}

const THEMES: ThemeOption[] = [
  {
    id: "rose",
    name: "Himalayan Blossom",
    levelRequired: 1,
    unlocked: true,
    gradient: "from-rose-500 via-pink-600 to-rose-700",
    accent: "text-rose-500",
  },
  {
    id: "velvet",
    name: "Midnight Velvet",
    levelRequired: 5,
    unlocked: true,
    gradient: "from-slate-900 via-purple-950 to-indigo-950",
    accent: "text-purple-400",
  },
  {
    id: "gold",
    name: "Kathmandu Gold",
    levelRequired: 8,
    unlocked: true,
    gradient: "from-amber-500 via-yellow-600 to-amber-700",
    accent: "text-amber-400",
  },
  {
    id: "sapphire",
    name: "Cyber Sapphire",
    levelRequired: 12,
    unlocked: false,
    gradient: "from-cyan-500 via-blue-600 to-indigo-800",
    accent: "text-cyan-400",
  },
];

interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  icon: "check" | "sparkles" | "video";
}

const INITIAL_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Record 30-Sec Voice Note",
    description: "Adds authentic audio prompt to profile",
    xp: 300,
    completed: true,
    icon: "check",
  },
  {
    id: "m2",
    title: "Answer 3 Compatibility Dilemmas",
    description: "Refines Neo4j graph alignment weight",
    xp: 250,
    completed: false,
    icon: "sparkles",
  },
  {
    id: "m3",
    title: "Gamified 5-Min Blind Video Chat",
    description: "Face blurs gradually as conversation flows",
    xp: 600,
    completed: false,
    icon: "video",
  },
];

export function XpShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEMES[0]);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [currentXp, setCurrentXp] = useState(3850);
  const [xpGainedMessage, setXpGainedMessage] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const xpCounterRef = useRef<HTMLSpanElement | null>(null);

  // Trigger GSAP count-up and progress bar when entering viewport
  const handleViewportEnter = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    if (progressBarRef.current) {
      gsap.fromTo(
        progressBarRef.current,
        { width: "0%" },
        {
          width: "77%",
          duration: 1.2,
          ease: "power2.out",
        },
      );
    }

    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      val: 3850,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        if (xpCounterRef.current) {
          xpCounterRef.current.textContent = Math.round(
            counterObj.val,
          ).toLocaleString();
        }
      },
    });
  };

  // Interactive Quest Completion Toggle
  const toggleMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const newStatus = !m.completed;
          const diff = newStatus ? m.xp : -m.xp;
          setCurrentXp((x) => x + diff);

          if (newStatus) {
            setXpGainedMessage(`+${m.xp} XP Claimed!`);
            setTimeout(() => setXpGainedMessage(null), 2000);
          }
          return { ...m, completed: newStatus };
        }
        return m;
      }),
    );
  };

  const progressPercent = Math.min(100, Math.round((currentXp / 5000) * 100));

  return (
    <section id="xp-gamify" className="py-24 relative overflow-hidden">
      {/* Background radial accent glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion In-View */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-amber-500 shadow-xs"
          >
            <Trophy className="w-3.5 h-3.5 mr-1" />
            Gamified Progression Engine
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Level up your journey.{" "}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
              Unlock extraordinary perks.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Dating shouldn’t feel like a chore. Mayalu gamifies profile
            completion, authentic interactions, and audio/video dates with XP
            rewards, badges, and customizable themes.
          </p>
        </motion.div>

        {/* Gamification Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          onViewportEnter={handleViewportEnter}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {/* Left Column: User XP Status & Missions */}
          <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              {/* Level Status Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xl text-foreground">
                        Level 8
                      </span>
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Heart Alchemist
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span ref={xpCounterRef}>
                        {currentXp.toLocaleString()}
                      </span>{" "}
                      / 5,000 XP to Level 9
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                    7-Day Streak
                  </span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Current Tier Progress</span>
                  <span className="text-foreground font-bold">
                    {progressPercent}% Completed
                  </span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Active XP Missions (Clickable!) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Interactive XP Missions (Tap to Test)
                  </span>
                  <AnimatePresence>
                    {xpGainedMessage && (
                      <motion.span
                        initial={{ opacity: 0, y: -5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.9 }}
                        className="text-xs font-extrabold text-emerald-500 bg-emerald-500/15 px-2.5 py-0.5 rounded-full"
                      >
                        {xpGainedMessage}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {missions.map((mission) => (
                  <button
                    type="button"
                    key={mission.id}
                    onClick={() => toggleMission(mission.id)}
                    className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      mission.completed
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-muted/40 border-border/60 hover:border-amber-500/40 hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {mission.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                      )}
                      <div>
                        <p
                          className={`font-semibold text-xs ${
                            mission.completed
                              ? "text-emerald-600 dark:text-emerald-400 line-through"
                              : "text-foreground"
                          }`}
                        >
                          {mission.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[10px] shrink-0 ${
                        mission.completed
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      +{mission.xp} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>Higher levels unlock verified badges & VIP pools</span>
              <span className="font-bold text-foreground">
                Level 10: Soul Matchmaker
              </span>
            </div>
          </div>

          {/* Right Column: Unlockable Profile Themes Showcase */}
          <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  <h3 className="text-xl font-bold text-foreground">
                    Unlockable Profile Themes
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Personalize Your Aura
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Express your aesthetic style. As you earn XP and reach higher
                tiers, customize your profile cards with luxury color themes.
              </p>

              {/* Theme Selector Pills */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {THEMES.map((theme) => (
                  <button
                    type="button"
                    key={theme.id}
                    onClick={() => theme.unlocked && setSelectedTheme(theme)}
                    disabled={!theme.unlocked}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative flex items-center justify-between cursor-pointer ${
                      selectedTheme.id === theme.id
                        ? "border-rose-500 bg-rose-500/10 shadow-sm"
                        : theme.unlocked
                          ? "border-border/70 bg-background/60 hover:bg-muted/50"
                          : "border-border/30 bg-muted/20 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        {theme.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {theme.unlocked
                          ? "Unlocked"
                          : `Requires Level ${theme.levelRequired}`}
                      </p>
                    </div>

                    {theme.unlocked ? (
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${theme.gradient} shadow-xs`}
                      />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>

              {/* Live Profile Card Render with Selected Theme */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Theme Preview: {selectedTheme.name}
                </span>

                <motion.div
                  key={selectedTheme.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className={`p-6 rounded-2xl bg-gradient-to-r ${selectedTheme.gradient} text-white shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                      ✨ Active Profile Aura
                    </span>
                    <span className="text-xs font-bold text-white/90 bg-white/20 px-2.5 py-0.5 rounded-full">
                      XP Tier 8
                    </span>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-xl font-extrabold text-white">
                      Pranil Joshi, 27
                    </h4>
                    <p className="text-xs text-white/80 mt-0.5">
                      Cinematographer · Level 8 Heart Alchemist
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <span className="text-[11px] font-medium bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      🎥 Arri & Film
                    </span>
                    <span className="text-[11px] font-medium bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      🧗 Pokhara Bouldering
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>More unlockable themes added monthly</span>
              <span className="font-bold text-rose-500">
                Free to earn through engagement
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
