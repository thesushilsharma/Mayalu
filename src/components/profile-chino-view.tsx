"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Cake,
  Edit3,
  CheckCircle2,
  Lock,
  RotateCcw,
  Coffee,
  Utensils,
  Music,
  Smile,
  Compass,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import OnboardingComponent from "@/components/onboarding";
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
  const { updateUserProfile } = useUser();
  const [activeTab, setActiveTab] = React.useState<"chino" | "redo">("chino");
  const [redoStartStep, setRedoStartStep] = React.useState<number>(0);

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

  const handleStartRedo = (stepIndex = 0) => {
    setRedoStartStep(stepIndex);
    setActiveTab("redo");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-purple-500/10 border border-rose-500/20 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden ring-2 ring-rose-500/40 shrink-0 bg-background/80 shadow-md">
            <Image
              src={profile?.profile_photo || user.image || "https://api.dicebear.com/7.x/personas/svg?seed=Aarav"}
              alt={profile?.first_name || user.name || "Chino"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {profile?.first_name || user.name || "Your Chino"}
              </h1>
              {profile?.age && (
                <span className="text-sm font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {profile.age} yrs
                </span>
              )}
              {/* Role badge */}
              <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider py-0 px-2 bg-muted/60">
                {user.role}
              </Badge>
              {/* Verification status badge */}
              {verificationStatus === "verified" ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs py-0.5 gap-1 font-semibold">
                  <ShieldCheck className="size-3.5" />
                  <span>Maya Verified 🛡️</span>
                </Badge>
              ) : verificationStatus === "pending_review" ? (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs py-0.5 gap-1 font-semibold">
                  <Camera className="size-3.5 animate-pulse text-amber-500" />
                  <span>Under Maya Review ⏳</span>
                </Badge>
              ) : verificationStatus === "rejected" ? (
                <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs py-0.5 gap-1 font-semibold">
                  <ShieldAlert className="size-3.5" />
                  <span>Selfie Retake Required ⚠️</span>
                </Badge>
              ) : (
                <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs py-0.5 gap-1 font-semibold">
                  <Ghost className="size-3.5" />
                  <span>Ghost Mode 👻</span>
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              {profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-rose-500" />
                  <span>{profile.location}</span>
                </span>
              )}
              {profile?.occupation && (
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3 text-muted-foreground" />
                  <span>{profile.occupation}</span>
                </span>
              )}
              {profile?.gender && (
                <span className="text-muted-foreground font-medium capitalize">
                  • {profile.gender}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {activeTab === "chino" ? (
            <>
              <Button
                onClick={() => handleStartRedo(0)}
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-md shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5 text-xs sm:text-sm h-9 px-4"
              >
                <Sparkles className="size-3.5" />
                <span>Redo Onboarding (पुनरावलोकन)</span>
              </Button>
              <Link href="/account/hallway">
                <Button
                  variant="outline"
                  className="rounded-full border-rose-500/30 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 gap-1.5 text-xs sm:text-sm h-9 px-3.5"
                >
                  <Flame className="size-3.5" />
                  <span>The Hallway</span>
                </Button>
              </Link>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setActiveTab("chino")}
              className="rounded-full border-border/80 text-xs sm:text-sm h-9 px-4 gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Back to Chino Card</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/80 p-1 rounded-2xl h-11 border border-border/70 shadow-xs">
          <TabsTrigger
            value="chino"
            className="rounded-xl text-xs sm:text-sm font-semibold gap-1.5 transition-all text-muted-foreground data-active:bg-background data-active:text-rose-600 dark:data-active:text-rose-400 data-active:shadow-sm"
          >
            <Sparkles className="size-3.5" />
            <span>My Chino Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="redo"
            className="rounded-xl text-xs sm:text-sm font-semibold gap-1.5 transition-all text-muted-foreground data-active:bg-background data-active:text-rose-600 dark:data-active:text-rose-400 data-active:shadow-sm"
          >
            <Edit3 className="size-3.5" />
            <span>Redo / Edit All (सम्पादन)</span>
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: CHINO PROFILE VIEW ================= */}
        <TabsContent value="chino" className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Quick jump to edit sections pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              Quick Redo:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartRedo(0)}
              className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
            >
              <span>Basics (Name/Age)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartRedo(2)}
              className="h-7 text-xs rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 shrink-0 gap-1"
            >
              <span>Gender &amp; Seeking ⚧️</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartRedo(11)}
              className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
            >
              <span>Culture &amp; Roots 🌿</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartRedo(10)}
              className="h-7 text-xs rounded-full border-border/70 hover:bg-muted shrink-0 gap-1"
            >
              <span>Passions &amp; Vibe 🌟</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartRedo(15)}
              className="h-7 text-xs rounded-full border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 shrink-0 gap-1"
            >
              <span>Photos &amp; Selfie 📸</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 cols): Identity Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card Container with glow */}
              <div className="relative rounded-3xl p-0.5 bg-gradient-to-br from-rose-500/80 via-purple-500/80 to-amber-400/80 shadow-xl shadow-rose-500/10">
                <div className="bg-card/95 backdrop-blur-xl rounded-[22px] p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative size-16 rounded-2xl overflow-hidden ring-2 ring-rose-500/50 shrink-0 bg-muted/40">
                      <Image
                        src={profile?.profile_photo || "https://api.dicebear.com/7.x/personas/svg?seed=Aarav"}
                        alt={profile?.first_name || "Profile"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-lg sm:text-xl">
                        <span>{profile?.first_name || "Mayalu Member"}</span>
                        {profile?.age && (
                          <span className="text-rose-500 font-semibold text-base">
                            {profile.age}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 text-rose-500 shrink-0" />
                        <span className="truncate">{profile?.location || "Nepal"}</span>
                        <span>•</span>
                        <span className="truncate">{profile?.occupation || "Member"}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile?.relationship_intent && (
                          <Badge className="bg-rose-500/15 text-rose-500 text-[10px] px-2 py-0 border-none font-medium">
                            {profile.relationship_intent}
                          </Badge>
                        )}
                        {privateCorner.dietary && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0 border-none font-medium">
                            {privateCorner.dietary}
                          </Badge>
                        )}
                        {profile?.gender && (
                          <Badge variant="outline" className="text-[10px] capitalize px-2 py-0">
                            {profile.gender}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <div className="text-xs text-muted-foreground italic bg-muted/40 p-3 rounded-2xl border border-border/40 leading-relaxed">
                      "{profile.bio}"
                    </div>
                  )}

                  {/* Daily Vibe Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Utensils className="size-3 text-amber-500" /> Dal Bhat
                      </span>
                      <span className="font-semibold text-amber-500 text-xs block truncate">
                        {profile?.dal_bhat_frequency || "Twice a day 🔥"}
                      </span>
                    </div>

                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Music className="size-3 text-violet-500" /> On Repeat
                      </span>
                      <span className="font-semibold text-violet-500 text-xs block truncate">
                        {profile?.music_repeat || "Sajjan Raj Vaidya 🎶"}
                      </span>
                    </div>

                    {privateCorner.chiyaPreference && (
                      <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Coffee className="size-3 text-rose-500" /> Daily Chiya
                        </span>
                        <span className="font-semibold text-rose-500 text-xs block truncate">
                          {privateCorner.chiyaPreference}
                        </span>
                      </div>
                    )}

                    {profile?.green_flag && (
                      <div className="bg-muted/40 p-2.5 rounded-xl border border-border/30 space-y-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Heart className="size-3 text-emerald-500" /> #1 Green Flag
                        </span>
                        <span className="font-semibold text-emerald-500 text-xs block truncate">
                          {profile.green_flag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Passions */}
                  {interests.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Passions &amp; Lifestyle
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {interests.map((int) => (
                          <Badge key={int} variant="secondary" className="text-[11px] px-2 py-0.5">
                            {int}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prasang Answer */}
                  {promptEntries.length > 0 && (
                    <div className="bg-muted/50 p-3 rounded-2xl text-xs space-y-1 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                        मयालु प्रसङ्ग
                      </span>
                      <p className="text-xs text-rose-500 font-semibold italic">
                        "{promptEntries[0][0]}"
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        "{promptEntries[0][1]}"
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleStartRedo(15)}
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl gap-1 mt-1"
                  >
                    <Edit3 className="size-3.5" />
                    <span>Tweak Card Appearance &amp; Bio</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Showcase Photos, Cultural Roots, Verification, Preferences */}
            <div className="lg:col-span-7 space-y-6">
              {/* Dhukuti Photo Vault Card */}
              <Card className="rounded-3xl border-border/70 shadow-xs">
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
                    <Badge variant="outline" className="text-[11px] font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
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
                          className="relative aspect-3/4 rounded-2xl overflow-hidden border border-border/60 bg-muted/40 group shadow-xs flex flex-col items-center justify-center"
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
                                <span className="text-[10px] text-white font-medium">Photo {idx + 1}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground space-y-1">
                              <Camera className="size-5 opacity-40" />
                              <span className="text-[10px]">Photo {idx + 1} Empty</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartRedo(15)}
                      className="rounded-full text-xs h-7 px-3 gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                    >
                      <span>Manage Dhukuti Photos</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Human Selfie Verification Status Box */}
              <Card className="rounded-3xl border-border/70 shadow-xs">
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
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">Current Status:</span>
                        {verificationStatus === "verified" ? (
                          <span className="text-xs font-bold text-emerald-500">Verified Chino 🛡️</span>
                        ) : verificationStatus === "pending_review" ? (
                          <span className="text-xs font-bold text-amber-500">Maya is Reviewing ⏳</span>
                        ) : verificationStatus === "rejected" ? (
                          <span className="text-xs font-bold text-rose-500">Rejected • Retake Needed ⚠️</span>
                        ) : (
                          <span className="text-xs font-bold text-purple-500">Unsubmitted (Ghost Mode) 👻</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {verificationStatus === "verified"
                          ? "Your identity has been confirmed by Maya. Your profile displays the verified badge and has full matching clearance."
                          : verificationStatus === "pending_review"
                          ? "Maya has your selfie in the review queue. We verify every selfie 1-on-1 to protect our community."
                          : "Without verification, profiles stay in Ghost Spectator mode with limited interactions. Snap a selfie to unlock."}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartRedo(15)}
                      className="rounded-full text-xs h-8 px-3 shrink-0 gap-1.5 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                    >
                      <Camera className="size-3.5" />
                      <span>{privateCorner.verificationSelfie ? "Update Selfie" : "Verify Selfie Now"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Roots & Private Corner */}
              <Card className="rounded-3xl border-border/70 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <Compass className="size-4 text-emerald-500" />
                        <span>Cultural Roots &amp; Background</span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Traditional roots and astrological preferences for family compatibility.
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartRedo(11)}
                      className="text-xs text-rose-500 hover:text-rose-600 h-7 px-2 gap-1"
                    >
                      <Edit3 className="size-3" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Caste / Community</span>
                      <span className="font-semibold text-foreground">{privateCorner.caste || "Open / Not specified"}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Gotra</span>
                      <span className="font-semibold text-foreground">{privateCorner.gotra || "Open / Unknown"}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Religion</span>
                      <span className="font-semibold text-foreground">{privateCorner.religion || "Open / Spiritual"}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Dietary Habit</span>
                      <span className="font-semibold text-foreground">{privateCorner.dietary || "Non-vegetarian"}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Astrology / Kundali</span>
                      <span className="font-semibold text-foreground">{privateCorner.astrologyOpenness || "Open-minded"}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Family Vibe</span>
                      <span className="font-semibold text-foreground truncate block">{privateCorner.familyVibe || "Close-knit"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dealbreakers & Speed Round */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-3xl border-border/70 shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Match Criteria</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartRedo(12)}
                        className="text-xs text-rose-500 h-6 px-1.5"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-muted-foreground">Partner Age:</span>
                      <span className="font-semibold">{dealbreakers.ageRangeMin || 22} - {dealbreakers.ageRangeMax || 28} yrs</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Distance Scope:</span>
                      <span className="font-semibold truncate max-w-[150px]">{dealbreakers.distance || "Anywhere in Nepal"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border/70 shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Lifestyle &amp; Habits</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartRedo(14)}
                        className="text-xs text-rose-500 h-6 px-1.5"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-muted-foreground">Drinking:</span>
                      <span className="font-semibold">{speedRound.drinking || "Socially"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-muted-foreground">Smoking:</span>
                      <span className="font-semibold">{speedRound.smoking || "Never"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Future Kids:</span>
                      <span className="font-semibold">{speedRound.kids || "Want someday"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: REDO ONBOARDING FLOW ================= */}
        <TabsContent value="redo" className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
            <Sparkles className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Redo &amp; Edit Anything From Onboarding</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use the top <strong>Jump</strong> pills to jump directly to any step (Name, Age, Gender, Photos, Passions, Roots).
                <br />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Note: If you change your gender, Maya safety rules require you to upload a new verification selfie before saving.
                </span>
              </p>
            </div>
          </div>

          <div className="w-full h-[82vh] max-h-[82vh] rounded-3xl overflow-hidden border border-border/60 shadow-xl bg-card">
            <OnboardingComponent
              key={redoStartStep}
              mode="redo"
              initialStep={redoStartStep}
              onSuccess={() => {
                setActiveTab("chino");
                router.refresh();
              }}
              onCancel={() => setActiveTab("chino")}
              className="h-full max-h-full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
