"use client";

import {
  CheckCircle2,
  Flame,
  Lock,
  Palette,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react";
import { useState } from "react";
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

export function XpShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEMES[0]);

  return (
    <section id="xp-gamify" className="py-20 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-amber-500"
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
        </div>

        {/* Gamification Dashboard Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Column: User XP Status & Missions */}
          <div className="lg:col-span-6 rounded-3xl border border-border/70 bg-gradient-to-b from-card to-card/70 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              {/* Level Status Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xl text-foreground">
                        Level 8
                      </span>
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] uppercase font-bold">
                        Heart Alchemist
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      3,850 / 5,000 XP to Level 9
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  7-Day Streak
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Current Tier</span>
                  <span className="text-foreground">77% Completed</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: "77%" }}
                  />
                </div>
              </div>

              {/* Gamified Quests / XP Earners */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Active XP Missions
                </span>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Record 30-Sec Voice Note
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Adds authentic audio prompt to profile
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                    +300 XP
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Answer 3 Compatibility Dilemmas
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Refines Neo4j graph alignment weight
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full text-[10px]">
                    +250 XP
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-violet-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Gamified 5-Min Blind Video Chat
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Face blurs gradually as conversation flows
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full text-[10px]">
                    +600 XP
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Higher levels unlock verified badges & VIP match pools
              </span>
              <span className="font-bold text-foreground">
                Level 10: Soul Matchmaker
              </span>
            </div>
          </div>

          {/* Right Column: Unlockable Profile Themes Showcase */}
          <div className="lg:col-span-6 rounded-3xl border border-border/70 bg-gradient-to-b from-card to-card/70 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
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

              <p className="text-xs text-muted-foreground mb-4">
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
                    className={`p-3 rounded-2xl border text-left transition-all duration-300 relative flex items-center justify-between ${
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
                        className={`w-3 h-3 rounded-full bg-gradient-to-tr ${theme.gradient}`}
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

                <div
                  className={`p-5 rounded-2xl bg-gradient-to-r ${selectedTheme.gradient} text-white shadow-xl transition-all duration-500`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      ✨ Active Profile Aura
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      XP Tier 8
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-extrabold text-white">
                      Pranil Joshi, 27
                    </h4>
                    <p className="text-xs text-white/80">
                      Cinematographer · Level 8 Heart Alchemist
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      🎥 Arri & Film
                    </span>
                    <span className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      🧗 Pokhara Bouldering
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
              <span>More unlockable themes added monthly</span>
              <span className="font-bold text-rose-500">
                Free to earn through engagement
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
