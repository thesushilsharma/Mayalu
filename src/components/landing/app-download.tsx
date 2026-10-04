import { Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function AppDownload() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/70 bg-gradient-to-b from-card via-card/95 to-background p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full" />
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left copy: Trakt-inspired */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-500">
                <Smartphone className="w-3.5 h-3.5" />
                Cross-Platform Everywhere
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Get the Mayalu app.{" "}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                  Love on the go.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience instant match notifications, seamless voice note
                exchanges, and gamified speed dates on iOS, Android, and Web
                PWA.
              </p>

              {/* Trakt-style app store badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                {/* Apple App Store */}
                <a
                  href="#app-store"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group"
                >
                  <svg
                    className="w-7 h-7 fill-white group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Apple logo"
                  >
                    <title>Apple App Store</title>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.9.04-2.02.6-2.67 1.34-.56.63-1.07 1.66-.94 2.7.99.08 2-.45 2.6-1.17z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      Download on the
                    </span>
                    <span className="block text-sm font-bold text-white tracking-tight -mt-0.5">
                      App Store
                    </span>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#google-play"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group"
                >
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Google Play logo"
                  >
                    <title>Google Play Store</title>
                    <path
                      fill="#EA4335"
                      d="M3.6 1.7L13.8 12 3.6 22.3c-.4-.4-.6-1-.6-1.7V3.4c0-.7.2-1.3.6-1.7z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M17.3 8.6L13.8 12l3.5 3.4 3.9-2.2c1.1-.6 1.1-1.7 0-2.3l-3.9-2.3z"
                    />
                    <path
                      fill="#4285F4"
                      d="M3.6 22.3l10.2-10.3 3.5 3.4-11.6 6.6c-.8.5-1.6.5-2.1.3z"
                    />
                    <path
                      fill="#34A853"
                      d="M13.8 12L3.6 1.7c.5-.2 1.3-.2 2.1.3l11.6 6.6-3.5 3.4z"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      GET IT ON
                    </span>
                    <span className="block text-sm font-bold text-white tracking-tight -mt-0.5">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* Web App CTA */}
                <Link href="/auth/sign-up">
                  <Button
                    variant="outline"
                    className="h-[52px] rounded-2xl border-border px-5 text-sm font-semibold hover:bg-muted"
                  >
                    Open Web App (PWA)
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Phone Mockup Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-[380px] rounded-[36px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl shadow-rose-500/10 flex flex-col justify-between">
                {/* Phone Speaker Notch */}
                <div className="w-20 h-4 bg-neutral-900 rounded-full mx-auto mb-2" />

                {/* In-app preview */}
                <div className="flex-1 rounded-[24px] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 p-4 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
                      <span>Mayalu Live</span>
                      <span className="text-rose-500 font-bold">
                        ● 98% Match
                      </span>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                      Aayusha, 26
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center">
                    <p className="text-xs font-bold">
                      Himalayan Trek Enthusiast
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Swipe right to level up connection
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-rose-400">
                      ✕
                    </div>
                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-xs text-white">
                      ♥
                    </div>
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
