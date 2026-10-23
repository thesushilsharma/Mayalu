"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  GitFork,
  LayoutList,
  Layers,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserLevel } from "@/contexts/userContext";
import { TinderSwipeDeck, type Profile } from "@/components/tinder-swipe-deck";
import { HallwayScrollFeed } from "@/components/hallway/hallway-scroll-feed";
import { toast } from "sonner";
import { Neo4jCompatibilityModal } from "@/components/graph/neo4j-compatibility-modal";
import { recordGraphInteractionAction } from "@/lib/neo4j/neo4j.action";
import { getHallwayCandidatesAction } from "@/app/actions/hallway";
import type { CandidateProfile } from "@/lib/neonDB/types";

export default function HallwayPage() {
  const { userLevel, addXp } = useUserLevel();
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [useMatrimonialMode, setUseMatrimonialMode] = React.useState(false);

  // View Mode: 'feed' (Instagram/Twitter scroll based - DEFAULT) or 'deck' (Tinder swipe)
  const [viewMode, setViewMode] = React.useState<"feed" | "deck">("feed");

  // Gender Selection for candidate discovery: 'Female' | 'Male' | 'All'
  const [selectedGender, setSelectedGender] = React.useState<string>("All");

  const [currentProfiles, setCurrentProfiles] = React.useState<CandidateProfile[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<string>("demo_user_you");
  const [userGender, setUserGender] = React.useState<string | undefined>();
  const [userInterestedIn, setUserInterestedIn] = React.useState<string | undefined>();

  const [selectedCandidateForGraph, setSelectedCandidateForGraph] = React.useState<CandidateProfile | null>(null);
  const [showGraphModal, setShowGraphModal] = React.useState(false);
  const [deckKey, setDeckKey] = React.useState(0);

  // Fetch candidate profiles based on active gender filter
  const fetchProfiles = React.useCallback(async (gender: string) => {
    setIsLoading(true);
    try {
      const res = await getHallwayCandidatesAction(gender);
      if (res.success) {
        setCurrentProfiles(res.profiles);
        if (res.currentUserId) setCurrentUserId(res.currentUserId);
        if (res.userGender) setUserGender(res.userGender);
        if (res.userInterestedIn) setUserInterestedIn(res.userInterestedIn);
      } else {
        setCurrentProfiles([]);
      }
    } catch (err) {
      console.error("Failed to load hallway candidates:", err);
      toast.error("Could not load candidate Chinos. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    setMounted(true);
    // Initially query with "default" which allows server action to pick user preference or "All"
    getHallwayCandidatesAction().then((res) => {
      if (res.success) {
        setCurrentProfiles(res.profiles);
        if (res.currentUserId) setCurrentUserId(res.currentUserId);
        if (res.userGender) setUserGender(res.userGender);
        if (res.userInterestedIn) {
          setUserInterestedIn(res.userInterestedIn);
          if (res.activeGenderFilter) {
            setSelectedGender(res.activeGenderFilter);
          }
        }
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  // Handle Gender filter tab change
  const handleGenderChange = (newGender: string) => {
    setSelectedGender(newGender);
    setDeckKey((k) => k + 1);
    fetchProfiles(newGender);
  };

  const displayLevel = mounted ? userLevel.level : 1;

  const handleOpenGraphModal = (profile: CandidateProfile) => {
    setSelectedCandidateForGraph(profile);
    setShowGraphModal(true);
  };

  const handleLike = (profile: CandidateProfile) => {
    addXp(10);
    recordGraphInteractionAction(currentUserId, profile.id, "like").catch(() => {});
  };

  const handleSuperLike = (profile: CandidateProfile) => {
    addXp(25);
    recordGraphInteractionAction(currentUserId, profile.id, "superlike").catch(() => {});
  };

  const handleSwipeLeft = (profile: CandidateProfile) => {
    addXp(2);
    recordGraphInteractionAction(currentUserId, profile.id, "pass").catch(() => {});
  };

  const resetStack = () => {
    fetchProfiles(selectedGender);
    setDeckKey((k) => k + 1);
    toast.info("Hallway refreshed with candidate Chinos ✨");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start max-w-2xl mx-auto w-full py-2 sm:py-5 px-3 sm:px-4">
      {/* 1. HALLWAY TOP BAR */}
      <header className="w-full flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2.5">
          <Link
            href="/account/dashboard"
            className="size-8.5 rounded-full bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
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
              Explore candidate Chinos powered by Neo4j graph intelligence
            </p>
          </div>
        </div>

        {/* View Mode Toggle (Feed Scroll vs Tinder Deck) */}
        <div className="flex items-center gap-1 bg-muted/60 dark:bg-slate-900/60 p-1 rounded-2xl border border-border/50 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("feed")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              viewMode === "feed"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Scroll Feed (Instagram/Twitter style)"
          >
            <LayoutList className="size-3.5" />
            <span className="hidden sm:inline">Feed</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("deck")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              viewMode === "deck"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Swipe Deck (Tinder card style)"
          >
            <Layers className="size-3.5" />
            <span className="hidden sm:inline">Swipe</span>
          </button>
        </div>
      </header>

      {/* 2. GENDER SELECTION & DISCOVERY CONTROLS */}
      <section className="w-full flex flex-col gap-2.5 p-3 rounded-3xl bg-card/70 backdrop-blur-md border border-border/60 shadow-2xs mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Gender Selector: Women / Men / Everyone */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Users className="size-3 text-rose-500" />
              Seeking:
            </span>
            <Tabs
              value={selectedGender}
              onValueChange={handleGenderChange}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-muted/70 p-0.5 rounded-xl h-8">
                <TabsTrigger
                  value="Female"
                  className="text-xs px-3 py-1 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs active:scale-95 transition-transform"
                >
                  👩 Women
                </TabsTrigger>
                <TabsTrigger
                  value="Male"
                  className="text-xs px-3 py-1 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs active:scale-95 transition-transform"
                >
                  👨 Men
                </TabsTrigger>
                <TabsTrigger
                  value="All"
                  className="text-xs px-3 py-1 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs active:scale-95 transition-transform"
                >
                  ✨ All (सबै)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mode & Neo4j Graph Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
            {/* Matrimonial / Dating Switch */}
            <div className="flex items-center gap-1.5">
              <Switch
                id="mode-toggle"
                checked={useMatrimonialMode}
                onCheckedChange={setUseMatrimonialMode}
                className="scale-85"
              />
              <Label htmlFor="mode-toggle" className="text-xs font-semibold cursor-pointer">
                {useMatrimonialMode ? "💍 Matrimonial" : "🔥 Dating"}
              </Label>
            </div>

            {/* Neo4j Graph Topology Trigger */}
            <button
              type="button"
              onClick={() => {
                if (currentProfiles.length > 0) {
                  setSelectedCandidateForGraph(currentProfiles[0]);
                }
                setShowGraphModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/25 text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
              title="Inspect Neo4j compatibility topology"
            >
              <GitFork className="size-3 text-violet-500" />
              <span>Neo4j Topology</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN HALLWAY DISPLAY (Feed Scroll or Swipe Deck) */}
      <main className="w-full flex justify-center">
        {viewMode === "feed" ? (
          /* INSTAGRAM / TWITTER VERTICAL SCROLL FEED */
          <HallwayScrollFeed
            profiles={currentProfiles}
            currentUserId={currentUserId}
            isLoading={isLoading}
            isMatrimonialMode={useMatrimonialMode}
            onOpenGraphModal={handleOpenGraphModal}
            onRefreshFeed={() => fetchProfiles(selectedGender)}
            onLike={handleLike}
            onSuperLike={handleSuperLike}
            selectedGenderFilter={selectedGender}
          />
        ) : (
          /* TINDER SWIPE DECK VIEW */
          <div className="w-full flex justify-center">
            <TinderSwipeDeck
              key={deckKey}
              profiles={currentProfiles as Profile[]}
              isMatrimonialMode={useMatrimonialMode}
              onSwipeRight={handleLike}
              onSwipeLeft={handleSwipeLeft}
              onSuperLike={handleSuperLike}
              onResetStack={resetStack}
            />
          </div>
        )}
      </main>

      {/* 4. NEO4J COMPATIBILITY GRAPH MODAL */}
      <Neo4jCompatibilityModal
        open={showGraphModal}
        onOpenChange={setShowGraphModal}
        candidateName={selectedCandidateForGraph?.name || currentProfiles[0]?.name || "Your Match"}
        candidateId={selectedCandidateForGraph?.id || currentProfiles[0]?.id || "demo_user_match"}
      />
    </div>
  );
}
