"use client";

import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Heart,
  Laptop,
  Lock,
  RotateCw,
  Share2,
  Smartphone,
  Sparkles,
  Tablet,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

export function AppDownload() {
  const containerRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const [swipedState, setSwipedState] = useState<"none" | "liked" | "passed">(
    "none",
  );

  // Framer Motion Drag values for phone card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-15, 15]);
  const opacityLike = useTransform(x, [10, 60], [0, 1]);
  const opacityPass = useTransform(x, [-10, -60], [0, 1]);

  // Gentle floating physics for phone mockup via GSAP
  useGSAP(
    () => {
      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          y: "+=8",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: containerRef },
  );

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 50) {
      setSwipedState("liked");
      setTimeout(() => setSwipedState("none"), 1200);
    } else if (info.offset.x < -50) {
      setSwipedState("passed");
      setTimeout(() => setSwipedState("none"), 1200);
    }
  };

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/70 bg-gradient-to-b from-card via-card/95 to-background p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/15 blur-[120px] rounded-full" />
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-violet-500/15 blur-[120px] rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy: Cross-device web browser experience */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-500 shadow-xs">
                <Globe className="w-3.5 h-3.5" />
                Browser-First Web App · Mobile · Tablet · Laptop
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                One web platform.{" "}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                  Every screen size.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                No App Store or Google Play downloads required. Open Mayalu
                directly in any modern browser on your phone, tablet, or laptop.
                Enjoy instant cloud synchronization, touch gestures, and
                full-screen Progressive Web App (PWA) support.
              </p>

              {/* 3 Device compatibility breakdown cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs flex flex-col gap-1.5 hover:border-rose-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span>Mobile Browser</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Fluid swipe physics, voice notes & touch-optimized mobile
                    web interface.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs flex flex-col gap-1.5 hover:border-pink-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Tablet className="w-4 h-4 text-pink-500" />
                    <span>Tablet & iPad</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Split-screen conversations, relationship graph exploration &
                    gallery views.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs flex flex-col gap-1.5 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Laptop className="w-4 h-4 text-indigo-500" />
                    <span>Laptop & Desktop</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    High-res matchmaking, detailed matrimonial profiles &
                    keyboard navigation.
                  </p>
                </div>
              </div>

              {/* Primary action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="h-12 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>Launch Web App</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-border/80 bg-card/90 text-xs sm:text-sm font-medium text-muted-foreground">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>PWA Ready · Add to Home Screen</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Safari, Chrome, Edge & Firefox
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Zero storage overhead
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Instant real-time sync
                </span>
              </div>
            </motion.div>

            {/* Right Phone Mockup Styled as Mobile Web Browser */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                ref={phoneRef}
                className="relative w-72 h-[440px] rounded-[44px] border-4 border-neutral-800 bg-neutral-950 p-3.5 shadow-2xl shadow-rose-500/15 flex flex-col justify-between"
              >
                {/* Phone Speaker Notch */}
                <div className="w-22 h-4 bg-neutral-900 rounded-full mx-auto mb-2" />

                {/* Mobile Browser Window */}
                <div className="flex-1 rounded-[28px] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800/80 p-3 flex flex-col justify-between text-white overflow-hidden relative">
                  {/* Browser URL bar */}
                  <div className="rounded-xl bg-neutral-950/90 border border-neutral-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-neutral-400 mb-2 shadow-inner">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="font-mono text-[10px]">
                        mayalu.app/discover
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <RotateCw className="w-2.5 h-2.5" />
                      <Share2 className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Inside Web Page Header */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5 px-1">
                      <span className="flex items-center gap-1 font-bold text-neutral-300">
                        <Sparkles className="w-3 h-3 text-rose-500" />
                        Live Web Session
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ● Online Sync
                      </span>
                    </div>

                    {/* Interactive Swipeable Mini-Card */}
                    <div className="relative h-40 w-full mt-1">
                      <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        style={{ x, rotate }}
                        onDragEnd={handleDragEnd}
                        whileTap={{ cursor: "grabbing" }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 p-4 flex flex-col justify-between shadow-lg cursor-grab select-none"
                      >
                        {/* Drag Overlay Badges */}
                        <motion.div
                          style={{ opacity: opacityLike }}
                          className="absolute top-2 right-2 border-2 border-emerald-400 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg rotate-12"
                        >
                          LIKE
                        </motion.div>
                        <motion.div
                          style={{ opacity: opacityPass }}
                          className="absolute top-2 left-2 border-2 border-rose-400 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg -rotate-12"
                        >
                          PASS
                        </motion.div>

                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-md self-start">
                          Featured Profile
                        </span>

                        <div>
                          <h4 className="font-extrabold text-base text-white">
                            Aayusha, 26
                          </h4>
                          <p className="text-[11px] text-white/80">
                            Kathmandu · Architect
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Swipe Status Feedback */}
                  <div className="text-center py-1">
                    {swipedState === "liked" ? (
                      <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-emerald-400" />{" "}
                        Connected!
                      </p>
                    ) : swipedState === "passed" ? (
                      <p className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1">
                        <X className="w-3.5 h-3.5" /> Next Profile
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-400 italic">
                        ← Drag card left / right in browser →
                      </p>
                    )}
                  </div>

                  {/* Phone action buttons */}
                  <div className="flex justify-center items-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSwipedState("passed");
                        setTimeout(() => setSwipedState("none"), 1200);
                      }}
                      className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSwipedState("liked");
                        setTimeout(() => setSwipedState("none"), 1200);
                      }}
                      className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-sm shadow-md shadow-rose-500/40 transition-transform active:scale-90 cursor-pointer"
                    >
                      ♥
                    </button>
                  </div>
                </div>

                {/* Phone bottom bar */}
                <div className="w-24 h-1 bg-neutral-700 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
