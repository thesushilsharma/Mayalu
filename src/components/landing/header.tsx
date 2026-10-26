"use client";

import {
  ChevronDown,
  Compass,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessagesSquare,
  Milestone,
  Settings,
  Sparkles,
  Trophy,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { ModeToggle } from "../mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BrandLogo } from "./brand-logo";
import { ButterflyIcon } from "./cloud-atmosphere";

export default function Header() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const scrollToSection = (selector: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userInitial = (
    session?.user?.name?.[0] ||
    session?.user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const displayName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Member";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-500/10 dark:border-rose-500/10 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-2xs pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow] duration-200 ease-out">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group transition-transform active:scale-95 shrink-0"
        >
          <div className="relative">
            <BrandLogo className="w-9 h-9 transition-transform group-hover:scale-105 duration-300" />
            <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Mayalu
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 border border-rose-500/20 shadow-xs">
                <ButterflyIcon className="w-3 h-3 text-rose-500 animate-pulse" />
                मयालु
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
              Romantic Graph Dating & Matrimony
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-medium text-muted-foreground">
          <a
            href="#spotlight"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors"
          >
            <Compass className="w-4 h-4 text-rose-500" />
            Discover
          </a>
          <a
            href="#dual-modes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors"
          >
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            Dual Modes
          </a>
          <a
            href="#graph-match"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-violet-500/5 dark:hover:bg-violet-500/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Graph Tech
          </a>
          <a
            href="#xp-gamify"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-colors"
          >
            <Trophy className="w-4 h-4 text-blue-500" />
            XP & Rewards
          </a>
          <a
            href="#privacy"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-colors"
          >
            <Mail className="w-4 h-4 text-pink-500" />
            Privacy
          </a>
          <a
            href="#roadmap"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors"
          >
            <Milestone className="w-4 h-4 text-emerald-500" />
            Roadmap
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ModeToggle />

          {/* Dynamic Session State */}
          {isPending ? (
            <div className="h-8 w-24 rounded-full bg-muted/60 animate-pulse hidden sm:block" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/account/dashboard" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  className="relative group overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/35 hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                    <span className="text-white/80 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>

              {/* User Menu Dropdown (Visible on sm and up) */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1.5 p-1 rounded-full border border-border/70 hover:border-rose-500/30 bg-background/60 hover:bg-muted/50 transition-all cursor-pointer focus:outline-none"
                    aria-label="User account options"
                  >
                    <Avatar className="w-7 h-7 border border-rose-500/30">
                      {session.user.image ? (
                        <AvatarImage
                          src={session.user.image}
                          alt={displayName}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-[11px] font-bold text-rose-500">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-3 h-3 text-muted-foreground mr-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl border border-rose-500/20 bg-background/95 backdrop-blur-xl p-2 shadow-2xl"
                  >
                    <DropdownMenuLabel className="px-2 py-1.5 font-normal">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {session.user.name || "Mayalu Member"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 border-border/50" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push("/account/dashboard")}
                        className="rounded-lg gap-2 cursor-pointer text-xs font-medium normal-case"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-rose-500" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/account/profile")}
                        className="rounded-lg gap-2 cursor-pointer text-xs font-medium normal-case"
                      >
                        <User className="w-3.5 h-3.5 text-violet-500" />
                        Profile & Chino
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/account/chats")}
                        className="rounded-lg gap-2 cursor-pointer text-xs font-medium normal-case"
                      >
                        <MessagesSquare className="w-3.5 h-3.5 text-amber-500" />
                        Conversations
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/account/settings")}
                        className="rounded-lg gap-2 cursor-pointer text-xs font-medium normal-case"
                      >
                        <Settings className="w-3.5 h-3.5 text-blue-500" />
                        Account Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1 border-border/50" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      variant="destructive"
                      className="rounded-lg gap-2 cursor-pointer text-xs font-medium normal-case text-rose-600 focus:text-rose-600 focus:bg-rose-500/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="relative group overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-rose-500/40 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get Started
                    <span className="text-white/80 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle (Visible on lg and below) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-rose-500" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-border/40 bg-background/95 backdrop-blur-2xl px-4 py-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection("#spotlight")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-rose-500" />
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#dual-modes")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-500" />
              Dual Modes
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#graph-match")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-violet-500/10 hover:text-violet-500 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              Graph Tech
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#xp-gamify")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-blue-500" />
              XP & Rewards
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#privacy")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-pink-500/10 hover:text-pink-500 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-pink-500" />
              Privacy & Trust
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#roadmap")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <Milestone className="w-4 h-4 text-emerald-500" />
              Roadmap
            </button>

            <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/40 border border-border/40">
                    <Avatar className="w-8 h-8 border border-rose-500/30">
                      {session.user.image ? (
                        <AvatarImage
                          src={session.user.image}
                          alt={displayName}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-xs font-bold text-rose-500">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold truncate text-foreground">
                        {session.user.name || "Mayalu Member"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/account/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button className="w-full rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 font-semibold text-white shadow-md shadow-rose-500/20">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl gap-1.5 text-xs"
                      >
                        <User className="w-3.5 h-3.5 text-violet-500" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full rounded-xl gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-xl text-xs font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-xs font-semibold text-white shadow-md shadow-rose-500/25">
                      Get Started →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
