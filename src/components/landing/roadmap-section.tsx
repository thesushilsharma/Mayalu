"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Database,
  HeartHandshake,
  Layers,
  Lock,
  Palette,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface RoadmapItem {
  title: string;
  category: string;
  description: string;
  status: "live" | "testing" | "next";
  icon: React.ComponentType<{ className?: string }>;
}

const ROADMAP: RoadmapItem[] = [
  {
    title: "Dating / Matrimonial Mode Toggle",
    category: "Core Architecture",
    description:
      "Instant intent switching between casual dating chemistry and serious matrimonial partnership.",
    status: "live",
    icon: HeartHandshake,
  },
  {
    title: "Neo4j Graph Relationship Engine",
    category: "Matchmaking",
    description:
      "Deep multi-dimensional matching based on graph topology, shared passions, and value clusters.",
    status: "live",
    icon: Database,
  },
  {
    title: "Card-Based Match Discovery & Swiping",
    category: "Discovery UI",
    description:
      "Smooth gestures, interactive profile insights, and zero-fatigue card discovery interface.",
    status: "live",
    icon: Layers,
  },
  {
    title: "Gamified XP & Level Progression",
    category: "Gamification",
    description:
      "XP reward tiers, activity streaks, level titles from Heart Explorer to Soul Matchmaker.",
    status: "live",
    icon: Trophy,
  },
  {
    title: "Profile Customization with Unlockable Themes",
    category: "Personalization",
    description:
      "Level-gated luxury color skins and profile cards that reflect individual aesthetic identity.",
    status: "live",
    icon: Palette,
  },
  {
    title: "Gamified Audio & Video Chat",
    category: "Communication",
    description:
      "Timed blind video dates with gradual unblur, icebreaker prompt cards, and voice prompts.",
    status: "testing",
    icon: Video,
  },
  {
    title: "AI-Powered Compatibility Suggestions",
    category: "Intelligence",
    description:
      "Contextual conversation starters and AI graph insights explaining why two people align.",
    status: "next",
    icon: Bot,
  },
  {
    title: "Event Matchmaking & Live Mingles",
    category: "Community",
    description:
      "Live virtual speed dating sessions and local Himalayan outdoor community match events.",
    status: "next",
    icon: CalendarCheck,
  },
];

type FilterType = "all" | "live" | "testing" | "next";

export function RoadmapSection() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredItems = ROADMAP.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <section
      id="roadmap"
      className="py-24 border-t border-border/40 bg-muted/15 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion In-View */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-semibold rounded-full border-border/80 bg-background/80 uppercase tracking-widest text-muted-foreground shadow-xs"
          >
            Engineering & Vision
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            The Product{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              Roadmap.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Transparently building the modern Nepali dating & matrimonial
            ecosystem with high-performance graph architecture.
          </p>

          {/* Interactive Filter Pills */}
          <div className="inline-flex p-1 rounded-full bg-card border border-border/70 mt-3 shadow-sm relative">
            {(
              [
                { id: "all", label: "All Milestones" },
                { id: "live", label: "Live in Prod (5)" },
                { id: "testing", label: "In Testing (1)" },
                { id: "next", label: "Upcoming (2)" },
              ] as const
            ).map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === tab.id && (
                  <motion.div
                    layoutId="roadmapFilterIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 shadow-md"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isLive = item.status === "live";
              const isTesting = item.status === "testing";

              return (
                <motion.div
                  layout
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.06,
                    ease: "easeOut",
                  }}
                  className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-md hover:border-rose-500/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-foreground shadow-xs">
                        <Icon className="w-5 h-5 text-rose-500" />
                      </div>

                      {isLive && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      {isTesting && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold uppercase rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          In Testing
                        </Badge>
                      )}
                      {!isLive && !isTesting && (
                        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] font-bold uppercase rounded-full">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Upcoming
                        </Badge>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        {item.category}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Tech Stack Banner from README.md */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-background p-8 sm:p-10 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Modern Foundation
              </span>
              <h3 className="text-2xl font-extrabold text-foreground">
                Powered by Industry-Leading Tech
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Engineered for sub-second responses, graph relationship queries,
                and high-fidelity dating experiences.
              </p>
            </div>

            <div className="lg:col-span-7 flex flex-wrap gap-2.5 sm:gap-3 items-center justify-start lg:justify-end">
              <span className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs hover:border-emerald-500/40 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Next.js 16+ App Router
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs hover:border-cyan-500/40 transition-colors">
                <Database className="w-3.5 h-3.5 text-cyan-500" />
                Neo4j Graph Database
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs hover:border-amber-500/40 transition-colors">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Neon DB Secure Auth
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs hover:border-sky-500/40 transition-colors">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                TypeScript & Zod
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs hover:border-rose-500/40 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Tailwind CSS & Shadcn UI
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
