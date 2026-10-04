"use client";

import { Compass, HeartHandshake, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { BrandLogo } from "./brand-logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <BrandLogo className="w-9 h-9" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Mayalu
              </span>
              <span className="hidden sm:inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 border border-rose-500/20">
                मयालु
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
              Graph Dating & Matrimony
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <a
            href="#spotlight"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Compass className="w-4 h-4 text-rose-500" />
            Discover
          </a>
          <a
            href="#dual-modes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            Dual Modes
          </a>
          <a
            href="#graph-match"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Graph Tech
          </a>
          <a
            href="#xp-gamify"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Trophy className="w-4 h-4 text-blue-500" />
            XP & Rewards
          </a>
          <a
            href="#roadmap"
            className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Roadmap
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ModeToggle />

          <Link href="/auth/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/auth/sign-up">
            <Button
              size="sm"
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-rose-500/40 hover:scale-105 active:scale-95"
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
      </div>
    </header>
  );
}
