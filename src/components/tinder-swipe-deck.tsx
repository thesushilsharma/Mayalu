"use client";

import { cn } from "cn";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Ghost,
  GraduationCap,
  Heart,
  Info,
  Lock,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  avatarUrl?: string;
  images: string[];
  interests: string[];
  occupation?: string;
  education?: string;
  distance: number;
  verified: boolean;
  dalBhatFrequency?: string;
  musicRepeat?: string;
  gotra?: string;
  caste?: string;
  relationshipIntent?: string;
  dietary?: string;
  promptQuestion?: string;
  promptAnswer?: string;
  isMutualMatch?: boolean;
  hasCandidateLikedYou?: boolean;
}

interface TinderSwipeDeckProps {
  profiles: Profile[];
  isMatrimonialMode?: boolean;
  onSwipeRight?: (profile: Profile) => void;
  onSwipeLeft?: (profile: Profile) => void;
  onSuperLike?: (profile: Profile) => void;
  onResetStack?: () => void;
  className?: string;
}

export function TinderSwipeDeck({
  profiles,
  isMatrimonialMode = false,
  onSwipeRight,
  onSwipeLeft,
  onSuperLike,
  onResetStack,
  className = "",
}: TinderSwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [history, setHistory] = React.useState<number[]>([]);
  const [selectedProfileForDetails, setSelectedProfileForDetails] =
    React.useState<Profile | null>(null);

  // Active Card Image Index
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Motion values for top card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Card physics transforms
  const rotate = useTransform(x, [-260, 0, 260], [-18, 0, 18]);
  const cardOpacity = useTransform(
    x,
    [-300, -220, 0, 220, 300],
    [0.6, 1, 1, 1, 0.6],
  );

  // Rubber-stamp overlays opacity and physical stamp scaling
  const likeStampOpacity = useTransform(x, [25, 110], [0, 1]);
  const likeStampScale = useTransform(x, [25, 110], [0.85, 1.05]);
  const nopeStampOpacity = useTransform(x, [-110, -25], [1, 0]);
  const nopeStampScale = useTransform(x, [-110, -25], [1.05, 0.85]);
  const superLikeStampOpacity = useTransform(y, [-110, -30], [1, 0]);
  const superLikeStampScale = useTransform(y, [-110, -30], [1.08, 0.85]);

  // Background card (#2) smooth parallax & scaling
  const nextCardScale = useTransform(x, [-200, 0, 200], [1, 0.94, 1]);
  const nextCardY = useTransform(x, [-200, 0, 200], [0, 14, 0]);
  const nextCardOpacity = useTransform(x, [-200, 0, 200], [1, 0.82, 1]);

  const [exitDirection, setExitDirection] = React.useState<
    "left" | "right" | "up" | null
  >(null);

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const hasMore = currentIndex < profiles.length;

  // Reset photo index when card changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentIndex trigger resets motion values per candidate card
  React.useEffect(() => {
    setCurrentImageIndex(0);
    x.set(0);
    y.set(0);
    setExitDirection(null);
  }, [currentIndex, x, y]);

  // Swipe execution helper
  const executeSwipe = React.useCallback(
    (direction: "left" | "right" | "up") => {
      if (!currentProfile) return;

      setExitDirection(direction);

      // Save to history for rewind
      setHistory((prev) => [...prev, currentIndex]);

      setTimeout(() => {
        if (direction === "right") {
          onSwipeRight?.(currentProfile);
          if (
            currentProfile.isMutualMatch ||
            currentProfile.hasCandidateLikedYou
          ) {
            toast.success(`It's a Match with ${currentProfile.name}! 💘`, {
              description:
                "Both of you said yes — Dhukuti unblurred exclusively for the two of you! 🔓",
            });
          } else {
            toast.info(`You said yes to ${currentProfile.name}! 💘`, {
              description:
                "Portrait sealed in Dhukuti until both connect yes (Mutual Match Required).",
            });
          }
        } else if (direction === "left") {
          onSwipeLeft?.(currentProfile);
        } else if (direction === "up") {
          onSuperLike?.(currentProfile);
          if (
            currentProfile.isMutualMatch ||
            currentProfile.hasCandidateLikedYou
          ) {
            toast.success(
              `It's a Match! 💫 Kura-Kani Sparked with ${currentProfile.name}!`,
              {
                description:
                  "Both of you said yes — Dhukuti unlocked exclusively for the two of you! 🔓",
              },
            );
          } else {
            toast.info(
              `High Priority Spark sent to ${currentProfile.name}! 💫`,
              {
                description:
                  "Portrait remains softly frosted in Dhukuti until both say yes.",
              },
            );
          }
        }
        setCurrentIndex((prev) => prev + 1);
      }, 200);
    },
    [currentProfile, currentIndex, onSwipeRight, onSwipeLeft, onSuperLike],
  );

  // Pan / Drag End handler with velocity flick detection
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 100;
    const velocityThreshold = 450;
    const projectedX = info.offset.x + info.velocity.x * 0.18;
    const projectedY = info.offset.y + info.velocity.y * 0.18;

    // Upwards Super Like
    if (info.offset.y < -120 || info.velocity.y < -velocityThreshold) {
      executeSwipe("up");
      return;
    }

    // Right Like
    if (projectedX > threshold || info.velocity.x > velocityThreshold) {
      executeSwipe("right");
      return;
    }

    // Left Pass
    if (projectedX < -threshold || info.velocity.x < -velocityThreshold) {
      executeSwipe("left");
      return;
    }
  };

  // Rewind / Undo
  const handleRewind = React.useCallback(() => {
    if (history.length === 0) {
      toast.info("No previous profile to rewind to");
      return;
    }
    const prevIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(prevIndex);
    toast.success("Rewound back to previous Chino ↺");
  }, [history]);

  // Tap to cycle photo
  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentProfile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const totalPhotos = currentProfile.images.length;

    if (tapX < rect.width * 0.35) {
      // Tap left -> Previous photo
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      // Tap right -> Next photo
      setCurrentImageIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProfileForDetails) return; // Don't trigger when sheet is open
      if (e.key === "ArrowLeft") {
        executeSwipe("left");
      } else if (e.key === "ArrowRight") {
        executeSwipe("right");
      } else if (e.key === "ArrowUp") {
        executeSwipe("up");
      } else if (e.key === "Backspace") {
        handleRewind();
      } else if (e.key === " " && currentProfile) {
        e.preventDefault();
        setCurrentImageIndex(
          (prev) => (prev + 1) % currentProfile.images.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProfileForDetails, currentProfile, executeSwipe, handleRewind]);

  return (
    <div
      className={`flex flex-col items-center w-full max-w-[420px] mx-auto select-none ${className}`}
    >
      {/* CARD STACK CONTAINER */}
      <div className="relative w-full h-[540px] sm:h-[580px]">
        {!hasMore ? (
          // Empty State: All caught up
          <div className="flex flex-col items-center justify-center h-full w-full rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md p-8 text-center shadow-xl space-y-4">
            <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Sparkles className="size-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">
                You&apos;re All Caught Up!
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
                Maya has delivered all currently active Chinos matching your
                criteria. Check back soon for fresh recommendations!
              </p>
            </div>
            <Button
              onClick={() => {
                setCurrentIndex(0);
                setHistory([]);
                onResetStack?.();
              }}
              className="rounded-full bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold px-6 gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <RotateCcw className="size-4" />
              <span>Reset Stack</span>
            </Button>
          </div>
        ) : (
          <>
            {/* BACKGROUND CARD (#2) */}
            {nextProfile && (
              <motion.div
                key={`bg-${nextProfile.id}`}
                className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden border border-border/70 bg-card shadow-lg shadow-black/5"
                style={{
                  scale: nextCardScale,
                  y: nextCardY,
                  opacity: nextCardOpacity,
                  zIndex: 1,
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={nextProfile.images[0] || "/placeholder.svg"}
                    alt={nextProfile.name}
                    fill
                    className={cn(
                      "object-cover bg-muted/50 filter brightness-[0.92] transition-all duration-500",
                      nextProfile.isMutualMatch
                        ? "blur-none"
                        : "blur-xl scale-105 filter saturate-150",
                    )}
                    sizes="(max-width: 640px) 100vw, 420px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center gap-2 text-xl font-bold">
                      <span>{nextProfile.name}</span>
                      <span className="text-rose-300 font-semibold">
                        {nextProfile.age}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-rose-400" />
                      <span>{nextProfile.location}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FOREGROUND CARD (#1) */}
            {currentProfile && (
              <motion.div
                key={`fg-${currentProfile.id}`}
                className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden border border-border/80 bg-card shadow-2xl shadow-black/15 dark:shadow-black/50"
                style={{
                  x,
                  y,
                  rotate,
                  opacity: cardOpacity,
                  zIndex: 2,
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.92}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 28 }}
                onDragEnd={handleDragEnd}
                animate={
                  exitDirection === "right"
                    ? { x: 800, rotate: 25, opacity: 0 }
                    : exitDirection === "left"
                      ? { x: -800, rotate: -25, opacity: 0 }
                      : exitDirection === "up"
                        ? { y: -800, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* PHOTO CONTAINER & STORY TAP HANDLER */}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: photo tap navigation */}
                {/* biome-ignore lint/a11y/useSemanticElements: photo tap container */}
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={handlePhotoTap}
                  role="button"
                  tabIndex={0}
                  aria-label="Tap left for previous image, tap right for next image"
                >
                  <Image
                    src={
                      currentProfile.images[currentImageIndex] ||
                      "/placeholder.svg"
                    }
                    alt={`${currentProfile.name} photo ${currentImageIndex + 1}`}
                    fill
                    className={cn(
                      "object-cover bg-muted/40 transition-all duration-700 ease-out",
                      currentProfile.isMutualMatch
                        ? "blur-none scale-100 filter-none"
                        : "blur-2xl scale-110 filter saturate-150 contrast-125",
                    )}
                    sizes="(max-width: 640px) 100vw, 420px"
                    priority
                    unoptimized
                  />

                  {/* The Mutual Unblur Protocol Dhukuti Badge */}
                  {!currentProfile.isMutualMatch && (
                    <div className="absolute bottom-28 inset-x-4 z-10 flex flex-col items-center pointer-events-none select-none">
                      <div className="px-3 py-1.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white shadow-xl flex items-center gap-1.5">
                        <Lock className="size-3.5 text-rose-400" />
                        <span className="text-[11px] font-bold">
                          The Mutual Unblur Protocol • ढुकुटी 🔒
                        </span>
                      </div>
                      <p className="text-[10px] text-white/85 mt-1 drop-shadow-md text-center max-w-[280px]">
                        Nobody sees your face until you both say yes. Swipe
                        right 💘 to connect!
                      </p>
                    </div>
                  )}

                  {/* TOP GRADIENT OVERLAY FOR STORY BARS & BADGES */}
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3.5 z-10 flex flex-col gap-2.5">
                    {/* Segmented Story Progress Pills */}
                    <div className="flex gap-1.5 w-full">
                      {currentProfile.images.map((_, idx) => (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: story indicators map 1:1 with photo array indexes
                          key={`story-bar-${idx}`}
                          className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                            idx === currentImageIndex
                              ? "bg-white shadow-xs"
                              : idx < currentImageIndex
                                ? "bg-white/70"
                                : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Top Row: Mode, Verification & Dhukuti Mutual Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isMatrimonialMode ? (
                          <Badge className="bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                            <span>💍 Matrimonial Chino</span>
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                            <Flame className="size-3 fill-white" />
                            <span>Dating Mode</span>
                          </Badge>
                        )}

                        {currentProfile.isMutualMatch ? (
                          <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                            <Sparkles className="size-3 fill-white" />
                            <span>Mutual Match 🔓</span>
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                            <Lock className="size-3" />
                            <span>Dhukuti Sealed 🔒</span>
                          </Badge>
                        )}
                      </div>

                      {currentProfile.verified ? (
                        <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                          <ShieldCheck className="size-3" />
                          <span>Maya Verified 🛡️</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-purple-600/90 text-white border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-md shadow-xs flex items-center gap-1">
                          <Ghost className="size-3" />
                          <span>Ghost Spectator 👻</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* STAMP OVERLAYS: LIKE (Right Drag) */}
                  <motion.div
                    className="absolute top-16 left-6 z-20 pointer-events-none origin-bottom-left"
                    style={{ opacity: likeStampOpacity, scale: likeStampScale }}
                  >
                    <div className="border-3.5 border-emerald-400 bg-emerald-500/20 backdrop-blur-md text-emerald-400 font-black text-2xl tracking-wider px-3.5 py-1 rounded-2xl rotate-[-15deg] shadow-lg shadow-emerald-500/30 uppercase">
                      LIKE 💘
                    </div>
                  </motion.div>

                  {/* STAMP OVERLAYS: NOPE (Left Drag) */}
                  <motion.div
                    className="absolute top-16 right-6 z-20 pointer-events-none origin-bottom-right"
                    style={{ opacity: nopeStampOpacity, scale: nopeStampScale }}
                  >
                    <div className="border-3.5 border-rose-500 bg-rose-500/20 backdrop-blur-md text-rose-400 font-black text-2xl tracking-wider px-3.5 py-1 rounded-2xl rotate-[15deg] shadow-lg shadow-rose-500/30 uppercase">
                      NOPE ✕
                    </div>
                  </motion.div>

                  {/* STAMP OVERLAYS: SUPER LIKE / KURA-KANI (Up Drag) */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none origin-center"
                    style={{
                      opacity: superLikeStampOpacity,
                      scale: superLikeStampScale,
                    }}
                  >
                    <div className="border-3.5 border-violet-400 bg-violet-600/30 backdrop-blur-md text-violet-300 font-black text-2xl tracking-wider px-4 py-1.5 rounded-2xl shadow-xl shadow-violet-500/40 uppercase flex items-center gap-2">
                      <Sparkles className="size-6 fill-violet-300" />
                      <span>KURA-KANI 💫</span>
                    </div>
                  </motion.div>

                  {/* BOTTOM PROFILE INFO OVERLAY (Full-bleed Scrim) */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-28 pb-5 px-5 text-white flex flex-col gap-2 z-10 pointer-events-auto">
                    {/* Header: Name, Age, Distance & Details Trigger */}
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight drop-shadow-md">
                          <span>{currentProfile.name}</span>
                          <span className="text-rose-400 font-semibold">
                            {currentProfile.age}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="size-3 text-rose-400 shrink-0" />
                          <span>{currentProfile.location}</span>
                          <span>•</span>
                          <span>{currentProfile.distance} km away</span>
                        </p>
                      </div>

                      {/* Info Button -> Opens Full Chino Sheet */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfileForDetails(currentProfile);
                        }}
                        className="size-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white active:scale-90 transition-transform shadow-md"
                        title="View Full Chino Details"
                      >
                        <Info className="size-4" />
                      </button>
                    </div>

                    {/* Career & Education */}
                    {(currentProfile.occupation ||
                      currentProfile.education) && (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/90">
                        {currentProfile.occupation && (
                          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                            <Briefcase className="size-3 text-white/70" />
                            <span>{currentProfile.occupation}</span>
                          </div>
                        )}
                        {currentProfile.education && (
                          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                            <GraduationCap className="size-3 text-white/70" />
                            <span>{currentProfile.education}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bio Snippet */}
                    {currentProfile.bio && (
                      <p className="text-xs text-white/90 line-clamp-2 leading-relaxed drop-shadow-xs">
                        &quot;{currentProfile.bio}&quot;
                      </p>
                    )}

                    {/* Mayalu Cultural Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {currentProfile.dalBhatFrequency && (
                        <Badge className="bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[10px] px-2 py-0">
                          🍚 {currentProfile.dalBhatFrequency}
                        </Badge>
                      )}
                      {isMatrimonialMode && currentProfile.gotra && (
                        <Badge className="bg-violet-500/20 text-violet-200 border border-violet-500/40 text-[10px] px-2 py-0">
                          🕉️ Gotra: {currentProfile.gotra}
                        </Badge>
                      )}
                      {currentProfile.interests.slice(0, 3).map((int) => (
                        <Badge
                          key={`int-${int}`}
                          variant="secondary"
                          className="bg-white/15 text-white/95 border-0 text-[10px] px-2 py-0 backdrop-blur-sm"
                        >
                          {int}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* FLOATING ACTION DOCK (External to card for true Apple-grade physics) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 py-2">
        {/* REWIND / UNDO */}
        <button
          type="button"
          onClick={handleRewind}
          disabled={history.length === 0}
          className="size-11 sm:size-12 rounded-full border border-amber-500/30 bg-background/90 text-amber-500 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-amber-500/10 shadow-md flex items-center justify-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none cursor-pointer"
          title="Rewind last swipe (Backspace)"
        >
          <RotateCcw className="size-4 sm:size-5" />
        </button>

        {/* PASS / NOPE */}
        <button
          type="button"
          onClick={() => executeSwipe("left")}
          disabled={!hasMore}
          className="size-14 sm:size-15 rounded-full border border-rose-500/40 bg-background/95 text-rose-500 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-rose-500/10 shadow-lg shadow-rose-500/15 flex items-center justify-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none cursor-pointer"
          title="Pass / Nope (Left Arrow)"
        >
          <X className="size-7 sm:size-8 stroke-[2.5]" />
        </button>

        {/* SUPER LIKE / KURA-KANI */}
        <button
          type="button"
          onClick={() => executeSwipe("up")}
          disabled={!hasMore}
          className="size-12 sm:size-13 rounded-full border border-violet-500/40 bg-gradient-to-tr from-violet-500/15 to-purple-500/15 text-violet-500 dark:text-violet-400 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-violet-500/20 shadow-md shadow-violet-500/20 flex items-center justify-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none cursor-pointer"
          title="Super Like / Kura-Kani (Up Arrow)"
        >
          <Star className="size-5 sm:size-6 fill-violet-500 text-violet-500" />
        </button>

        {/* LIKE / MATCH */}
        <button
          type="button"
          onClick={() => executeSwipe("right")}
          disabled={!hasMore}
          className="size-14 sm:size-15 rounded-full border border-emerald-500/40 bg-background/95 text-emerald-500 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-emerald-500/10 shadow-lg shadow-emerald-500/15 flex items-center justify-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none cursor-pointer"
          title="Like / Match (Right Arrow)"
        >
          <Heart className="size-7 sm:size-8 fill-emerald-500 text-emerald-500" />
        </button>

        {/* FULL CHINO DETAILS */}
        <button
          type="button"
          onClick={() =>
            currentProfile && setSelectedProfileForDetails(currentProfile)
          }
          disabled={!hasMore}
          className="size-11 sm:size-12 rounded-full border border-border/80 bg-background/90 text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted shadow-md flex items-center justify-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none cursor-pointer"
          title="View Full Profile Details"
        >
          <Info className="size-4 sm:size-5" />
        </button>
      </div>

      {/* DESKTOP KEYBOARD SHORTCUT HINTS */}
      <div className="hidden sm:flex items-center justify-center gap-2.5 mt-1 text-[11px] text-muted-foreground/60 select-none">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono">
            ←
          </kbd>{" "}
          Pass
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono">
            →
          </kbd>{" "}
          Like
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono">
            ↑
          </kbd>{" "}
          Super Like
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono">
            ⌫
          </kbd>{" "}
          Rewind
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono">
            Space
          </kbd>{" "}
          Photo
        </span>
      </div>

      {/* FULL CHINO PROFILE MODAL / SHEET OVERLAY */}
      <AnimatePresence>
        {selectedProfileForDetails && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overscroll-none">
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-lg max-h-[90dvh] bg-background border border-border/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    M
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">
                      Chino Identity Card
                    </h4>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      Mayalu Matchmaker Verified
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfileForDetails(null)}
                  className="size-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform shrink-0"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>

              {/* Scrollable Content with Safe Area Padding */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5 text-sm pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
                {/* Profile Hero Header */}
                <div className="flex items-center gap-3">
                  <div className="relative size-16 rounded-2xl overflow-hidden border border-border/60 bg-muted shrink-0">
                    <Image
                      src={
                        selectedProfileForDetails.avatarUrl &&
                        (selectedProfileForDetails.avatarUrl.includes(
                          "dicebear.com",
                        ) ||
                          selectedProfileForDetails.avatarUrl.startsWith(
                            "data:image/svg",
                          ))
                          ? selectedProfileForDetails.avatarUrl
                          : `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(
                              selectedProfileForDetails.name || "Mayalu",
                            )}`
                      }
                      alt={selectedProfileForDetails.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span>{selectedProfileForDetails.name}</span>
                      <span className="text-rose-500">
                        {selectedProfileForDetails.age}
                      </span>
                      {selectedProfileForDetails.verified && (
                        <ShieldCheck className="size-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-rose-500" />
                      <span>{selectedProfileForDetails.location}</span>
                      <span>•</span>
                      <span>{selectedProfileForDetails.distance} km away</span>
                    </p>
                  </div>
                </div>

                {/* Bio Block */}
                {selectedProfileForDetails.bio && (
                  <div className="bg-muted/40 p-3.5 rounded-2xl border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Bio
                    </span>
                    <p className="text-xs leading-relaxed text-foreground/90 italic">
                      &quot;{selectedProfileForDetails.bio}&quot;
                    </p>
                  </div>
                )}

                {/* Nepali Cultural Prompt (मयालु प्रसङ्ग) */}
                <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-violet-500/10 p-3.5 rounded-2xl border border-rose-500/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                      मयालु प्रसङ्ग
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Icebreaker
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    &quot;
                    {selectedProfileForDetails.promptQuestion ||
                      "My ideal Sunday in Kathmandu or diaspora..."}
                    &quot;
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                    {selectedProfileForDetails.promptAnswer ||
                      "Sipping hot chiya, listening to 90s Nepali acoustic classics, and discussing favorite trekking trails."}
                  </p>
                </div>

                {/* Lifestyle & Cultural Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30">
                    <span className="text-[10px] text-muted-foreground block">
                      Dal Bhat Routine
                    </span>
                    <span className="text-xs font-semibold text-amber-500">
                      🍚{" "}
                      {selectedProfileForDetails.dalBhatFrequency ||
                        "Twice a day (Hardcore)"}
                    </span>
                  </div>
                  <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30">
                    <span className="text-[10px] text-muted-foreground block">
                      On Repeat
                    </span>
                    <span className="text-xs font-semibold text-violet-500 truncate block">
                      🎵{" "}
                      {selectedProfileForDetails.musicRepeat ||
                        "Albatross / 1974 AD"}
                    </span>
                  </div>
                  {selectedProfileForDetails.gotra && (
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-muted-foreground block">
                        Gotra
                      </span>
                      <span className="text-xs font-semibold text-indigo-500">
                        🕉️ {selectedProfileForDetails.gotra}
                      </span>
                    </div>
                  )}
                  {selectedProfileForDetails.caste && (
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-muted-foreground block">
                        Caste / Heritage
                      </span>
                      <span className="text-xs font-semibold text-emerald-500">
                        🌱 {selectedProfileForDetails.caste}
                      </span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                    Interests & Passions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfileForDetails.interests.map((int) => (
                      <Badge
                        key={int}
                        variant="secondary"
                        className="text-xs px-2.5 py-1"
                      >
                        {int}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dhukuti Photo Guarantee Notice */}
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <Lock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug text-muted-foreground">
                    <strong className="text-foreground font-semibold">
                      Dhukuti Privacy Vault:{" "}
                    </strong>
                    Full showcase photos are unlocked only upon mutual match.
                    Your personal data is guarded by Maya.
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Bar inside Modal */}
              <div className="p-3 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prof = selectedProfileForDetails;
                    setSelectedProfileForDetails(null);
                    executeSwipe("left");
                  }}
                  className="flex-1 rounded-xl text-rose-500 border-rose-500/30 hover:bg-rose-500/10 gap-1.5 active:scale-98"
                >
                  <X className="size-4" />
                  <span>Pass</span>
                </Button>
                <Button
                  onClick={() => {
                    const prof = selectedProfileForDetails;
                    setSelectedProfileForDetails(null);
                    executeSwipe("right");
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-emerald-500 hover:from-rose-600 hover:to-emerald-600 text-white font-semibold gap-1.5 shadow-md active:scale-98"
                >
                  <Heart className="size-4 fill-white" />
                  <span>Connect & Match</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
