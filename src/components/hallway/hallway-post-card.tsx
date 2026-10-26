"use client";

import { cn } from "cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GitFork,
  GraduationCap,
  Heart,
  Lock,
  LockOpen,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { recordGraphInteractionAction } from "@/lib/neo4j/neo4j.action";
import type { CandidateProfile } from "@/lib/neonDB/types";

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
  const [isManuallyUnblurred, setIsManuallyUnblurred] = React.useState(false);

  // Photos are protected and frosted in Dhukuti until connected (Like / Super Like) or manually unblurred
  const isPhotoRevealed = isLiked || isSuperLiked || isManuallyUnblurred;

  // Dedicated public DiceBear avatar URL
  const candidateAvatar =
    typeof profile.avatarUrl === "string" &&
    (profile.avatarUrl.includes("dicebear.com") ||
      profile.avatarUrl.startsWith("data:image/svg"))
      ? profile.avatarUrl
      : `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(
          profile.name || "Mayalu",
        )}`;

  const images =
    profile.images && profile.images.length > 0
      ? profile.images
      : ["/placeholder.svg"];
  const totalPhotos = images.length;

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
      setIsManuallyUnblurred(true);
      onLike?.(profile);
      recordGraphInteractionAction(currentUserId, profile.id, "like").catch(
        () => {},
      );
      toast.success(`Connected with ${profile.name}! 💘`, {
        description:
          "Shared affinity recorded in Neo4j • Dhukuti unblurred! 🔓",
      });
    } else {
      setIsLiked(false);
      setIsManuallyUnblurred(false);
      toast.info(`Unliked ${profile.name} • Re-sealed in Dhukuti 🔒`);
    }
  };

  const triggerSuperLike = () => {
    if (!isSuperLiked) {
      setIsSuperLiked(true);
      setIsLiked(true);
      setIsManuallyUnblurred(true);
      onSuperLike?.(profile);
      recordGraphInteractionAction(
        currentUserId,
        profile.id,
        "superlike",
      ).catch(() => {});
      toast.success(`Kura-Kani Sparked with ${profile.name}! 💫`, {
        description:
          "High topological priority assigned in Neo4j • Dhukuti unlocked! 🔓",
      });
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.info(
      !isSaved
        ? `Chino saved for ${profile.name} 🔖`
        : "Chino removed from saved",
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Hallway profile link copied to clipboard! 📋");
    }
  };

  const harmonyScore = profile.neo4jHarmonyScore || 96.4;
  const sharedClusters =
    profile.sharedClusters && profile.sharedClusters.length > 0
      ? profile.sharedClusters
      : (profile.interests || []).slice(0, 3);

  return (
    <article className="w-full max-w-[540px] mx-auto bg-card/95 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03),0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200">
      {/* 1. POST HEADER (Instagram / Twitter style) */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-11 ring-2 ring-rose-500/30 ring-offset-2 ring-offset-background">
            <AvatarImage
              src={candidateAvatar}
              alt={profile.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-rose-500/10 text-rose-500 font-bold text-sm">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-base text-foreground tracking-tight truncate apple-headline">
                {profile.name}
              </span>
              <span className="text-muted-foreground font-semibold text-sm tabular-nums apple-caption">
                {profile.age}
              </span>
              {profile.verified && (
                <span
                  title="Mayalu Verified Chino"
                  className="inline-flex items-center"
                >
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                </span>
              )}
              {profile.gender && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 font-medium border-border/60 text-muted-foreground apple-caption"
                >
                  {profile.gender}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate apple-caption">
              <MapPin className="size-3 text-rose-400 shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>•</span>
              <span className="shrink-0 tabular-nums">
                {profile.distance} km
              </span>
            </p>
          </div>
        </div>

        {/* Neo4j Compatibility Pill (Right Side Header) */}
        <button
          type="button"
          onClick={() => onOpenGraphModal(profile)}
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-rose-500/10 hover:from-violet-500/20 hover:to-rose-500/20 border border-violet-500/25 text-violet-600 dark:text-violet-400 font-semibold text-xs transition-[transform,background-color] duration-100 ease-out active:scale-[0.97] cursor-pointer shadow-2xs shrink-0 touch-manipulation select-none"
          title="Inspect Neo4j compatibility topology"
        >
          <GitFork className="size-3.5 text-violet-500 group-hover:rotate-12 transition-transform" />
          <span className="tabular-nums">{harmonyScore}%</span>
          <span className="hidden xs:inline text-[10px] text-muted-foreground font-normal">
            Graph
          </span>
        </button>
      </div>

      {/* 2. DHUKUTI MEDIA CAROUSEL (Instagram Post Canvas) */}
      {/* biome-ignore lint/a11y/useSemanticElements: interactive media container with nested action buttons requires div */}
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
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isPhotoRevealed
              ? "blur-none scale-100 filter-none"
              : "blur-2xl scale-110 filter saturate-150 contrast-125",
          )}
          priority={photoIndex === 0}
          unoptimized
        />

        {/* Double-tap animated heart pop */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 14, stiffness: 260 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="size-24 fill-rose-500 text-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dhukuti Frosted Glass Privacy Overlay (Sealed by Default) */}
        {!isPhotoRevealed && (
          <div className="absolute inset-0 bg-background/25 dark:bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-15 select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center max-w-[280px] p-5 rounded-3xl bg-card/90 dark:bg-card/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl space-y-3"
            >
              <div className="relative">
                <div className="size-13 rounded-2xl bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-violet-500/20 border border-rose-500/30 flex items-center justify-center shadow-inner">
                  <Lock className="size-6 text-rose-500" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm font-bold text-foreground tracking-tight apple-headline">
                    Photo Sealed in Dhukuti
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 normal-case tracking-normal"
                  >
                    ढुकुटी 🔒
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Dhukuti Privacy Vault guards authentic member photos. Tap 💘
                  to connect and unblur {profile.name}&apos;s photos.
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerLike();
                  setShowHeartPop(true);
                  setTimeout(() => setShowHeartPop(false), 900);
                }}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-[0.97] transition-transform duration-100 ease-out flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
              >
                <Heart className="size-3.5 fill-white text-white" />
                <span>Connect 💘 to Reveal</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Unlocked status pill in top left */}
        {isPhotoRevealed && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md shadow-emerald-500/20 pointer-events-none"
          >
            <Sparkles className="size-3 fill-white" />
            <span>Dhukuti Unlocked 🔓</span>
          </motion.div>
        )}

        {/* Dhukuti Photo Indicator Pill (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-sm pointer-events-none tabular-nums">
          {isPhotoRevealed ? (
            <>
              <Sparkles className="size-3 text-emerald-400" />
              <span className="text-emerald-300">Unlocked</span>
            </>
          ) : (
            <>
              <Lock className="size-3 text-rose-400" />
              <span>Dhukuti 🔒</span>
            </>
          )}
          <span className="text-white/60">•</span>
          <span>
            {photoIndex + 1}/{totalPhotos}
          </span>
        </div>

        {/* Carousel Navigation Arrows: visible on mobile, hover-revealed on desktop */}
        {totalPhotos > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-[opacity,transform,background-color] duration-100 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-[0.97] z-10 touch-manipulation cursor-pointer select-none"
              title="Previous photo"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-[opacity,transform,background-color] duration-100 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-[0.97] z-10 touch-manipulation cursor-pointer select-none"
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
            className={`flex items-center justify-center size-9 rounded-full transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none ${
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
            className={`flex items-center justify-center size-9 rounded-full transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none ${
              isSuperLiked
                ? "text-violet-500 fill-violet-500 bg-violet-500/10"
                : "text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10"
            }`}
            title="Super Like / Kura-Kani Spark"
          >
            <Star
              className={`size-5 ${isSuperLiked ? "fill-violet-500" : ""}`}
            />
          </button>

          {/* Chat / Message Button */}
          <Link
            href={`/account/messages?to=${profile.id}`}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none"
            title="Open Kura-Kani Chat"
          >
            <MessageCircle className="size-5" />
          </Link>

          {/* Neo4j Topology Trigger Button */}
          <button
            type="button"
            onClick={() => onOpenGraphModal(profile)}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none"
            title="Inspect Neo4j compatibility graph"
          >
            <GitFork className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Dhukuti Seal / Unblur Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsManuallyUnblurred((prev) => !prev);
              toast.info(
                !isPhotoRevealed
                  ? `Dhukuti unsealed for ${profile.name} 🔓`
                  : `Photo re-sealed in Dhukuti 🔒`,
              );
            }}
            className={`flex items-center justify-center size-9 rounded-full transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none ${
              isPhotoRevealed
                ? "text-emerald-500 hover:bg-emerald-500/10"
                : "text-rose-500 hover:bg-rose-500/10"
            }`}
            title={
              isPhotoRevealed
                ? "Re-seal in Dhukuti (Blur)"
                : "Unblur Dhukuti Photo"
            }
          >
            {isPhotoRevealed ? (
              <LockOpen className="size-4.5" />
            ) : (
              <Lock className="size-4.5" />
            )}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none"
            title="Share Profile"
          >
            <Share2 className="size-4" />
          </button>

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={toggleSave}
            className={`flex items-center justify-center size-9 rounded-full transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] touch-manipulation select-none ${
              isSaved
                ? "text-amber-500 fill-amber-500 bg-amber-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            }`}
            title="Save Chino"
          >
            <Bookmark
              className={`size-4.5 ${isSaved ? "fill-amber-500" : ""}`}
            />
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
            <Badge
              variant="outline"
              className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium"
            >
              🍚 {profile.dalBhatFrequency}
            </Badge>
          )}
          {isMatrimonialMode && profile.gotra && (
            <Badge
              variant="outline"
              className="text-[11px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 font-medium"
            >
              🕉️ Gotra: {profile.gotra}
            </Badge>
          )}
          {isMatrimonialMode && profile.caste && (
            <Badge
              variant="outline"
              className="text-[11px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium"
            >
              🏛️ {profile.caste}
            </Badge>
          )}
          {profile.musicRepeat && (
            <Badge
              variant="outline"
              className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium"
            >
              🎵 {profile.musicRepeat}
            </Badge>
          )}
          {profile.relationshipIntent && (
            <Badge
              variant="outline"
              className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
            >
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
              className="text-[10px] text-violet-500 hover:underline font-medium cursor-pointer active:scale-[0.97] transition-transform duration-100 ease-out touch-manipulation select-none"
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
