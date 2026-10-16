"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Dices, Check, Smile, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  type DiceBearStyleName,
  DICEBEAR_STYLES,
  CURATED_DICEBEAR_SEEDS,
  getDiceBearUrl,
} from "@/lib/dicebear";

interface DiceBearAvatarStudioProps {
  selectedAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
  userFirstName?: string;
  variant?: "card" | "plain";
  className?: string;
}

const SURPRISE_SEEDS = [
  "Milo",
  "Sushi",
  "Maya",
  "Aarav",
  "Priya",
  "Rohan",
  "Sneha",
  "Bikash",
  "Pooja",
  "Anjali",
  "Kiran",
  "Diwas",
  "Samir",
  "Shraddha",
  "Bibek",
  "Kanchhi",
  "Paras",
  "Simran",
  "Gaurav",
  "Prakriti",
];

export function DiceBearAvatarStudio({
  selectedAvatarUrl,
  onSelectAvatar,
  userFirstName,
  variant = "card",
  className = "",
}: DiceBearAvatarStudioProps) {
  const [activeStyle, setActiveStyle] =
    React.useState<DiceBearStyleName>("initial-face");
  const [customSeed, setCustomSeed] = React.useState("");
  const [isRolling, setIsRolling] = React.useState(false);

  // If user has a name, add it as a primary quick option
  const quickSeeds = React.useMemo(() => {
    const list = [...CURATED_DICEBEAR_SEEDS] as string[];
    if (userFirstName && !list.includes(userFirstName)) {
      list.unshift(userFirstName);
    }
    return list;
  }, [userFirstName]);

  const handlePickSeed = (seed: string) => {
    const url = getDiceBearUrl(seed, activeStyle);
    onSelectAvatar(url);
  };

  const handleStyleChange = (style: DiceBearStyleName) => {
    setActiveStyle(style);
    // Re-generate current avatar with new style
    const currentSeed = customSeed || userFirstName || "Milo";
    onSelectAvatar(getDiceBearUrl(currentSeed, style));
  };

  const handleApplyCustomSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSeed.trim()) {
      handlePickSeed(customSeed.trim());
    }
  };

  const handleRollRandom = () => {
    setIsRolling(true);
    const randomSeed =
      SURPRISE_SEEDS[Math.floor(Math.random() * SURPRISE_SEEDS.length)];
    setCustomSeed(randomSeed);
    handlePickSeed(randomSeed);
    setTimeout(() => setIsRolling(false), 300);
  };

  const containerClasses =
    variant === "plain"
      ? `flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-3.5 shadow-xs ${className}`
      : `rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-3.5 flex flex-col gap-3 shadow-xs ${className}`;

  return (
    <div className={containerClasses}>
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
          <Smile className="size-3.5" />
          <span>Avatar Customizer</span>
          <Badge
            variant="outline"
            className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 py-0"
          >
            DiceBear
          </Badge>
        </div>
        <button
          type="button"
          onClick={handleRollRandom}
          className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1 font-medium transition-all active:scale-[0.96]"
        >
          <Dices
            className={`size-3.5 ${isRolling ? "animate-spin" : ""}`}
          />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Style Selector Tabs */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Palette className="size-3" />
          Avatar Style:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DICEBEAR_STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleStyleChange(st.id)}
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-all font-medium active:scale-[0.96] ${
                activeStyle === st.id
                  ? "bg-rose-500 text-white shadow-xs font-semibold"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {st.label}
              {st.id === "initial-face" && " ✨"}
            </button>
          ))}
        </div>
      </div>

      {/* Curated Seeds Grid / Carousel */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-muted-foreground font-medium">
          Choose a Curated Face:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {quickSeeds.map((seed) => {
            const avatarUrl = getDiceBearUrl(seed, activeStyle);
            const isSelected = selectedAvatarUrl === avatarUrl;

            return (
              <button
                key={seed}
                type="button"
                onClick={() => handlePickSeed(seed)}
                className={`relative rounded-2xl overflow-hidden p-1 transition-all shrink-0 flex flex-col items-center gap-1 group active:scale-[0.95] ${
                  isSelected
                    ? "ring-2 ring-rose-500 scale-105 bg-rose-500/15 shadow-sm"
                    : "border border-border/60 hover:border-rose-500/40 opacity-75 hover:opacity-100 bg-background/80"
                }`}
                title={`Select ${seed}`}
              >
                <div className="size-11 relative rounded-xl overflow-hidden bg-muted/30">
                  <Image
                    src={avatarUrl}
                    alt={seed}
                    width={44}
                    height={44}
                    className="size-full object-cover"
                    unoptimized
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                      <Check className="size-4 text-rose-500 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[48px]">
                  {seed}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Seed Input */}
      <form onSubmit={handleApplyCustomSeed} className="flex gap-2 items-center">
        <Input
          placeholder="Custom seed name (e.g. Kathmandu, Milo)..."
          value={customSeed}
          onChange={(e) => setCustomSeed(e.target.value)}
          className="h-8 text-xs bg-background/80 rounded-xl"
        />
        <Button
          type="submit"
          size="sm"
          className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-xl shrink-0 active:scale-[0.97] transition-transform"
        >
          <Sparkles className="size-3 mr-1" />
          Apply
        </Button>
      </form>
    </div>
  );
}
