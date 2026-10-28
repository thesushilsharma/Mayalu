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

  // The Mutual Unblur Protocol:
  // "Nobody sees your face until you both say yes.
  // Your portrait remains softly frosted and sealed inside our digital Dhukuti until both of you tap 💘.
  // Then, and only then, does your photo unblur exclusively for the two of you."
  const [candidateHasSaidYes, setCandidateHasSaidYes] = React.useState<boolean>(
    Boolean(profile.isMutualMatch || profile.hasCandidateLikedYou),
  );
  const [isResealedInDhukuti, setIsResealedInDhukuti] =
    React.useState<boolean>(false);

  // User has said yes (tapped connect or superlike)
  const userHasSaidYes = isLiked || isSuperLiked;

  // It's a match when BOTH connect yes (or if profile is already an established mutual match)
  const isMutualMatch =
    (userHasSaidYes || Boolean(profile.isMutualMatch)) && candidateHasSaidYes;

  // ONLY unblur if both connect yes (it's a match), and not explicitly re-sealed
  const isPhotoRevealed = Boolean(isMutualMatch && !isResealedInDhukuti);

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
      setIsResealedInDhukuti(false);
      onLike?.(profile);
      recordGraphInteractionAction(currentUserId, profile.id, "like").catch(
        () => {},
      );

      if (candidateHasSaidYes) {
        // Both say yes! It's a match!
        toast.success(`It's a Match with ${profile.name}! 💘`, {
          description:
            "Both of you said yes — Dhukuti unblurred exclusively for the two of you! 🔓",
        });
      } else {
        // Only one side has connected yes
        toast.info(`You said yes to ${profile.name}! 💘`, {
          description:
            "Portrait remains sealed in Dhukuti until both connect yes (Mutual Match Required).",
        });
      }
    } else {
      setIsLiked(false);
      setIsSuperLiked(false);
      toast.info(
        `Connection withdrawn • ${profile.name} re-sealed in Dhukuti 🔒`,
      );
    }
  };

  const triggerSuperLike = () => {
    if (!isSuperLiked) {
      setIsSuperLiked(true);
      setIsLiked(true);
      setIsResealedInDhukuti(false);
      onSuperLike?.(profile);
      recordGraphInteractionAction(
        currentUserId,
        profile.id,
        "superlike",
      ).catch(() => {});

      if (candidateHasSaidYes) {
        toast.success(
          `It's a Match! 💫 Kura-Kani Sparked with ${profile.name}!`,
          {
            description:
              "Both of you said yes — Dhukuti unlocked exclusively for the two of you! 🔓",
          },
        );
      } else {
        toast.info(`High Priority Spark sent to ${profile.name}! 💫`, {
          description:
            "Dhukuti keeps portrait frosted until both of you connect yes.",
        });
      }
    }
  };

  const triggerSimulateCandidateYes = () => {
    setCandidateHasSaidYes(true);
    setIsLiked(true);
    setIsResealedInDhukuti(false);
    onLike?.(profile);
    recordGraphInteractionAction(currentUserId, profile.id, "like").catch(
      () => {},
    );
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
    toast.success(`It's a Match with ${profile.name}! 💘`, {
      description:
        "Both of you tapped yes! Dhukuti unblurred exclusively for the two of you. 🔓",
    });
  };

  const toggleDhukutiSeal = () => {
    if (isMutualMatch) {
      setIsResealedInDhukuti((prev) => !prev);
      toast.info(
        !isResealedInDhukuti
          ? `Portrait re-sealed in Dhukuti for privacy 🔒`
          : `Dhukuti unlocked • Mutual match restored 🔓`,
      );
    } else if (userHasSaidYes) {
      toast.info("The Mutual Unblur Protocol 🔒", {
        description: `Waiting for ${profile.name} to tap yes back. Nobody sees your face until you both say yes!`,
      });
    } else {
      toast.info("The Mutual Unblur Protocol 🔒", {
        description:
          "Your portrait remains softly frosted in Dhukuti until both of you tap 💘.",
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
      {/* 1. POST HEADER (Clean & Minimal) */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-10 ring-1 ring-border/60">
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
              <span className="font-semibold text-base text-foreground tracking-tight truncate apple-headline">
                {profile.name}
              </span>
              <span className="text-muted-foreground font-medium text-sm tabular-nums">
                {profile.age}
              </span>
              {profile.verified && (
                <span
                  title="Mayalu Verified Chino"
                  className="inline-flex items-center"
                >
                  <ShieldCheck className="size-3.5 text-emerald-500 shrink-0 fill-emerald-500/20" />
                </span>
              )}
              {profile.gender && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 font-normal border-border/60 text-muted-foreground"
                >
                  {profile.gender}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              <MapPin className="size-3 text-rose-400 shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>•</span>
              <span className="shrink-0 tabular-nums">
                {profile.distance} km
              </span>
            </p>
          </div>
        </div>

        {/* Neo4j Compatibility Pill (Header) */}
        <button
          type="button"
          onClick={() => onOpenGraphModal(profile)}
          className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-semibold text-xs transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] cursor-pointer shadow-2xs shrink-0 select-none touch-manipulation"
          title="Inspect Neo4j compatibility topology"
        >
          <GitFork className="size-3.5 text-violet-500 group-hover:rotate-12 transition-transform duration-200" />
          <span className="tabular-nums">{harmonyScore}%</span>
          <span className="hidden xs:inline text-[10px] text-muted-foreground font-normal">
            Harmony
          </span>
        </button>
      </div>

      {/* 2. DHUKUTI MEDIA CAROUSEL (Atmospheric & Frosted Canvas) */}
      {/* biome-ignore lint/a11y/useSemanticElements: interactive media container with nested action buttons requires div */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Double tap to connect with ${profile.name}`}
        className="relative w-full aspect-[4/5] bg-muted/40 overflow-hidden select-none cursor-pointer group touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
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
              : "blur-2xl scale-105 filter saturate-150 contrast-125",
          )}
          priority={photoIndex === 0}
          unoptimized
        />

        {/* Ambient Dark Vignette overlay when sealed for readability */}
        {!isPhotoRevealed && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 pointer-events-none" />
        )}

        {/* Story Segment Bars at top */}
        {totalPhotos > 1 && (
          <div className="absolute top-2.5 inset-x-3 z-20 flex gap-1 pointer-events-none">
            {images.map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: story indicators map to photo index
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-200",
                  i === photoIndex ? "bg-white shadow-xs" : "bg-white/30",
                )}
              />
            ))}
          </div>
        )}

        {/* Double-tap animated heart pop */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 14, stiffness: 260 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="size-24 fill-rose-500 text-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top-Right Status & Counter Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleDhukutiSeal();
          }}
          className="absolute top-5 right-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-sm active:scale-[0.95] transition-all duration-150 tabular-nums cursor-pointer"
          title="Mutual Unblur Protocol • Tap for status"
        >
          {isPhotoRevealed ? (
            <>
              <Sparkles className="size-3 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                It&apos;s a Match 🔓
              </span>
            </>
          ) : userHasSaidYes ? (
            <>
              <span className="text-amber-400">⏳</span>
              <span className="text-amber-300">Pending Match</span>
            </>
          ) : (
            <>
              <Lock className="size-3 text-rose-400" />
              <span>Dhukuti Sealed</span>
            </>
          )}
          <span className="text-white/40">•</span>
          <span>
            {photoIndex + 1}/{totalPhotos}
          </span>
        </button>

        {/* Top-Left Mutual Match Celebration Pill */}
        {isPhotoRevealed && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-bold shadow-lg shadow-emerald-500/25 pointer-events-none"
          >
            <Sparkles className="size-3.5 fill-white" />
            <span>Mutual Match 🔓</span>
          </motion.div>
        )}

        {/* Center Frosted Glass Dhukuti Sanctuary Card (Translucent & Apple-style) */}
        {!isPhotoRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-15 select-none pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center max-w-[285px] w-full p-5 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 text-white shadow-2xl space-y-3"
            >
              {/* Glowing Privacy Vault Disc */}
              <div className="relative">
                <div
                  className={cn(
                    "size-12 rounded-full border flex items-center justify-center shadow-inner transition-colors duration-200",
                    userHasSaidYes
                      ? "bg-amber-500/15 border-amber-500/35 text-amber-400"
                      : "bg-rose-500/15 border-rose-500/35 text-rose-400",
                  )}
                >
                  {userHasSaidYes ? (
                    <Heart className="size-6 fill-rose-500 text-rose-500 animate-pulse" />
                  ) : (
                    <Lock className="size-5.5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Protocol Headline & Crisp Copy */}
              <div className="space-y-1">
                <h4 className="text-[13px] font-semibold text-white tracking-tight leading-snug">
                  {userHasSaidYes
                    ? "You said yes! 💘"
                    : "Nobody sees your face until you both say yes"}
                </h4>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  {userHasSaidYes
                    ? `Waiting for ${profile.name} to connect back. Photos unblur on mutual match.`
                    : `Sealed in Dhukuti. Tap 💘 to connect — unblurs exclusively when both match!`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 pt-0.5">
                {!userHasSaidYes ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerLike();
                      setShowHeartPop(true);
                      setTimeout(() => setShowHeartPop(false), 900);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-md shadow-rose-500/25 active:scale-[0.97] transition-transform duration-150 ease-out flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                  >
                    <Heart className="size-3.5 fill-white" />
                    <span>Connect 💘 (Say Yes)</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerSimulateCandidateYes();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 font-semibold text-xs active:scale-[0.97] transition-all duration-150 ease-out flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                    >
                      <Sparkles className="size-3.5 text-emerald-400" />
                      <span>Test Mutual Match 💘</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerLike();
                      }}
                      className="text-[10px] text-white/60 hover:text-white underline underline-offset-2 transition-colors cursor-pointer block mx-auto pt-0.5"
                    >
                      Withdraw Request
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Carousel Navigation Arrows: hover-revealed on desktop */}
        {totalPhotos > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all duration-150 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-[0.95] z-20 touch-manipulation cursor-pointer select-none"
              title="Previous photo"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all duration-150 ease-out opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-[0.95] z-20 touch-manipulation cursor-pointer select-none"
              title="Next photo"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* 3. ACTION BAR (Clean 4-Action Layout) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <div className="flex items-center gap-1.5">
          {/* Like / Connect Button */}
          <button
            type="button"
            onClick={triggerLike}
            className={`flex items-center justify-center size-9.5 rounded-full transition-all duration-150 ease-out active:scale-[0.90] touch-manipulation select-none cursor-pointer ${
              isLiked
                ? "text-rose-500 fill-rose-500 bg-rose-500/10 scale-105"
                : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
            }`}
            title="Connect 💘"
          >
            <Heart className={`size-5 ${isLiked ? "fill-rose-500" : ""}`} />
          </button>

          {/* Super Like / Spark Button */}
          <button
            type="button"
            onClick={triggerSuperLike}
            className={`flex items-center justify-center size-9.5 rounded-full transition-all duration-150 ease-out active:scale-[0.90] touch-manipulation select-none cursor-pointer ${
              isSuperLiked
                ? "text-violet-500 fill-violet-500 bg-violet-500/10 scale-105"
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
            className="flex items-center justify-center size-9.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150 ease-out active:scale-[0.90] touch-manipulation select-none"
            title="Open Kura-Kani Chat"
          >
            <MessageCircle className="size-5" />
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center size-9.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150 ease-out active:scale-[0.90] touch-manipulation select-none cursor-pointer"
            title="Share Profile"
          >
            <Share2 className="size-4" />
          </button>

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={toggleSave}
            className={`flex items-center justify-center size-9.5 rounded-full transition-all duration-150 ease-out active:scale-[0.90] touch-manipulation select-none cursor-pointer ${
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

      {/* Mutual Match Banner with Direct Kura-Kani Chat CTA */}
      {isMutualMatch && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="size-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate">
              Mutual Match! Dhukuti unlocked 🔓
            </span>
          </div>
          <Link
            href={`/account/messages?to=${profile.id}`}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs shrink-0 active:scale-95 transition-transform shadow-xs flex items-center gap-1"
          >
            <span>Chat 💌</span>
          </Link>
        </div>
      )}

      {/* 4. POST CONTENT & STORYTELLING (De-cluttered & Airy) */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 text-sm">
        {/* Occupation & Education (Inline & Subtle) */}
        {(profile.occupation || profile.education) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {profile.occupation && (
              <span className="flex items-center gap-1 font-medium text-foreground/80">
                <Briefcase className="size-3 text-muted-foreground/80 shrink-0" />
                <span>{profile.occupation}</span>
              </span>
            )}
            {profile.occupation && profile.education && (
              <span className="text-muted-foreground/40">•</span>
            )}
            {profile.education && (
              <span className="flex items-center gap-1 font-medium text-foreground/80">
                <GraduationCap className="size-3 text-muted-foreground/80 shrink-0" />
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

        {/* Cultural & Lifestyle Anchors (Clean Micro-chips) */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.dalBhatFrequency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <span>🍚</span>
              <span>{profile.dalBhatFrequency}</span>
            </span>
          )}
          {profile.musicRepeat && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
              <span>🎵</span>
              <span className="truncate max-w-[200px]">
                {profile.musicRepeat}
              </span>
            </span>
          )}
          {profile.relationshipIntent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span>💍</span>
              <span>{profile.relationshipIntent}</span>
            </span>
          )}
          {isMatrimonialMode && profile.gotra && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
              <span>🕉️ Gotra: {profile.gotra}</span>
            </span>
          )}
          {isMatrimonialMode && profile.caste && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
              <span>🏛️ {profile.caste}</span>
            </span>
          )}
        </div>

        {/* Mayalu Prompt Card (Editorial Left-Accent) */}
        {profile.promptQuestion && profile.promptAnswer && (
          <div className="relative pl-3.5 py-2 border-l-2 border-rose-400/40 bg-gradient-to-r from-rose-500/[0.04] to-transparent rounded-r-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
              {profile.promptQuestion}
            </span>
            <p className="text-xs text-foreground/90 font-medium leading-relaxed">
              &ldquo;{profile.promptAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Neo4j Compatibility Bridge (Clean & Unboxed) */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5 text-foreground/80 font-semibold">
              <GitFork className="size-3.5 text-violet-500" />
              <span>Topological Bridge</span>
              <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold tabular-nums">
                ({harmonyScore}%)
              </span>
            </span>
            <button
              type="button"
              onClick={() => onOpenGraphModal(profile)}
              className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline font-medium cursor-pointer active:scale-[0.97] transition-all touch-manipulation"
            >
              View 3D Graph →
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sharedClusters.map((cluster) => (
              <span
                key={`cluster-${profile.id}-${cluster}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-muted/60 hover:bg-muted text-foreground/80 border border-border/50 transition-colors"
              >
                <span className="size-1.5 rounded-full bg-violet-500" />
                <span>{cluster}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
