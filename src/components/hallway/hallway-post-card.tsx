"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Star,
  MessageCircle,
  Bookmark,
  MapPin,
  ShieldCheck,
  Lock,
  GitFork,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CandidateProfile } from "@/lib/neonDB/types";
import { recordGraphInteractionAction } from "@/lib/neo4j/neo4j.action";

interface HallwayPostCardProps {
  profile: CandidateProfile;
  currentUserId: string;
  onOpenGraphModal: (profile: CandidateProfile) => void;
  onLike?: (profile: CandidateProfile) => void;
  onSuperLike?: (profile: CandidateProfile) => void;
  isMatrimonialMode?: boolean;
}

export function HallwayPostCard({
  profile,
  currentUserId,
  onOpenGraphModal,
  onLike,
  onSuperLike,
  isMatrimonialMode = false,
}: HallwayPostCardProps) {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isSuperLiked, setIsSuperLiked] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [showHeartPop, setShowHeartPop] = React.useState(false);

  const images = profile.images && profile.images.length > 0 ? profile.images : ["/placeholder.svg"];
  const totalPhotos = images.length;
  const isDhukutiPhoto = photoIndex > 0; // 0 is main photo, 1+ are Dhukuti showcase photos

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // Double tap to like (Instagram style)
  const lastTapRef = React.useRef<number>(0);
  const handleImageTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      triggerLike();
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  const triggerLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike?.(profile);
      recordGraphInteractionAction(currentUserId, profile.id, "like").catch(() => {});
      toast.success(`Connected with ${profile.name}! 💘`, {
        description: "Shared affinity recorded in Neo4j knowledge graph.",
      });
    } else {
      setIsLiked(false);
      toast.info(`Unliked ${profile.name}`);
    }
  };

  const triggerSuperLike = () => {
    if (!isSuperLiked) {
      setIsSuperLiked(true);
      setIsLiked(true);
      onSuperLike?.(profile);
      recordGraphInteractionAction(currentUserId, profile.id, "superlike").catch(() => {});
      toast.success(`Kura-Kani Sparked with ${profile.name}! 💫`, {
        description: "High topological priority assigned in Neo4j.",
      });
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.info(!isSaved ? `Chino saved for ${profile.name} 🔖` : "Chino removed from saved");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Hallway profile link copied to clipboard! 📋");
    }
  };

  const harmonyScore = profile.neo4jHarmonyScore || 96.4;
  const sharedClusters = profile.sharedClusters && profile.sharedClusters.length > 0
    ? profile.sharedClusters
    : (profile.interests || []).slice(0, 3);

  return (
    <article className="w-full max-w-[540px] mx-auto bg-card border border-border/70 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* 1. POST HEADER (Instagram / Twitter style) */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-11 ring-2 ring-rose-500/30 ring-offset-2 ring-offset-background">
            <AvatarImage src={images[0]} alt={profile.name} className="object-cover" />
            <AvatarFallback className="bg-rose-500/10 text-rose-500 font-bold text-sm">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-base text-foreground tracking-tight truncate">
                {profile.name}
              </span>
              <span className="text-muted-foreground font-semibold text-sm tabular-nums">
                {profile.age}
              </span>
              {profile.verified && (
                <span title="Mayalu Verified Chino" className="inline-flex items-center">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                </span>
              )}
              {profile.gender && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 font-medium border-border/60 text-muted-foreground"
                >
                  {profile.gender}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              <MapPin className="size-3 text-rose-400 shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>•</span>
              <span className="shrink-0 tabular-nums">{profile.distance} km</span>
            </p>
          </div>
        </div>

        {/* Neo4j Compatibility Pill (Right Side Header) */}
        <button
          type="button"
          onClick={() => onOpenGraphModal(profile)}
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-rose-500/10 hover:from-violet-500/20 hover:to-rose-500/20 border border-violet-500/25 text-violet-600 dark:text-violet-400 font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0 touch-manipulation"
          title="Inspect Neo4j compatibility topology"
        >
          <GitFork className="size-3.5 text-violet-500 group-hover:rotate-12 transition-transform" />
          <span className="tabular-nums">{harmonyScore}%</span>
          <span className="hidden xs:inline text-[10px] text-muted-foreground font-normal">Graph</span>
        </button>
      </div>

      {/* 2. DHUKUTI MEDIA CAROUSEL (Instagram Post Canvas) */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Double tap to connect with ${profile.name}`}
        className="relative w-full aspect-[4/5] sm:aspect-[4/5] bg-muted/40 overflow-hidden select-none cursor-pointer group touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        onClick={handleImageTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleImageTap();
          }
        }}
      >
        <Image
          src={images[photoIndex] || "/placeholder.svg"}
          alt={`${profile.name} showcase`}
          fill
          sizes="(max-width: 640px) 100vw, 540px"
          className="object-cover transition-opacity duration-200"
          priority={photoIndex === 0}
          unoptimized
        />

        {/* Double-tap animated heart pop */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="size-24 fill-rose-500 text-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dhukuti Photo Indicator Pill */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-sm pointer-events-none tabular-nums">
          {isDhukutiPhoto ? (
            <>
              <Lock className="size-3 text-rose-400" />
              <span>Dhukuti 🔒</span>
            </>
          ) : (
            <span>Avatar</span>
          )}
          <span className="text-white/60">•</span>
          <span>{photoIndex + 1}/{totalPhotos}</span>
        </div>

        {/* Carousel Navigation Arrows: visible on mobile, hover-revealed on desktop */}
        {totalPhotos > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-[opacity,transform,background-color] duration-150 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 z-10 touch-manipulation cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-[opacity,transform,background-color] duration-150 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 z-10 touch-manipulation cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Photo Dots Indicator */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={`dot-${profile.id}-${i}`}
                  className={`size-1.5 rounded-full transition-all duration-200 ${
                    i === photoIndex ? "w-4 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. ACTION BAR (Instagram & Twitter style) */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-border/30">
        <div className="flex items-center gap-2">
          {/* Like / Connect Button */}
          <button
            type="button"
            onClick={triggerLike}
            className={`flex items-center justify-center size-9 rounded-full transition-transform active:scale-90 ${
              isLiked
                ? "text-rose-500 fill-rose-500 bg-rose-500/10"
                : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
            }`}
            title="Like Chino (Connect)"
          >
            <Heart className={`size-5 ${isLiked ? "fill-rose-500" : ""}`} />
          </button>

          {/* Super Like / Spark Button */}
          <button
            type="button"
            onClick={triggerSuperLike}
            className={`flex items-center justify-center size-9 rounded-full transition-transform active:scale-90 ${
              isSuperLiked
                ? "text-violet-500 fill-violet-500 bg-violet-500/10"
                : "text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10"
            }`}
            title="Super Like / Kura-Kani Spark"
          >
            <Star className={`size-5 ${isSuperLiked ? "fill-violet-500" : ""}`} />
          </button>

          {/* Chat / Message Button */}
          <Link
            href={`/account/messages?to=${profile.id}`}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-transform active:scale-90"
            title="Open Kura-Kani Chat"
          >
            <MessageCircle className="size-5" />
          </Link>

          {/* Neo4j Topology Trigger Button */}
          <button
            type="button"
            onClick={() => onOpenGraphModal(profile)}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 transition-transform active:scale-90"
            title="Inspect Neo4j compatibility graph"
          >
            <GitFork className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-transform active:scale-90"
            title="Share Profile"
          >
            <Share2 className="size-4" />
          </button>

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={toggleSave}
            className={`flex items-center justify-center size-9 rounded-full transition-transform active:scale-90 ${
              isSaved
                ? "text-amber-500 fill-amber-500 bg-amber-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            }`}
            title="Save Chino"
          >
            <Bookmark className={`size-4.5 ${isSaved ? "fill-amber-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4. POST CONTENT & STORYTELLING (Twitter / Instagram style) */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 text-sm">
        {/* Occupation & Education (if available) */}
        {(profile.occupation || profile.education) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {profile.occupation && (
              <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 font-medium">
                <Briefcase className="size-3 text-muted-foreground" />
                <span>{profile.occupation}</span>
              </span>
            )}
            {profile.education && (
              <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 font-medium">
                <GraduationCap className="size-3 text-muted-foreground" />
                <span>{profile.education}</span>
              </span>
            )}
          </div>
        )}

        {/* Bio Snippet */}
        {profile.bio && (
          <p className="text-foreground/90 leading-relaxed text-sm">
            &ldquo;{profile.bio}&rdquo;
          </p>
        )}

        {/* Mayalu Cultural & Chino Identity Badges */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.dalBhatFrequency && (
            <Badge variant="outline" className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium">
              🍚 {profile.dalBhatFrequency}
            </Badge>
          )}
          {isMatrimonialMode && profile.gotra && (
            <Badge variant="outline" className="text-[11px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 font-medium">
              🕉️ Gotra: {profile.gotra}
            </Badge>
          )}
          {isMatrimonialMode && profile.caste && (
            <Badge variant="outline" className="text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium">
              🏛️ {profile.caste}
            </Badge>
          )}
          {profile.musicRepeat && (
            <Badge variant="outline" className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium">
              🎵 {profile.musicRepeat}
            </Badge>
          )}
          {profile.relationshipIntent && (
            <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
              💍 {profile.relationshipIntent}
            </Badge>
          )}
        </div>

        {/* Mayalu Prompt Card */}
        {profile.promptQuestion && profile.promptAnswer && (
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-xs flex flex-col gap-1">
            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
              {profile.promptQuestion}
            </span>
            <p className="text-foreground italic text-xs leading-relaxed">
              &ldquo;{profile.promptAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Neo4j Topological Compatibility & Interlocking Clusters */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-rose-500/5 border border-violet-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
            <span className="flex items-center gap-1.5">
              <GitFork className="size-3.5" />
              Neo4j Bridge • {harmonyScore}% Harmony
            </span>
            <button
              type="button"
              onClick={() => onOpenGraphModal(profile)}
              className="text-[10px] text-violet-500 hover:underline font-medium cursor-pointer"
            >
              View 3D Topology →
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sharedClusters.map((cluster) => (
              <Badge
                key={`cluster-${profile.id}-${cluster}`}
                variant="secondary"
                className="bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/25 text-[10px] px-2 py-0.5"
              >
                🔗 {cluster}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
