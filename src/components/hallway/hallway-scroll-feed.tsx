"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HallwayPostCard } from "./hallway-post-card";
import type { CandidateProfile } from "@/lib/neonDB/types";

interface HallwayScrollFeedProps {
  profiles: CandidateProfile[];
  currentUserId: string;
  isLoading: boolean;
  isMatrimonialMode?: boolean;
  onOpenGraphModal: (profile: CandidateProfile) => void;
  onRefreshFeed: () => void;
  onLike?: (profile: CandidateProfile) => void;
  onSuperLike?: (profile: CandidateProfile) => void;
  selectedGenderFilter?: string;
}

export function HallwayScrollFeed({
  profiles,
  currentUserId,
  isLoading,
  isMatrimonialMode = false,
  onOpenGraphModal,
  onRefreshFeed,
  onLike,
  onSuperLike,
  selectedGenderFilter = "All",
}: HallwayScrollFeedProps) {
  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 items-center">
        {[1, 2].map((n) => (
          <div
            key={`skeleton-${n}`}
            className="w-full max-w-[540px] bg-card border border-border/70 rounded-3xl overflow-hidden shadow-xs p-4 flex flex-col gap-4"
          >
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            {/* Media canvas skeleton */}
            <Skeleton className="w-full aspect-[4/5] rounded-2xl" />

            {/* Action bar skeleton */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
              </div>
              <Skeleton className="size-8 rounded-full" />
            </div>

            {/* Content skeleton */}
            <div className="flex flex-col gap-2 pt-1">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="w-full max-w-[540px] mx-auto bg-card border border-border/70 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-4 shadow-sm">
        <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <Users className="size-8" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-[320px]">
          <h3 className="text-lg font-bold text-foreground">
            No {selectedGenderFilter !== "All" ? selectedGenderFilter : ""} Chinos Found
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            There are no profiles currently matching your gender preference. Try switching to &quot;Everyone (सबै)&quot; or check back shortly!
          </p>
        </div>
        <Button
          onClick={onRefreshFeed}
          variant="outline"
          className="rounded-full gap-2 text-xs font-semibold active:scale-95 transition-transform"
        >
          <RotateCcw className="size-3.5" />
          <span>Refresh Hallway Feed</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      {/* Feed Cards with staggered entrance */}
      {profiles.map((profile, index) => (
        <motion.div
          key={`post-${profile.id}`}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.28,
            delay: Math.min(index * 0.05, 0.35),
            ease: [0.23, 1, 0.32, 1], // Emil-design-eng custom ease-out curve
          }}
          className="w-full flex justify-center"
        >
          <HallwayPostCard
            profile={profile}
            currentUserId={currentUserId}
            onOpenGraphModal={onOpenGraphModal}
            onLike={onLike}
            onSuperLike={onSuperLike}
            isMatrimonialMode={isMatrimonialMode}
          />
        </motion.div>
      ))}

      {/* End of Feed / Caught Up Footer */}
      <div className="w-full max-w-[540px] mx-auto bg-gradient-to-b from-card/80 to-card/40 border border-border/60 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-3.5 my-2 shadow-2xs">
        <div className="size-12 rounded-full bg-gradient-to-tr from-rose-500/15 via-violet-500/15 to-emerald-500/15 border border-rose-500/25 flex items-center justify-center text-rose-500">
          <Sparkles className="size-6 text-rose-500 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1 max-w-[320px]">
          <h4 className="text-base font-bold text-foreground">
            You&apos;re All Caught Up on Mayalu!
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Maya has surfaced all verified candidate Chinos for this selection. Connect with your matches in Kura-Kani!
          </p>
        </div>
        <Button
          onClick={onRefreshFeed}
          className="rounded-full bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold text-xs px-5 gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Refresh Hallway Feed</span>
        </Button>
      </div>
    </div>
  );
}
