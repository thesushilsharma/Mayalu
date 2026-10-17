"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Ghost,
  Camera,
  Heart,
  MapPin,
  Briefcase,
  Flame,
  Edit3,
  CheckCircle2,
  Lock,
  Coffee,
  Utensils,
  Music,
  Compass,
  UserCheck,
  SlidersHorizontal,
  ExternalLink,
  Wine,
  Cigarette,
  Baby,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type UserRole } from "@/lib/auth/dal";
import { useUser } from "@/contexts/userContext";

export interface ProfileChinoViewProps {
  profile: any;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
  };
}

export function ProfileChinoView({ profile, user }: ProfileChinoViewProps) {
  const router = useRouter();
  const { userProfile } = useUser();

  const privateCorner = profile?.private_corner || {};
  const verificationStatus: string =
    privateCorner.verificationStatus ||
    (privateCorner.verificationSelfie ? "pending_review" : "unsubmitted");

  const showcasePhotos: string[] = Array.isArray(profile?.additional_photos)
    ? profile.additional_photos
    : [];

  const interests: string[] = Array.isArray(profile?.interests)
    ? profile.interests
    : [];

  const promptAnswers: Record<string, string> = profile?.prompt_answers || {};
  const promptEntries = Object.entries(promptAnswers);

  const speedRound = profile?.speed_round || {};
  const dealbreakers = profile?.dealbreakers || {};

  // Resolved user display info
  const displayName = profile?.first_name || user.name || "Mayalu Member";
  const displayAge = profile?.age;
  const avatarUrl =
    profile?.profile_photo ||
    userProfile?.profilePhoto ||
    user.image ||
    "https://api.dicebear.com/7.x/personas/svg?seed=Aarav";

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-300">
      {/* =========================================================================
          1. HERO IDENTITY BANNER (No duplicate avatar cards below)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-purple-500/10 border border-rose-500/20 backdrop-blur-xl shadow-lg shadow-rose-500/5">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-24 -left-24 size-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Expressive Avatar with Quick Edit Overlay */}
            <div className="relative group shrink-0">
              <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden ring-4 ring-rose-500/30 group-hover:ring-rose-500/60 transition-all shadow-md bg-background/90">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <Link
                href="/account/onboarding?step=15&tab=avatar"
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium gap-0.5"
                title="Change Avatar"
              >
                <Camera className="size-4" />
                <span>Edit</span>
              </Link>
            </div>

            {/* Name, Status & Core Attributes */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {displayName}
                  {displayAge && (
                    <span className="text-rose-500 font-semibold text-xl sm:text-2xl ml-2">
                      {displayAge}
                    </span>
                  )}
                </h1>

                {/* Role badge */}
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold uppercase tracking-wider py-0.5 px-2 bg-muted/60"
                >
                  {user.role}
                </Badge>

                {/* Verification status badge */}
                {verificationStatus === "verified" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs py-0.5 px-2.5 gap-1 font-semibold">
                    <ShieldCheck className="size-3.5" />
                    <span>Maya Verified 🛡️</span>
                  </Badge>
                ) : verificationStatus === "pending_review" ? (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs py-0.5 px-2.5 gap-1 font-semibold">
                    <Camera className="size-3.5 animate-pulse text-amber-500" />
                    <span>Under Maya Review ⏳</span>
                  </Badge>
                ) : verificationStatus === "rejected" ? (
                  <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs py-0.5 px-2.5 gap-1 font-semibold">
                    <ShieldAlert className="size-3.5" />
                    <span>Selfie Retake Required ⚠️</span>
                  </Badge>
                ) : (
                  <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs py-0.5 px-2.5 gap-1 font-semibold">
                    <Ghost className="size-3.5" />
                    <span>Ghost Spectator 👻</span>
                  </Badge>
                )}

                {/* Intent Badge */}
                {profile?.relationship_intent && (
                  <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs py-0.5 px-2.5 font-medium gap-1">
                    <Heart className="size-3 fill-rose-500 text-rose-500" />
                    <span>{profile.relationship_intent}</span>
                  </Badge>
                )}
              </div>

              {/* Location, Career, Gender */}
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                {profile?.location && (
                  <span className="flex items-center gap-1 font-medium text-foreground/80">
                    <MapPin className="size-3.5 text-rose-500" />
                    <span>{profile.location}</span>
                  </span>
                )}
                {profile?.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3.5 text-muted-foreground" />
                    <span>{profile.occupation}</span>
                  </span>
                )}
                {profile?.gender && (
                  <span className="capitalize text-muted-foreground font-medium">
                    • {profile.gender}
                    {profile?.interested_in && (
                      <span className="text-muted-foreground/80 font-normal">
                        {" "}
                        (Seeking {profile.interested_in})
                      </span>
                    )}
                  </span>
                )}
              </p>

              {/* Bio Quote */}
              {profile?.bio && (
                <div className="relative text-xs text-muted-foreground italic bg-background/50 dark:bg-card/40 p-3 rounded-2xl border border-border/40 max-w-2xl leading-relaxed mt-2 flex items-start gap-2">
                  <Quote className="size-4 text-rose-500/60 shrink-0 mt-0.5 rotate-180" />
                  <p>"{profile.bio}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0 pt-2 lg:pt-0">
            <Link href="/account/onboarding">
              <Button className="rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 text-xs sm:text-sm h-10 px-5">
                <Sparkles className="size-4" />
                <span>Redo Onboarding</span>
              </Button>
            </Link>

            <Link href="/account/hallway">
              <Button
                variant="outline"
                className="rounded-full border-rose-500/30 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold gap-2 text-xs sm:text-sm h-10 px-4 transition-all"
              >
                <Flame className="size-4 text-rose-500" />
                <span>The Hallway</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. QUICK JUMP / EDIT SPECIFIC SECTION BAR
          ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Edit3 className="size-3" />
          <span>Quick Edit:</span>
        </span>
        <Link href="/account/onboarding?step=0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>✍️ Basics</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 shrink-0 gap-1"
          >
            <span>⚧️ Seeking</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=3">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>📍 Location</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 shrink-0 gap-1"
          >
            <span>🍛 Dal Bhat &amp; Chiya</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=10">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>🌟 Passions</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=11">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0 gap-1"
          >
            <span>🌿 Culture &amp; Roots</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=12">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>🎯 Match Criteria</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=13">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>💌 Story Prompt</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=14">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
          >
            <span>⚡ Habits</span>
          </Button>
        </Link>
        <Link href="/account/onboarding?step=15">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 shrink-0 gap-1"
          >
            <span>📸 Photos &amp; Selfie</span>
          </Button>
        </Link>
      </div>

      {/* =========================================================================
          3. REORGANIZED BALANCED PROFILE CARDS GRID (No duplicate mini-card)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (6 cols): Personality & Cultural Roots ================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Chino Personality & Daily Nepali Rituals */}
          <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Sparkles className="size-4 text-rose-500" />
                    <span>Personality &amp; Daily Vibe</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Authentic rituals and quirks that make up your Nepali Chino.
                  </CardDescription>
                </div>
                <Link href="/account/onboarding?step=5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-7 px-2.5 gap-1 rounded-full"
                  >
                    <Edit3 className="size-3" />
                    <span>Edit</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 4 Core Vibe Highlights (2x2 Grid with vibrant colors) */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 space-y-1">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                    <Utensils className="size-3 text-amber-500" /> Dal Bhat
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-300 text-xs block truncate">
                    {profile?.dal_bhat_frequency || "Twice a day 🔥"}
                  </span>
                </div>

                <div className="bg-rose-500/5 dark:bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 space-y-1">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                    <Coffee className="size-3 text-rose-500" /> Daily Chiya
                  </span>
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-xs block truncate">
                    {privateCorner.chiyaPreference || "Kadak Masala Chiya ☕"}
                  </span>
                </div>

                <div className="bg-violet-500/5 dark:bg-violet-500/10 p-3 rounded-2xl border border-violet-500/20 space-y-1">
                  <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                    <Music className="size-3 text-violet-500" /> On Repeat
                  </span>
                  <span className="font-bold text-violet-700 dark:text-violet-300 text-xs block truncate">
                    {profile?.music_repeat || "Sajjan Raj Vaidya 🎶"}
                  </span>
                </div>

                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                    <Heart className="size-3 text-emerald-500" /> #1 Green Flag
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs block truncate">
                    {profile?.green_flag || "Kind & Communicates ✨"}
                  </span>
                </div>
              </div>

              {/* Passions & Lifestyle Tags */}
              {interests.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      Passions &amp; Lifestyle
                    </span>
                    <Link href="/account/onboarding?step=10">
                      <span className="text-[11px] text-rose-500 hover:underline cursor-pointer">
                        Change ({interests.length})
                      </span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((int) => (
                      <Badge
                        key={int}
                        variant="secondary"
                        className="text-xs px-2.5 py-1 rounded-xl bg-muted/70 hover:bg-muted font-medium transition-colors"
                      >
                        {int}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* मयालु प्रसङ्ग (Story Prompt & Answer) */}
              {promptEntries.length > 0 && (
                <div className="bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-purple-500/5 p-4 rounded-2xl text-xs space-y-1.5 border border-rose-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-rose-500 uppercase tracking-wider font-bold">
                      मयालु प्रसङ्ग • Story
                    </span>
                    <Link href="/account/onboarding?step=13">
                      <span className="text-[11px] text-rose-500 hover:underline cursor-pointer">
                        Edit Prompt
                      </span>
                    </Link>
                  </div>
                  <p className="text-xs text-foreground font-semibold italic">
                    "{promptEntries[0][0]}"
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    "{promptEntries[0][1]}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Cultural Roots & Background (Private Corner) */}
          <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Compass className="size-4 text-emerald-500" />
                    <span>Cultural Roots &amp; Background</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Traditional heritage and astrological preferences for family compatibility.
                  </CardDescription>
                </div>
                <Link href="/account/onboarding?step=11">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-7 px-2.5 gap-1 rounded-full"
                  >
                    <Edit3 className="size-3" />
                    <span>Edit</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Caste / Community
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.caste || "Open / Not specified"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Gotra
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.gotra || "Open / Unknown"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Religion
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.religion || "Open / Spiritual"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Dietary Habit
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.dietary || "Non-vegetarian 🍗"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Astrology / Kundali
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.astrologyOpenness || "Open-minded ✨"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">
                    Family Vibe
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {privateCorner.familyVibe || "Close-knit 👨‍👩‍👧"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground/80 mt-3 flex items-center gap-1.5">
                <Lock className="size-3 text-muted-foreground" />
                <span>
                  Private corner details are respectfully displayed to mutual suitors.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN (6 cols): Visuals, Verification & Preferences ================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 3: Dhukuti Photo Vault (ढुकुटी) */}
          <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Lock className="size-4 text-amber-500" />
                    <span>Dhukuti Photo Vault (ढुकुटी)</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Showcase photos unlocked mutually when both parties say 'Mayalu'.
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                >
                  {showcasePhotos.length}/3 Photos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                  const photoUrl = showcasePhotos[idx];
                  return (
                    <div
                      key={idx}
                      className="relative aspect-3/4 rounded-2xl overflow-hidden border border-border/60 bg-muted/40 group shadow-xs flex flex-col items-center justify-center transition-all hover:border-amber-500/40"
                    >
                      {photoUrl ? (
                        <>
                          <Image
                            src={photoUrl}
                            alt={`Dhukuti photo ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] text-white font-medium">
                              Photo {idx + 1}
                            </span>
                          </div>
                        </>
                      ) : (
                        <Link
                          href="/account/onboarding?step=15&tab=vault"
                          className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground space-y-1.5 hover:text-amber-500 transition-colors"
                        >
                          <Camera className="size-5 opacity-50 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium">
                            + Add Photo {idx + 1}
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <p className="text-xs text-muted-foreground">
                  {showcasePhotos.length >= 3 ? (
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Ready for matching in The Hallway
                    </span>
                  ) : (
                    <span className="text-amber-500 font-medium flex items-center gap-1">
                      <ShieldAlert className="size-3.5" /> Upload {3 - showcasePhotos.length} more photo{3 - showcasePhotos.length === 1 ? "" : "s"} to qualify for matching
                    </span>
                  )}
                </p>
                <Link href="/account/onboarding?step=15&tab=vault">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-8 px-3.5 gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-medium"
                  >
                    <span>Manage Vault</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Maya 1-on-1 Human Selfie Verification */}
          <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <UserCheck className="size-4 text-violet-500" />
                    <span>Maya 1-on-1 Selfie Verification</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Private verification selfie checked by Maya to eliminate fake profiles.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">Current Status:</span>
                    {verificationStatus === "verified" ? (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <ShieldCheck className="size-3.5" /> Verified Chino
                      </span>
                    ) : verificationStatus === "pending_review" ? (
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Camera className="size-3.5 animate-pulse" /> Under Maya Review ⏳
                      </span>
                    ) : verificationStatus === "rejected" ? (
                      <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                        <ShieldAlert className="size-3.5" /> Retake Needed ⚠️
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                        <Ghost className="size-3.5" /> Unsubmitted (Ghost Mode)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                    {verificationStatus === "verified"
                      ? "Your identity has been confirmed by Maya. Your profile displays the verified badge and has full matching clearance in The Hallway."
                      : verificationStatus === "pending_review"
                      ? "Maya has your selfie in the review queue. We verify every profile 1-on-1 to eliminate bots and fake profiles."
                      : "Without verification, profiles stay in Ghost Spectator mode with limited interactions. Snap a quick selfie to unlock."}
                  </p>
                </div>

                <Link href="/account/onboarding?step=15&tab=verify">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-8 px-3.5 shrink-0 gap-1.5 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 font-medium"
                  >
                    <Camera className="size-3.5" />
                    <span>
                      {privateCorner.verificationSelfie ? "Update Selfie" : "Verify Selfie Now"}
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Match Preferences & Lifestyle Habits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sub-Card A: Match Criteria */}
            <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <SlidersHorizontal className="size-3.5 text-rose-500" />
                    <span>Match Criteria</span>
                  </CardTitle>
                  <Link href="/account/onboarding?step=12">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-500 h-6 px-2 rounded-full"
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Partner Age:</span>
                  <span className="font-semibold text-foreground">
                    {dealbreakers.ageRangeMin || 22} - {dealbreakers.ageRangeMax || 28} yrs
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Scope:</span>
                  <span className="font-semibold text-foreground truncate max-w-[130px]">
                    {dealbreakers.distance || "Nepal & Diaspora 🌍"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Card B: Lifestyle & Speed Round */}
            <Card className="rounded-3xl border-border/70 shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Wine className="size-3.5 text-amber-500" />
                    <span>Lifestyle Habits</span>
                  </CardTitle>
                  <Link href="/account/onboarding?step=14">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-500 h-6 px-2 rounded-full"
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Wine className="size-3 text-muted-foreground" />
                    <span>Drinking:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {speedRound.drinking || "Socially"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Cigarette className="size-3 text-muted-foreground" />
                    <span>Smoking:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {speedRound.smoking || "Never"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Baby className="size-3 text-muted-foreground" />
                    <span>Future Kids:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {speedRound.kids || "Want someday"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
