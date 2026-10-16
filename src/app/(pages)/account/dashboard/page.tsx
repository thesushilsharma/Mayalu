import Link from "next/link";
import {
  Flame,
  Heart,
  MessageCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Overview } from "@/components/overview";
import { RecentUsers } from "@/components/recent-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserActivity } from "@/components/user-activity";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
              My Journey & Insights
            </h1>
            <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/25 py-0 font-medium">
              Chino Hub
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Your connection velocity, matchmaker perks, and dating progress curated by Maya.
          </p>
        </div>

        {/* Quick Link to Hallway */}
        <Link href="/account/hallway" className="shrink-0">
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold shadow-md shadow-rose-500/20 hover:shadow-rose-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5 px-4 h-9"
          >
            <Flame className="size-4 fill-white" />
            <span>Enter The Hallway</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {/* Hero Gateway Card: The Mayalu Hallway */}
      <div className="rounded-3xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-violet-500/15 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500 text-white text-[10px] px-2.5 py-0.5 font-bold shadow-xs flex items-center gap-1 border-0">
                <Flame className="size-3 fill-white" />
                <span>Discovery Arena</span>
              </Badge>
              <Badge variant="outline" className="bg-background/80 text-violet-600 dark:text-violet-400 border-violet-500/30 text-[10px] py-0 font-semibold">
                5 Fresh Chinos Waiting
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              The Mayalu Hallway is Open 🚪✨
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Maya has reviewed and placed today&apos;s verified Nepali candidates into your match queue. Browse profiles, review icebreakers, and spark Kura-Kani connections.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" />
                <span>1-on-1 Maya Verified</span>
              </span>
              <span>•</span>
              <span className="text-violet-600 dark:text-violet-400">3 Daily Super Likes Ready</span>
              <span>•</span>
              <span>Dhukuti Sealed 🔒</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-2.5 shrink-0">
            <Link href="/account/hallway" className="w-full">
              <Button
                size="lg"
                className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-bold px-6 h-12 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 text-sm"
              >
                <Flame className="size-5 fill-white" />
                <span>Step into The Hallway</span>
                <ChevronRight className="size-4" />
              </Button>
            </Link>
            <span className="text-[10px] text-center text-muted-foreground">
              Instant gesture swiping • Story photo navigation
            </span>
          </div>
        </div>

        {/* Decorative Ambient Background Elements */}
        <div className="absolute -right-8 -bottom-8 size-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -top-8 size-40 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Grid: Personal Connection & Matchmaker Velocity */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Match Compatibility Rate */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Match Compatibility</CardTitle>
            <div className="size-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Heart className="size-4 fill-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">68.4%</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>+14% with Dhukuti photos</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Active Conversations */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Kura-Kani Chats</CardTitle>
            <div className="size-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
              <MessageCircle className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">12</div>
            <p className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">
              3 awaiting your reply
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Profile Visits */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Chino Card Views</CardTitle>
            <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">142</div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Top 15% in your area
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Maya Level & XP */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Maya XP Level</CardTitle>
            <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">Level 5</div>
            <p className="text-[11px] text-muted-foreground font-medium">
              250 / 300 XP (50 XP to Lvl 6)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maya's Matchmaker Whisper (Daily Dating Advice) */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 text-xs shadow-2xs">
        <div className="size-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
          M
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-xs">Maya&apos;s Matchmaker Whisper</span>
            <Badge variant="outline" className="text-[9px] bg-background/80 text-violet-600 dark:text-violet-400 border-violet-500/30 py-0 px-1.5">
              Daily Tip
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed text-[11.5px]">
            &quot;Profiles with a specific answer to <em>&apos;The secret to my heart&apos;</em> and at least one favorite Nepali artist (like Albatross or Bipul Chettri) receive <strong className="text-foreground font-semibold">3.2x more conversation sparks</strong> in Kura-Kani. Keep your Chino fresh!&quot;
          </p>
        </div>
      </div>

      {/* Charts Section: Monthly Connection Trends & Activity Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Connection Velocity</CardTitle>
                <CardDescription className="text-xs">Monthly matches and message exchanges</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Last 6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pl-1 sm:pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Activity Breakdown</CardTitle>
            <CardDescription className="text-xs">Interaction split between dating and matrimonial modes</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <UserActivity />
          </CardContent>
        </Card>
      </div>

      {/* Recent Visitors & Connections */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Connections & Visitors</CardTitle>
            <CardDescription className="text-xs">People who recently interacted with or viewed your Chino</CardDescription>
          </div>
          <Link href="/account/users">
            <Button variant="ghost" size="sm" className="text-xs text-rose-500 hover:text-rose-600 gap-1 h-8">
              <span>View All</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <RecentUsers />
        </CardContent>
      </Card>
    </div>
  );
}