"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ShieldCheck,
  Heart,
  SlidersHorizontal,
  Bell,
  Eye,
  Lock,
  Moon,
  Sun,
  Laptop,
  Flame,
  Globe,
  MapPin,
  Sparkles,
  Zap,
  Check,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Trash2,
  RefreshCw,
  LogOut,
  Radio,
  Volume2,
  ShieldAlert,
  Calendar,
  Utensils,
  Compass,
} from "lucide-react";
import { useUser } from "@/contexts/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";

interface SettingsConsoleProps {
  initialRole?: string;
  adminEmail?: string;
}

export function SettingsConsole({ initialRole, adminEmail }: SettingsConsoleProps) {
  const { userProfile, userLevel, superLikes } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Settings local state with default values
  const [intent, setIntent] = React.useState<"dating" | "matrimonial">("dating");
  const [distanceRadius, setDistanceRadius] = React.useState<number>(25);
  const [globalDiaspora, setGlobalDiaspora] = React.useState(true);
  const [openCaste, setOpenCaste] = React.useState(true);
  const [dalBhatPref, setDalBhatPref] = React.useState(true);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [ageRange, setAgeRange] = React.useState<string>("21-32");

  // Privacy states
  const [ghostMode, setGhostMode] = React.useState(false);
  const [dhukutiLock, setDhukutiLock] = React.useState(true);
  const [readReceipts, setReadReceipts] = React.useState(true);
  const [onlineStatus, setOnlineStatus] = React.useState(true);
  const [safeDateGuardian, setSafeDateGuardian] = React.useState(true);

  // Notifications states
  const [notifMatches, setNotifMatches] = React.useState(true);
  const [notifMessages, setNotifMessages] = React.useState(true);
  const [notifDailyLikes, setNotifDailyLikes] = React.useState(true);
  const [notifWhispers, setNotifWhispers] = React.useState(true);
  const [soundEffects, setSoundEffects] = React.useState(true);

  // Appearance states
  const [language, setLanguage] = React.useState<"en" | "ne">("en");
  const [cardLayout, setCardLayout] = React.useState<"story" | "compact">("story");

  React.useEffect(() => {
    setMounted(true);
    // Load persisted settings from localStorage if available
    try {
      const savedIntent = localStorage.getItem("mayalu_intent");
      if (savedIntent === "dating" || savedIntent === "matrimonial") {
        setIntent(savedIntent);
      }
      const savedGhost = localStorage.getItem("mayalu_ghost_mode");
      if (savedGhost !== null) setGhostMode(savedGhost === "true");
      const savedDhukuti = localStorage.getItem("mayalu_dhukuti_lock");
      if (savedDhukuti !== null) setDhukutiLock(savedDhukuti === "true");
      const savedLang = localStorage.getItem("mayalu_language");
      if (savedLang === "en" || savedLang === "ne") setLanguage(savedLang);
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const isAdmin = (mounted && userProfile?.role === "admin") || initialRole === "admin";

  const displayName = mounted
    ? userProfile?.firstName ||
      userProfile?.name ||
      (userProfile?.email ? userProfile.email.split("@")[0] : "Mayalu Member")
    : "Mayalu Member";

  const displayInitials = mounted
    ? (displayName || "M")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "MM";

  const displayAvatar =
    (mounted && (userProfile?.profilePhoto || userProfile?.image)) ||
    `https://api.dicebear.com/10.x/personas/svg?seed=Mayalu`;

  const isVerified = mounted && userProfile?.verificationStatus === "verified";
  const isReview = mounted && userProfile?.verificationStatus === "pending_review";

  const handleIntentChange = (newIntent: "dating" | "matrimonial") => {
    setIntent(newIntent);
    try {
      localStorage.setItem("mayalu_intent", newIntent);
    } catch {}
    toast.success(
      newIntent === "matrimonial"
        ? "विवाह Matrimonial Mode Activated 💍"
        : "माया Dating & Romance Mode Active 🔥",
      {
        description:
          newIntent === "matrimonial"
            ? "Your Hallway now emphasizes cultural heritage, Kundali compatibility, and matrimonial intent."
            : "Your Hallway now explores open dating, shared hobbies, and romantic vibes.",
      }
    );
  };

  const handleGhostModeToggle = (checked: boolean) => {
    setGhostMode(checked);
    try {
      localStorage.setItem("mayalu_ghost_mode", String(checked));
    } catch {}
    if (checked) {
      toast.info("Ghost Mode Enabled 👻", {
        description: "Your Chino profile is now hidden from the Hallway. Existing chats remain open.",
      });
    } else {
      toast.success("Profile Visible in Hallway ✨", {
        description: "Members can discover and connect with your Chino again.",
      });
    }
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem("mayalu_ghost_mode");
      localStorage.removeItem("mayalu_intent");
      toast.success("Settings & Demo Cache Refreshed ✨", {
        description: "All client preferences have been synchronized with the latest platform data.",
      });
    } catch {
      toast.error("Could not clear cache.");
    }
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-rose-950 to-gray-800 dark:from-white dark:via-rose-100 dark:to-gray-200 bg-clip-text text-transparent">
              Settings &amp; Preferences
            </h1>
            <Badge variant="outline" className="text-[11px] bg-rose-500/10 text-rose-500 border-rose-500/25 font-semibold py-0.5">
              सेटिङ्स
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tailor your matchmaking discovery, cultural filters, privacy shields, and notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/account/profile">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold hover:border-rose-400">
              <span>View Authentic Chino</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* User Quick Identity Banner */}
      <Card className="border-border/60 bg-gradient-to-br from-pink-50/70 via-white to-purple-50/40 dark:from-pink-950/20 dark:via-gray-900/60 dark:to-purple-950/10 backdrop-blur-md shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-pink-300 dark:ring-pink-700 shadow-md">
                <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
                <AvatarFallback suppressHydrationWarning className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold text-lg">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-background shadow-xs">
                  ✓
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 suppressHydrationWarning className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {displayName}
                </h2>
                {isVerified ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold py-0">
                    <CheckCircle2 className="size-3 mr-1" /> Maya Verified
                  </Badge>
                ) : isReview ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold py-0">
                    <AlertTriangle className="size-3 mr-1" /> Selfie In Review
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/30 text-[10px] font-semibold py-0">
                    Chino Active
                  </Badge>
                )}
                {isAdmin && (
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 text-[10px] font-semibold py-0">
                    <ShieldCheck className="size-3 mr-1" /> Admin Member
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs sm:max-w-md">
                {userProfile?.email || adminEmail || "Authenticated Member"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-pink-100/80 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                  ⚡ Level {mounted ? userLevel.level : 1}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  ★ {mounted ? superLikes : 3} Super Likes
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-100/80 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                  {intent === "matrimonial" ? "💍 Matrimonial Intent" : "🔥 Dating Intent"}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:self-center">
            <Link href="/account/profile">
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-xs text-xs font-semibold gap-1.5">
                <span>Edit Profile</span>
                <ExternalLink className="size-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Settings Tabs */}
      <Tabs defaultValue="discovery" className="space-y-6">
        <TabsList className="bg-muted/70 dark:bg-muted/40 p-1.5 rounded-2xl h-auto border border-border/60 shadow-xs grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5 w-full">
          <TabsTrigger value="discovery" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <SlidersHorizontal className="size-3.5 text-rose-500" />
            <span>Discovery</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Lock className="size-3.5 text-blue-500" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Bell className="size-3.5 text-amber-500" />
            <span>Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Sparkles className="size-3.5 text-purple-500" />
            <span>Theme &amp; Lang</span>
          </TabsTrigger>
          {isAdmin ? (
            <TabsTrigger value="admin" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs col-span-2 sm:col-span-1">
              <ShieldCheck className="size-3.5 text-violet-500" />
              <span>Admin Portal</span>
            </TabsTrigger>
          ) : (
            <TabsTrigger value="account" className="rounded-xl text-xs font-semibold py-2.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs col-span-2 sm:col-span-1">
              <Compass className="size-3.5 text-emerald-500" />
              <span>Account</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* 1. DISCOVERY & MATCHMAKING TAB */}
        <TabsContent value="discovery" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <Flame className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Matchmaking Orientation &amp; Intent</CardTitle>
                  <CardDescription className="text-xs">
                    Choose what you are looking for on Mayalu. You can switch anytime.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleIntentChange("dating")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                    intent === "dating"
                      ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-2 ring-rose-500/20"
                      : "border-border/70 hover:border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">🔥</span>
                    {intent === "dating" && (
                      <span className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Dating &amp; Romance (माया)</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Casual conversation, coffee dates, genuine romance, and open exploration without pressure.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleIntentChange("matrimonial")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                    intent === "matrimonial"
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-xs ring-2 ring-purple-500/20"
                      : "border-border/70 hover:border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">💍</span>
                    {intent === "matrimonial" && (
                      <span className="size-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Matrimonial (लगनगाँठो / विवाह)</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Serious marriage intent with deep family values, gotra, and cultural background compatibility.
                  </p>
                </button>
              </div>

              {/* Distance Radius */}
              <div className="space-y-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Discovery Distance Radius</Label>
                    <p className="text-xs text-muted-foreground">Find candidate Chinos within your chosen travel zone</p>
                  </div>
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {distanceRadius} km
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => {
                        setDistanceRadius(km);
                        toast.success(`Search radius set to ${km} km`);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        distanceRadius === km
                          ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                          : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Diaspora Mode */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="global-diaspora" className="text-sm font-semibold flex items-center gap-1.5">
                    <Globe className="size-4 text-blue-500" />
                    <span>Global Nepali Diaspora (विश्वभरिका नेपाली)</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Expand matching beyond your city to Nepalis living abroad in the US, UK, Australia, and Canada.
                  </p>
                </div>
                <Switch
                  id="global-diaspora"
                  checked={globalDiaspora}
                  onCheckedChange={(checked) => {
                    setGlobalDiaspora(checked);
                    toast.success(checked ? "Global Diaspora discovery active 🌍" : "Local discovery only 📍");
                  }}
                />
              </div>

              {/* Cultural & Caste Openness */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="caste-open" className="text-sm font-semibold flex items-center gap-1.5">
                    <Heart className="size-4 text-rose-500" />
                    <span>Open to All Castes &amp; Traditions</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Connect with wonderful Nepalis regardless of caste, gotra, or regional background.
                  </p>
                </div>
                <Switch
                  id="caste-open"
                  checked={openCaste}
                  onCheckedChange={(checked) => {
                    setOpenCaste(checked);
                    toast.info(checked ? "Open to all cultural backgrounds ✨" : "Filtering by traditional preference");
                  }}
                />
              </div>

              {/* Dal Bhat Frequency Match */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="dal-bhat" className="text-sm font-semibold flex items-center gap-1.5">
                    <Utensils className="size-4 text-amber-500" />
                    <span>Dal Bhat &amp; Food Vibe Compatibility</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight candidates who match your Dal Bhat frequency and Momo addiction score.
                  </p>
                </div>
                <Switch
                  id="dal-bhat"
                  checked={dalBhatPref}
                  onCheckedChange={setDalBhatPref}
                />
              </div>

              {/* Verified Only Filter */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="verified-only" className="text-sm font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span>Verified Profiles Only</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Only discover profiles that have completed 1-on-1 human selfie review.
                  </p>
                </div>
                <Switch
                  id="verified-only"
                  checked={verifiedOnly}
                  onCheckedChange={(c) => {
                    setVerifiedOnly(c);
                    toast.success(c ? "Showing verified candidates only 🛡️" : "Showing all community candidates");
                  }}
                />
              </div>

              {/* Age Range */}
              <div className="space-y-2 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Preferred Age Bracket</Label>
                  <span className="text-xs font-semibold text-rose-500">{ageRange} years</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["18-24", "21-32", "26-36", "30-45"].map((bracket) => (
                    <button
                      key={bracket}
                      type="button"
                      onClick={() => {
                        setAgeRange(bracket);
                        toast.success(`Age preference updated to ${bracket}`);
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        ageRange === bracket
                          ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                          : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"
                      }`}
                    >
                      {bracket}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. PRIVACY & SAFETY TAB */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Lock className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Privacy &amp; Chino Protection</CardTitle>
                  <CardDescription className="text-xs">
                    Fine-tune who can see your photos, when you appear online, and safety shields.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ghost Mode */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-blue-200/50 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="ghost-mode" className="text-sm font-bold text-foreground">
                      Ghost Mode (भूत मोड 👻)
                    </Label>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full">
                      Incognito
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Temporarily hide your profile from being discovered in the Hallway. Your existing chat conversations and matches remain untouched.
                  </p>
                </div>
                <Switch
                  id="ghost-mode"
                  checked={ghostMode}
                  onCheckedChange={handleGhostModeToggle}
                />
              </div>

              {/* Dhukuti Photo Vault Protection */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="dhukuti-vault" className="text-sm font-semibold flex items-center gap-1.5">
                    <Lock className="size-4 text-purple-500" />
                    <span>Dhukuti Photo Vault Protection 🔒</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Keep your private showcase photos locked and blurred until you and another member mutually connect.
                  </p>
                </div>
                <Switch
                  id="dhukuti-vault"
                  checked={dhukutiLock}
                  onCheckedChange={(c) => {
                    setDhukutiLock(c);
                    toast.success(c ? "Dhukuti Photo Vault locked 🔒" : "Dhukuti visible to all members");
                  }}
                />
              </div>

              {/* Read Receipts */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="read-receipts" className="text-sm font-semibold">
                    Kura-Kani Read Receipts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Display seen checkmarks when you read incoming messages.
                  </p>
                </div>
                <Switch
                  id="read-receipts"
                  checked={readReceipts}
                  onCheckedChange={setReadReceipts}
                />
              </div>

              {/* Online Activity Status */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="online-status" className="text-sm font-semibold">
                    Show Active Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Let matches see when you are currently online in the app.
                  </p>
                </div>
                <Switch
                  id="online-status"
                  checked={onlineStatus}
                  onCheckedChange={setOnlineStatus}
                />
              </div>

              {/* Maya Safe Date Guardian */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="safe-date" className="text-sm font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span>Maya Safe Date Guardian (सुरक्षित भेट 🛡️)</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enables discreet check-in prompts and emergency SMS alerts when meeting new connections in person.
                  </p>
                </div>
                <Switch
                  id="safe-date"
                  checked={safeDateGuardian}
                  onCheckedChange={setSafeDateGuardian}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Bell className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Push Notifications &amp; Alerts</CardTitle>
                  <CardDescription className="text-xs">
                    Choose what updates trigger alerts and sound notifications.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-match" className="text-sm font-semibold">
                    New Mutual Match (जोडी मिल्यो)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get an instant celebration alert when two hearts connect.
                  </p>
                </div>
                <Switch
                  id="notif-match"
                  checked={notifMatches}
                  onCheckedChange={setNotifMatches}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-chat" className="text-sm font-semibold">
                    Kura-Kani Chat Messages
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive alert previews when someone sends you a message or voice note.
                  </p>
                </div>
                <Switch
                  id="notif-chat"
                  checked={notifMessages}
                  onCheckedChange={setNotifMessages}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-likes" className="text-sm font-semibold">
                    Daily Super Likes Reset
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Remind me at midnight when 3 free Super Likes have been replenished.
                  </p>
                </div>
                <Switch
                  id="notif-likes"
                  checked={notifDailyLikes}
                  onCheckedChange={setNotifDailyLikes}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-whispers" className="text-sm font-semibold">
                    Maya Matchmaker Whispers
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Curated weekly dating tips, icebreakers, and Nepali festival celebrations.
                  </p>
                </div>
                <Switch
                  id="notif-whispers"
                  checked={notifWhispers}
                  onCheckedChange={setNotifWhispers}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-effects" className="text-sm font-semibold flex items-center gap-1.5">
                    <Volume2 className="size-4 text-violet-500" />
                    <span>In-App Sound Effects &amp; Haptics</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Play gentle sound chimes on swipe, match spark, and super-like.
                  </p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. THEME & LANGUAGE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Display, Theme &amp; Language</CardTitle>
                  <CardDescription className="text-xs">
                    Personalize your visual experience and language preferences.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Picker */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Visual Color Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      theme === "light"
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-2 ring-rose-500/20"
                        : "border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    <Sun className="size-6 mx-auto mb-2 text-amber-500" />
                    <span className="text-xs font-bold block text-foreground">Light Mode</span>
                    <span className="text-[10px] text-muted-foreground">Crisp &amp; warm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      theme === "dark"
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-2 ring-rose-500/20"
                        : "border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    <Moon className="size-6 mx-auto mb-2 text-violet-400" />
                    <span className="text-xs font-bold block text-foreground">Dark Mode</span>
                    <span className="text-[10px] text-muted-foreground">OLED sleek</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      theme === "system"
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-2 ring-rose-500/20"
                        : "border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    <Laptop className="size-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-xs font-bold block text-foreground">System</span>
                    <span className="text-[10px] text-muted-foreground">Automatic</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3 pt-3 border-t border-border/50">
                <Label className="text-sm font-semibold">Interface Language (भाषा)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("en");
                      toast.success("Interface set to English");
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      language === "en"
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-500/30"
                        : "border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-foreground">English</span>
                      {language === "en" && <Check className="size-3.5 text-rose-500" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground">Default international English</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("ne");
                      toast.success("भाषा नेपाली चयन गरियो 🇳🇵");
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      language === "ne"
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-500/30"
                        : "border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-foreground">नेपाली (Nepali) 🇳🇵</span>
                      {language === "ne" && <Check className="size-3.5 text-rose-500" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground">प्रामाणिक नेपाली भाषान्तरण</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. ADMIN PORTAL TAB (If Admin) */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <Card className="border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-purple-900/10 to-background shadow-md overflow-hidden">
              <CardHeader className="border-b border-violet-500/20 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Admin Moderation &amp; Verification Portal
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Authorized clearance for human identity selfie verification &amp; member standards.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-violet-600 text-white font-bold text-[10px] py-1 px-2.5 shadow-sm">
                    RBAC ACTIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-card/80 border border-violet-500/20">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Clearance Level
                    </span>
                    <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400">
                      Level 1 Moderator
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Full selfie approval rights</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card/80 border border-violet-500/20">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Console Access
                    </span>
                    <span className="text-lg font-extrabold text-foreground">
                      /account/users
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Standalone executive view</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card/80 border border-violet-500/20">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Session Email
                    </span>
                    <span className="text-xs font-semibold text-foreground truncate block">
                      {userProfile?.email || adminEmail || "sushilsharma@duck.com"}
                    </span>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">✓ Authenticated</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">
                      Launch Full-Screen Moderation Console
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Review submitted 1-on-1 verification selfies, approve/reject candidates, and manage accounts.
                    </p>
                  </div>
                  <Link href="/account/users">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md text-xs font-bold gap-2 shrink-0">
                      <ShieldCheck className="size-4" />
                      <span>Launch Moderation Console</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* 6. ACCOUNT ACTIONS & DANGER ZONE TAB */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Account Management &amp; Sessions</CardTitle>
              <CardDescription className="text-xs">
                Manage your credentials, session security, and account status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Clear Session Cache</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Refreshes your cached discovery preferences and locally saved state.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Refresh Cache</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Sign Out of Mayalu</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    End your active session securely on this device.
                  </p>
                </div>
                <LogoutButton variant="outline" size="sm" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Support Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40 gap-2">
        <p>© 2026 Mayalu (मयालु) • Authentic Nepali Matchmaking &amp; Dating</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
