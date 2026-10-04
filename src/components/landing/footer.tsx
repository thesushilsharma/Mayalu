"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";
import { ButterflyIcon } from "./cloud-atmosphere";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-card/60 backdrop-blur-xl pt-16 pb-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo className="w-8 h-8" />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                  Mayalu
                </span>
                <span className="text-xs text-rose-500 font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-1">
                  <ButterflyIcon className="w-3 h-3" />
                  मयालु
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              <strong className="text-foreground">Mayalu</strong> (मयालु) means{" "}
              <em>Beloved</em> or <em>My Love</em> in Nepali. Where authentic
              butterflies meet on Cloud Nine, uniting romantic souls and
              lifelong matrimonial partnerships powered by Neo4j graph
              technology.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Neo4j Graph & Neon DB Active</span>
            </div>
          </div>

          {/* Navigation Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Discovery
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="#spotlight"
                  className="hover:text-rose-500 transition-colors"
                >
                  Spotlight Matches
                </a>
              </li>
              <li>
                <a
                  href="#dual-modes"
                  className="hover:text-rose-500 transition-colors"
                >
                  Dating Mode
                </a>
              </li>
              <li>
                <a
                  href="#dual-modes"
                  className="hover:text-amber-500 transition-colors"
                >
                  Matrimonial Mode
                </a>
              </li>
              <li>
                <a
                  href="#graph-match"
                  className="hover:text-violet-500 transition-colors"
                >
                  Neo4j Graph Tech
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Community & Gamify
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="#xp-gamify"
                  className="hover:text-amber-500 transition-colors"
                >
                  XP Level Progression
                </a>
              </li>
              <li>
                <a
                  href="#xp-gamify"
                  className="hover:text-purple-500 transition-colors"
                >
                  Unlockable Themes
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="hover:text-rose-500 transition-colors"
                >
                  Product Roadmap
                </a>
              </li>
              <li>
                <Link
                  href="/auth/sign-up"
                  className="hover:text-rose-500 transition-colors"
                >
                  Join Mayalu Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="hover:text-foreground transition-colors"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} Mayalu. All rights reserved. Crafted with care for
            meaningful romantic connection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Built with Next.js 16, Neo4j & Neon</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-muted-foreground/60">•</span>
            <span className="flex items-center gap-1 font-medium text-foreground/80">
              <ButterflyIcon className="w-3.5 h-3.5" />
              Love on Cloud Nine
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
