"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  EyeOff,
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ButterflyIcon } from "./cloud-atmosphere";

export function Privacy() {
  const [isPhotoUnblurred, setIsPhotoUnblurred] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const trustGuarantees = [
    {
      icon: Mail,
      title: "Your photo stays in my Dhukuti until you say so.",
      desc: "Everyone sees your photos blurred until you match. Then they unblur, just for the two of you.",
      accent: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
    {
      icon: UserCheck,
      title: "Only your nickname, age, city and answers are shown.",
      desc: "No full names, no phone numbers, and no contact info displayed on your public profile card.",
      accent: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      icon: ShieldCheck,
      title:
        "Caste, gotra and visa status stay private. I only use them for matching.",
      desc: "Never shown on your card. Handled as strictly confidential parameters for graph compatibility.",
      accent: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    },
    {
      icon: CheckCircle2,
      title: "I check everyone’s selfie myself, privately.",
      desc: "Zero bots, zero catfishes. Your verification selfie never shows on your profile and is deleted after approval.",
      accent: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      icon: UserX,
      title: "You can block or report anyone, anytime.",
      desc: "Complete personal sovereignty. One-tap boundaries immediately remove unwanted interactions.",
      accent: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      icon: Lock,
      title: "No Facebook login. Nothing ever gets posted anywhere.",
      desc: "Independent, encrypted authentication. Your romantic journey leaves zero public social footprints.",
      accent: "from-pink-500 to-rose-600",
      iconBg: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    },
  ];

  const faqs = [
    {
      q: "How does Mayalu matchmaking work?",
      a: "Once I've checked your selfie, you get up to ten picks a day: people who fit what you're looking for. Tap 💘 on the ones you like. If they like you back, it's a match, your photos unblur, and you can chat right here. Swap numbers only when you're both ready.",
      badge: "Core Journey",
    },
    {
      q: "Will anyone see my caste, gotra, religion or visa status?",
      a: "Never. Caste, gotra, religion and visa status stay private. I only use them for matching, and only if you choose to answer.",
      badge: "Confidentiality",
    },
    {
      q: "Who can see my photos?",
      a: "Nobody, until you both say yes. Everyone sees your photos blurred until you match. Then they unblur, just for the two of you.",
      badge: "Photo Dhukuti",
    },
    {
      q: "How does selfie verification work?",
      a: "Everyone sends me a quick selfie, and I check each one myself. Your selfie never shows on your profile, and I delete it once you’re verified.",
      badge: "100% Verified Humans",
    },
  ];

  return (
    <section
      id="privacy"
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-t border-border/40"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-1 text-xs font-semibold text-rose-500 uppercase tracking-widest backdrop-blur-md shadow-xs">
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>Mayalu&apos;s Privacy Dhukuti</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Your photo stays in my Dhukuti{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              until you say so.
            </span>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Only your nickname, age, city and answers are shown. Zero public
            broadcasts, no awkward family prying, and no unsolicited contacts.
            Real Nepali connection, protected by absolute trust.
          </p>
        </motion.div>

        {/* Interactive Dhukuti Simulator & Trust Card */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-rose-500/20 bg-card/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              {/* Left explanation */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                  <ButterflyIcon className="w-4 h-4" />
                  <span>The Mutual Unblur Protocol</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Nobody sees your face until you both say yes.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse by personality, values, humor, and lifestyle. Your
                  portrait remains softly frosted and sealed inside our digital
                  Dhukuti until both of you tap 💘. Then, and only then, does
                  your photo unblur exclusively for the two of you.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="border-rose-500/30 text-rose-500 bg-rose-500/5"
                  >
                    Blurred by Default 🔒
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-violet-500/30 text-violet-500 bg-violet-500/5"
                  >
                    Unblur on Mutual 💘
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                  >
                    Private Chat Inside 💌
                  </Badge>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => setIsPhotoUnblurred(!isPhotoUnblurred)}
                    className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold text-xs sm:text-sm px-5 py-2 shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPhotoUnblurred ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Re-Seal in Dhukuti (Blur Photo)
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2 fill-white" />
                        Simulate Mutual Match 💘 (Unblur)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Right: Simulated Profile Dhukuti Card */}
              <div className="w-full sm:w-72 shrink-0">
                <div className="relative rounded-2xl overflow-hidden border border-rose-500/30 bg-background/90 p-4 shadow-xl">
                  {/* Photo Frame */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden bg-muted">
                    <Image
                      src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Sample Mayalu Profile"
                      fill
                      className={`object-cover transition-all duration-700 ease-in-out ${
                        isPhotoUnblurred
                          ? "blur-none scale-100 filter-none"
                          : "blur-xl scale-110 filter saturate-150"
                      }`}
                    />

                    {/* Dhukuti overlay when blurred */}
                    {!isPhotoUnblurred && (
                      <div className="absolute inset-0 bg-background/30 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-2 shadow-lg animate-pulse">
                          <Mail className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-foreground drop-shadow-sm">
                          Photo Sealed in Dhukuti
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          Tap 💘 below to unblur
                        </span>
                      </div>
                    )}

                    {isPhotoUnblurred && (
                      <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-in fade-in-50">
                        <Sparkles className="w-3 h-3" />
                        Mutual Match!
                      </div>
                    )}
                  </div>

                  {/* Profile Metadata */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        Aayusha, 26
                      </span>
                      <span className="text-[11px] text-rose-500 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        Patan, Lalitpur
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      &quot;Weekend Chiya walks around Patan Dhoka & spontaneous
                      indie gigs.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Privacy Promises Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Our 6 Unbreakable Trust Guarantees
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Every design decision is crafted around your dignity, security,
              and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustGuarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.08,
                    ease: "easeOut",
                  }}
                  className="group relative rounded-2xl border border-border/70 hover:border-rose-500/30 bg-card/60 hover:bg-card/90 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${item.iconBg} transition-transform group-hover:scale-110 duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-rose-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Curated Matchmaking & Privacy FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Clear & Honest Answers
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border/70 hover:border-rose-500/30 bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-foreground hover:text-rose-500 transition-colors gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                        {faq.badge}
                      </span>
                      <span className="text-sm sm:text-base font-bold leading-tight">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-muted/10"
                    >
                      <p className="text-foreground/90 font-medium">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

