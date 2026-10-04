"use client";

import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/landing/brand-logo";
import {
  ButterflyIcon,
  CloudAtmosphere,
} from "@/components/landing/cloud-atmosphere";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showDivider?: boolean;
  className?: string;
}

// Background poster reel profiles matching Trakt's cinema wall signature
const REEL_PROFILES = [
  {
    name: "Aayusha Shrestha",
    age: 26,
    role: "Architect & Analog Photographer",
    city: "Kathmandu",
    match: 98,
    mode: "💖 Dating",
    gradient: "from-rose-500 via-pink-600 to-amber-500",
    initials: "AS",
    rotation: "-3.2deg",
    scale: 0.96,
  },
  {
    name: "Prashant Thapa",
    age: 27,
    role: "AI Engineer & Rock Climber",
    city: "Lalitpur",
    match: 94,
    mode: "💖 Dating",
    gradient: "from-violet-600 via-indigo-600 to-cyan-600",
    initials: "PT",
    rotation: "2.8deg",
    scale: 1.04,
  },
  {
    name: "Dr. Rohan Adhikari",
    age: 29,
    role: "Cardiologist & Musician",
    city: "Pokhara",
    match: 96,
    mode: "💍 Matrimonial",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    initials: "RA",
    rotation: "-1.8deg",
    scale: 0.98,
  },
  {
    name: "Smarika Rayamajhi",
    age: 25,
    role: "Visual Artist & Hiker",
    city: "Kathmandu",
    match: 97,
    mode: "💖 Dating",
    gradient: "from-pink-500 via-rose-600 to-purple-600",
    initials: "SR",
    rotation: "3.5deg",
    scale: 1.02,
  },
  {
    name: "Niraj Shrestha",
    age: 28,
    role: "Product Designer",
    city: "Bhaktapur",
    match: 95,
    mode: "💍 Matrimonial",
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
    initials: "NS",
    rotation: "-2.6deg",
    scale: 0.95,
  },
  {
    name: "Dikshya Gurung",
    age: 24,
    role: "Data Scientist",
    city: "Pokhara",
    match: 99,
    mode: "💖 Dating",
    gradient: "from-purple-500 via-pink-600 to-rose-500",
    initials: "DG",
    rotation: "2.1deg",
    scale: 1.05,
  },
  {
    name: "Pooja Sharma",
    age: 26,
    role: "Writer & Tea Curator",
    city: "Dharan",
    match: 93,
    mode: "💍 Matrimonial",
    gradient: "from-emerald-600 via-teal-600 to-indigo-600",
    initials: "PS",
    rotation: "-2.2deg",
    scale: 0.97,
  },
  {
    name: "Bipin Karki",
    age: 29,
    role: "Filmmaker & Trekker",
    city: "Butwal",
    match: 96,
    mode: "💖 Dating",
    gradient: "from-rose-600 via-purple-600 to-indigo-600",
    initials: "BK",
    rotation: "3.1deg",
    scale: 1.01,
  },
];

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-rose-500 selection:text-white",
        className,
      )}
    >
      {/* 1. Ambient Cloud Nine & Butterfly Atmosphere */}
      <CloudAtmosphere />

      {/* 2. Trakt-Inspired Tilted Match Poster Wall in Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none opacity-20 dark:opacity-15"
        aria-hidden="true"
      >
        <div className="absolute -inset-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {REEL_PROFILES.map((profile) => (
            <div
              key={profile.name}
              style={{
                transform: `rotate(${profile.rotation}) scale(${profile.scale})`,
              }}
              className="rounded-3xl border border-white/20 bg-gradient-to-br from-card to-card/60 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between h-[280px]"
            >
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-white/90">
                  {profile.mode}
                </span>
                <span className="text-emerald-400 font-extrabold">
                  ● {profile.match}% Match
                </span>
              </div>

              <div className="my-auto text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${profile.gradient} mx-auto flex items-center justify-center text-xl font-black text-white shadow-lg`}
                >
                  {profile.initials}
                </div>
              </div>

              <div>
                <p className="font-extrabold text-sm text-foreground">
                  {profile.name}
                </p>
                <p className="text-xs text-muted-foreground">{profile.role}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  {profile.city} · Nepal
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Soft Radial Vignette to keep form foreground crisp & ultra-legible */}
        <div className="absolute inset-0 bg-radial-gradient from-background/60 via-background/85 to-background" />
      </div>

      {/* 3. Top Auth Navigation Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-5 flex items-center justify-between border-b border-border/30 backdrop-blur-xs">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <BrandLogo className="w-8 h-8" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              Mayalu
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 border border-rose-500/20">
              <ButterflyIcon className="w-3 h-3" />
              मयालु
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <ModeToggle />
        </div>
      </header>

      {/* 4. Center Trakt-Style Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-[460px] space-y-6">
          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center space-y-2 mb-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-500 shadow-xs mb-1">
                <ButterflyIcon className="w-3 h-3" />
                <span>Love on Cloud Nine</span>
              </div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          <div className="relative">{children}</div>
        </div>
      </main>

      {/* 5. Auth Footer */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-border/30 text-xs text-muted-foreground backdrop-blur-xs">
        <p className="max-w-md mx-auto">
          By continuing, you agree to Mayalu&apos;s{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-rose-500 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-rose-500 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <span>Mayalu</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />{" "}
            Nepal&apos;s Graph Dating & Matrimony
          </span>
        </div>
      </footer>
    </div>
  );
}
