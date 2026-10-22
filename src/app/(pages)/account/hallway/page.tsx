"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Sparkles, GitFork, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserLevel } from "@/contexts/userContext";
import { TinderSwipeDeck, type Profile } from "@/components/tinder-swipe-deck";
import { toast } from "sonner";
import { Neo4jCompatibilityModal } from "@/components/graph/neo4j-compatibility-modal";
import { recordGraphInteractionAction } from "@/lib/neo4j/neo4j.action";
import { getHallwayCandidatesAction } from "@/app/actions/hallway";

export default function HallwayPage() {
  const { userLevel, addXp } = useUserLevel();
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [useMatrimonialMode, setUseMatrimonialMode] = React.useState(false);
  const [currentProfiles, setCurrentProfiles] = React.useState<Profile[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<string>("demo_user_you");
  const [matches, setMatches] = React.useState<string[]>([]);
  const [superLikes, setSuperLikes] = React.useState(3);
  const [showGraphModal, setShowGraphModal] = React.useState(false);
  const [deckKey, setDeckKey] = React.useState(0);

  // Load candidate profiles from Neon PostgreSQL (seeded & live data)
  React.useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function fetchProfiles() {
      setIsLoading(true);
      try {
        const res = await getHallwayCandidatesAction();
        if (isSubscribed) {
          if (res.success && res.profiles.length > 0) {
            setCurrentProfiles(res.profiles);
          } else {
            setCurrentProfiles([]);
          }
          if (res.currentUserId) {
            setCurrentUserId(res.currentUserId);
          }
        }
      } catch (err) {
        console.error("Failed to load hallway candidates:", err);
        if (isSubscribed) {
          toast.error("Could not load candidate Chinos. Please try refreshing.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    fetchProfiles();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const displayLevel = mounted ? userLevel.level : 1;
  const displaySuperLikes = mounted ? superLikes : 3;

  const handleSwipeRight = (profile: Profile) => {
    setMatches((prev) => [...prev, profile.id]);
    addXp(10);
    // Continuous Graph Learning: Record positive affinity in Neo4j Knowledge Graph
    recordGraphInteractionAction(currentUserId, profile.id, "like").catch(() => {});
    toast.success(`Subhakamana! 💘 Connected with ${profile.name}!`, {
      description: "Chat unlocked in Kura-Kani.",
    });
  };

  const handleSwipeLeft = (profile: Profile) => {
    addXp(2);
    // Continuous Graph Learning: Record pass to calibrate dynamic recommendation weights
    recordGraphInteractionAction(currentUserId, profile.id, "pass").catch(() => {});
  };

  const handleSuperLike = (profile: Profile) => {
    if (superLikes > 0) {
      setSuperLikes((prev) => prev - 1);
      setMatches((prev) => [...prev, profile.id]);
      addXp(25);
      // Continuous Graph Learning: High affinity weight boost in Neo4j
      recordGraphInteractionAction(currentUserId, profile.id, "superlike").catch(() => {});
      toast.success(`Kura-Kani Sparked! 💫 Super Like sent to ${profile.name}!`, {
        description: "Your Chino was placed at the top of their inbox.",
      });
    } else {
      toast.error("No Super Likes remaining today", {
        description: "Daily super likes reset at midnight.",
      });
    }
  };

  const resetStack = async () => {
    setIsLoading(true);
    try {
      const res = await getHallwayCandidatesAction();
      if (res.success && res.profiles.length > 0) {
        setCurrentProfiles(res.profiles);
        setDeckKey((k) => k + 1);
        toast.info("Hallway refreshed with candidate Chinos ✨");
      } else {
        toast.info("No candidates available right now.");
      }
    } catch {
      toast.error("Failed to refresh candidate profiles.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start max-w-lg mx-auto w-full py-2 sm:py-4">
      {/* Hallway Top Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <Link
            href="/account/dashboard"
            className="size-8 rounded-full bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                The Hallway
              </h1>
              <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/20 py-0 font-semibold">
                मयालु गल्ली
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Review candidate Chinos curated by Maya
            </p>
          </div>
        </div>

        {/* Level / Super Like Pill */}
        <div className="flex items-center gap-1.5 bg-muted/50 dark:bg-slate-900/40 border border-border/60 px-2.5 py-1 rounded-full text-xs shadow-2xs">
          <Sparkles className="size-3 text-amber-500" />
          <span
            suppressHydrationWarning
            className="font-semibold text-foreground text-[11px]"
          >
            Lvl {displayLevel}
          </span>
          <span className="text-muted-foreground text-[10px]">•</span>
          <span
            suppressHydrationWarning
            className="text-violet-500 font-semibold text-[11px]"
          >
            {displaySuperLikes} ★
          </span>
        </div>
      </div>

      {/* Mode Switch, Dhukuti Info & Neo4j Graph Button (Compact pill row) */}
      <div className="w-full flex items-center justify-between gap-2 p-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-2xs mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">Mode:</span>
          <div className="flex items-center gap-1.5">
            <Switch
              id="mode-toggle"
              checked={useMatrimonialMode}
              onCheckedChange={setUseMatrimonialMode}
              className="scale-90"
            />
            <Label htmlFor="mode-toggle" className="text-xs font-semibold cursor-pointer">
              {useMatrimonialMode ? "💍 Matrimonial" : "🔥 Dating"}
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGraphModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 border border-violet-500/25 text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
            title="Inspect Neo4j compatibility topology"
          >
            <GitFork className="size-3 text-violet-500" />
            <span className="hidden sm:inline">Neo4j</span>
            <span>Graph</span>
          </button>

          <div className="hidden xs:flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lock className="size-3 text-rose-500 shrink-0" />
            <span>Dhukuti 🔒</span>
          </div>
        </div>
      </div>

      {/* DEDICATED TINDER SWIPE DECK OR SKELETON */}
      <div className="w-full flex justify-center">
        {isLoading ? (
          <div className="w-full max-w-[420px] h-[540px] sm:h-[580px] rounded-3xl border border-border/60 bg-card/70 backdrop-blur-md p-6 flex flex-col justify-end animate-pulse shadow-xl relative overflow-hidden">
            <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
              <div className="h-6 w-24 rounded-full bg-muted/80" />
              <div className="h-6 w-16 rounded-full bg-muted/80" />
            </div>
            <div className="space-y-3 z-10">
              <div className="h-8 w-44 rounded-lg bg-muted/80" />
              <div className="h-4 w-60 rounded-md bg-muted/60" />
              <div className="h-10 w-full rounded-lg bg-muted/40" />
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-20 rounded-md bg-muted/60" />
                <div className="h-6 w-24 rounded-md bg-muted/60" />
                <div className="h-6 w-20 rounded-md bg-muted/60" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        ) : (
          <TinderSwipeDeck
            key={deckKey}
            profiles={currentProfiles}
            isMatrimonialMode={useMatrimonialMode}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onSuperLike={handleSuperLike}
            onResetStack={resetStack}
          />
        )}
      </div>

      {/* Live Neo4j Graph Inspection Modal */}
      <Neo4jCompatibilityModal
        open={showGraphModal}
        onOpenChange={setShowGraphModal}
        candidateName={currentProfiles[0]?.name || "Your Match"}
        candidateId={currentProfiles[0]?.id || "demo_user_match"}
      />
    </div>
  );
}
