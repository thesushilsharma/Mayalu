"use client";

import {
  Camera,
  ChevronRight,
  CircleUser,
  Flame,
  HeartIcon,
  Home,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo, useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/userContext";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./auth/logout-button";

const navItems = [
  { name: "Hallway", href: "/account/hallway", icon: Flame },
  { name: "Dashboard", href: "/account/dashboard", icon: Home },
  { name: "Kura-Kani", href: "/account/chats", icon: MessageCircle },
  { name: "Chino", href: "/account/profile", icon: CircleUser },
  { name: "Settings", href: "/account/settings", icon: Settings },
];

function DashboardUserLayout() {
  const pathname = usePathname();
  const { userLevel, userProfile, superLikes } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isStandaloneRoute =
    pathname.startsWith("/account/onboarding") ||
    pathname.startsWith("/account/users");

  // Derive display values from live user context (guarded by mounted state to ensure exact match with SSR static shell)
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
  const isOnboarded = mounted && Boolean(userProfile?.onboardingCompleted);
  const isAdmin = mounted && userProfile?.role === "admin";
  const displayLevel = mounted ? userLevel.level : 1;
  const displaySuperLikes = mounted ? superLikes : 3;
  const isProfileActive =
    pathname === "/account/profile" || pathname.startsWith("/account/profile/");

  // Navigation items for the user dashboard
  const activeNavItems = navItems;

  // Memoize navigation items for bottom nav (first 4 items)
  const bottomNavItems = useMemo(() => {
    return activeNavItems.slice(0, 4).map((item) => {
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-all duration-200 rounded-xl min-w-0 flex-1",
            isActive
              ? "text-pink-500 bg-pink-50 dark:bg-pink-500/10 font-medium scale-105"
              : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105",
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <item.icon
            className={cn("h-5 w-5 shrink-0", isActive && "text-pink-500")}
          />
          <span className="truncate">{item.name}</span>
        </Link>
      );
    });
  }, [activeNavItems, pathname]);

  // Remaining nav items for dropdown
  const dropdownNavItems = useMemo(() => {
    return activeNavItems.slice(4).map((item) => {
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <DropdownMenuItem key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-2 w-full cursor-pointer",
              isActive && "bg-accent text-accent-foreground font-medium",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        </DropdownMenuItem>
      );
    });
  }, [activeNavItems, pathname]);

  // Desktop sidebar nav items
  const sidebarNavItems = useMemo(() => {
    return activeNavItems.map((item) => {
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 rounded-xl group relative overflow-hidden",
            isActive
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md shadow-pink-500/20"
              : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm font-medium",
          )}
          aria-current={isActive ? "page" : undefined}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          )}
          <item.icon
            className={cn(
              "h-5 w-5 shrink-0 transition-all duration-200 relative z-10",
              isActive
                ? "text-white"
                : "text-gray-500 dark:text-gray-400 group-hover:text-pink-500 group-hover:scale-110",
            )}
          />
          <span className="relative z-10">{item.name}</span>
        </Link>
      );
    });
  }, [activeNavItems, pathname]);


  // Hide all dashboard chrome during onboarding or admin moderation console
  if (isStandaloneRoute) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-gradient-to-b lg:from-white lg:to-gray-50/50 lg:dark:from-gray-900 lg:dark:to-gray-900/95 lg:backdrop-blur-sm lg:border-r lg:border-gray-200/80 lg:dark:border-gray-800/80 lg:shadow-sm">
        {/* Desktop Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/80 dark:border-gray-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all duration-300 group-hover:scale-105">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
              Mayalu
            </span>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="mx-4 my-4">
          <Link
            href="/account/profile"
            className={cn(
              "group block p-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
              "bg-gradient-to-br from-pink-50/90 via-rose-50/70 to-purple-50/40 dark:from-pink-950/30 dark:via-rose-950/20 dark:to-purple-950/20",
              "border border-pink-200/70 dark:border-pink-900/40 shadow-xs",
              "hover:border-rose-400/60 dark:hover:border-rose-500/50 hover:shadow-md hover:shadow-pink-500/10 hover:scale-[1.01] active:scale-[0.99]",
              isProfileActive &&
                "ring-2 ring-rose-500/50 border-rose-400 bg-pink-100/40 dark:bg-pink-950/40"
            )}
            title="View & manage your authentic Chino profile"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-pink-300 dark:ring-pink-700 group-hover:ring-rose-500 transition-all shadow-sm">
                  <AvatarImage
                    src={displayAvatar}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback suppressHydrationWarning className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold text-sm">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>
                {isVerified && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold border-2 border-background shadow-xs"
                    title="Maya Verified"
                  >
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p suppressHydrationWarning className="text-sm font-bold truncate text-gray-900 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {displayName}
                  </p>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <div className="text-xs font-medium truncate flex items-center gap-1 mt-0.5">
                  {isVerified ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span>Maya Verified</span>
                    </span>
                  ) : isReview ? (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Camera className="h-3 w-3 shrink-0 animate-pulse" />
                      <span>In Review</span>
                    </span>
                  ) : isAdmin ? (
                    <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span>Admin Member</span>
                    </span>
                  ) : isOnboarded ? (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 truncate">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {userProfile?.location || "Chino Active"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 shrink-0 animate-pulse" />
                      <span>Weave Chino →</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-pink-200/50 dark:border-pink-900/30">
              <Badge
                suppressHydrationWarning
                variant="secondary"
                className="bg-white/80 dark:bg-gray-800/80 text-pink-600 dark:text-pink-400 border-pink-200/80 dark:border-pink-800/80 font-semibold text-xs py-0.5 px-2"
                title={`Level ${displayLevel} (${userLevel.xp}/${userLevel.requiredXp} XP)`}
              >
                <Zap className="h-3 w-3 mr-1 fill-pink-500 text-pink-500" />
                Level {displayLevel}
              </Badge>
              <Badge
                suppressHydrationWarning
                variant="secondary"
                className="bg-white/80 dark:bg-gray-800/80 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/80 font-semibold text-xs py-0.5 px-2"
                title={`${displaySuperLikes} Super Likes`}
              >
                <Zap className="h-3 w-3 mr-1 text-blue-500 fill-blue-500" />
                {displaySuperLikes} Super
              </Badge>
              <span className="ml-auto text-[10px] text-muted-foreground group-hover:text-rose-500 transition-colors font-medium">
                Chino →
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {sidebarNavItems}
        </nav>

        {/* Desktop Footer Actions */}
        <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
            <ModeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile/Tablet Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-2 rounded-xl shadow-md shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all duration-300 group-hover:scale-105">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
              Mayalu
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/account/profile"
              className="flex items-center gap-1.5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 px-2.5 py-1.5 rounded-lg border border-pink-200 dark:border-pink-900/30 hover:border-pink-400 transition-colors"
              title="View your Level & Chino"
            >
              <Badge
                suppressHydrationWarning
                variant="secondary"
                className="text-xs font-semibold bg-white/80 dark:bg-gray-800/80 border-0"
              >
                Lv.{displayLevel}
              </Badge>
              <div className="flex items-center gap-1 px-1.5">
                <Zap className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                <span suppressHydrationWarning className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {displaySuperLikes}
                </span>
              </div>
            </Link>

            <Link
              href="/account/profile"
              title="View Chino Profile"
              className="transition-transform active:scale-95"
            >
              <Avatar className="h-9 w-9 ring-2 ring-pink-300 dark:ring-pink-700 hover:ring-rose-500 transition-all shadow-xs">
                <AvatarImage
                  src={displayAvatar}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback suppressHydrationWarning className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-semibold">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </Link>

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile/Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2.5">
          {/* Main nav items */}
          {bottomNavItems}

          {/* More menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className:
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs h-auto min-w-0 flex-1 transition-all duration-200 rounded-xl hover:bg-accent hover:scale-105",
              })}
            >
              <Menu className="h-5 w-5" />
              <span className="truncate">More</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2 shadow-xl">
              {dropdownNavItems}
              <DropdownMenuItem>
                <div className="flex items-center gap-2 w-full cursor-pointer">
                  <LogoutButton />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export default memo(DashboardUserLayout);
