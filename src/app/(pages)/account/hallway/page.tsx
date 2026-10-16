"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Lock, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUserLevel } from "@/contexts/userContext";
import { TinderSwipeDeck, type Profile } from "@/components/tinder-swipe-deck";
import { getDiceBearUrl } from "@/lib/dicebear";
import { toast } from "sonner";

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Aastha",
    age: 26,
    location: "San Francisco, CA (Kathmandu)",
    bio: "UX Designer by day, amateur momo chef by weekend. Always up for misty hikes in Marin and hunting for genuine Nepali chiya spots! 🏔️☕",
    images: [
      getDiceBearUrl("Aastha-Nepali", "lorelei"),
      getDiceBearUrl("Aastha-Trek", "personas"),
      getDiceBearUrl("Aastha-Chai", "notionists"),
    ],
    interests: ["Hiking", "Momo Crawls", "Acoustic Pop", "Photography", "Yoga"],
    occupation: "UX Designer",
    education: "Stanford University",
    distance: 3,
    verified: true,
    dalBhatFrequency: "Every single day (Rice is life)",
    musicRepeat: "Albatross - Kalo Kesh",
    gotra: "Kashyap",
    caste: "Brahmin",
    relationshipIntent: "Long-term relationship",
    dietary: "Vegetarian",
    promptQuestion: "The secret to my heart...",
    promptAnswer: "Properly spiced timur ko jhol achar and a good road-trip playlist.",
  },
  {
    id: "2",
    name: "Bikram",
    age: 29,
    location: "New York, NY (Pokhara)",
    bio: "Fintech engineer, avid trekker, and rooftop acoustic guitarist. Can cook dal bhat in under 25 minutes. Let's debate old Nepali rock bands! 🎸👨‍🍳",
    images: [
      getDiceBearUrl("Bikram-Pokhara", "personas"),
      getDiceBearUrl("Bikram-Guitar", "adventurer"),
      getDiceBearUrl("Bikram-Tech", "notionists"),
    ],
    interests: ["Guitar", "Annapurna Treks", "Cooking", "Chess", "Indie Rock"],
    occupation: "Senior Software Engineer",
    education: "Columbia University",
    distance: 6,
    verified: true,
    dalBhatFrequency: "Twice a day",
    musicRepeat: "1974 AD - Mayalu",
    gotra: "Vashistha",
    caste: "Chhetri",
    relationshipIntent: "Marriage / Matrimonial",
    dietary: "Non-Vegetarian",
    promptQuestion: "Ideal Sunday morning...",
    promptAnswer: "Reading with black coffee, followed by an impromptu bike ride.",
  },
  {
    id: "3",
    name: "Pooja",
    age: 25,
    location: "Austin, TX (Lalitpur)",
    bio: "Music producer & podcast host. Deeply in love with traditional Newari architecture, indie music, and street photography. 🎨🎵",
    images: [
      getDiceBearUrl("Pooja-Newar", "lorelei"),
      getDiceBearUrl("Pooja-Music", "personas"),
      getDiceBearUrl("Pooja-Art", "adventurer"),
    ],
    interests: ["Indie Music", "Ceramics", "Concerts", "Street Food", "Dance"],
    occupation: "Audio Engineer & Producer",
    education: "UT Austin",
    distance: 12,
    verified: false,
    dalBhatFrequency: "Occasional (Samay Baji fan)",
    musicRepeat: "Sajjan Raj Vaidya - Hataarindai Bataasindai",
    gotra: "Open / Skip",
    caste: "Newar",
    relationshipIntent: "Dating to explore",
    dietary: "Foodie / Open",
    promptQuestion: "A non-negotiable for me...",
    promptAnswer: "You must be able to laugh at awkward silences and love momos.",
  },
  {
    id: "4",
    name: "Suman",
    age: 28,
    location: "Seattle, WA (Dharan)",
    bio: "Environmental scientist & amateur trail runner. Weekends are reserved for Mt. Rainier trails and experimenting with homemade hot sauces! 🌲🏃",
    images: [
      getDiceBearUrl("Suman-Dharan", "personas"),
      getDiceBearUrl("Suman-Trail", "adventurer"),
      getDiceBearUrl("Suman-Coffee", "lorelei"),
    ],
    interests: ["Trail Running", "Sustainability", "Documentaries", "Coffee"],
    occupation: "Environmental Scientist",
    education: "University of Washington",
    distance: 5,
    verified: true,
    dalBhatFrequency: "Standard (Once a day)",
    musicRepeat: "Bipul Chettri - Syndicate",
    gotra: "Bharadwaj",
    caste: "Rai",
    relationshipIntent: "Long-term relationship",
    dietary: "Flexitarian",
    promptQuestion: "My greatest adventure so far...",
    promptAnswer: "Solo backpacking across the Langtang Valley after a sudden snowfall.",
  },
  {
    id: "5",
    name: "Shraddha",
    age: 27,
    location: "Toronto, Canada (Bhaktapur)",
    bio: "Sustainable architect & tea connoisseur. Passionate about revitalizing heritage aesthetics with modern timber design. 🏛️🌿",
    images: [
      getDiceBearUrl("Shraddha-Heritage", "lorelei"),
      getDiceBearUrl("Shraddha-Design", "personas"),
      getDiceBearUrl("Shraddha-Cafe", "notionists"),
    ],
    interests: ["Architecture", "Pottery", "Literature", "Travel", "Plants"],
    occupation: "Architectural Designer",
    education: "University of Toronto",
    distance: 8,
    verified: true,
    dalBhatFrequency: "Twice a day",
    musicRepeat: "Tribal Rain - Bhanai",
    gotra: "Gautam",
    caste: "Brahmin",
    relationshipIntent: "Marriage / Matrimonial",
    dietary: "Vegetarian",
    promptQuestion: "We'll get along if...",
    promptAnswer: "You appreciate thoughtful design, warm conversations, and good tea.",
  },
];

export default function HallwayPage() {
  const { userLevel, addXp } = useUserLevel();
  const [useMatrimonialMode, setUseMatrimonialMode] = React.useState(false);
  const [currentProfiles, setCurrentProfiles] = React.useState<Profile[]>(mockProfiles);
  const [matches, setMatches] = React.useState<string[]>([]);
  const [superLikes, setSuperLikes] = React.useState(3);

  const handleSwipeRight = (profile: Profile) => {
    setMatches((prev) => [...prev, profile.id]);
    addXp(10);
    toast.success(`Subhakamana! 💘 Connected with ${profile.name}!`, {
      description: "Chat unlocked in Kura-Kani.",
    });
  };

  const handleSwipeLeft = (_profile: Profile) => {
    addXp(2);
  };

  const handleSuperLike = (profile: Profile) => {
    if (superLikes > 0) {
      setSuperLikes((prev) => prev - 1);
      setMatches((prev) => [...prev, profile.id]);
      addXp(25);
      toast.success(`Kura-Kani Sparked! 💫 Super Like sent to ${profile.name}!`, {
        description: "Your Chino was placed at the top of their inbox.",
      });
    } else {
      toast.error("No Super Likes remaining today", {
        description: "Daily super likes reset at midnight.",
      });
    }
  };

  const resetStack = () => {
    setCurrentProfiles([...mockProfiles]);
    toast.info("Hallway refreshed with candidate Chinos ✨");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start max-w-lg mx-auto w-full py-2 sm:py-4">
      {/* Hallway Top Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <Link
            href="/account/dashboard"
            className="size-8 rounded-full bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                The Hallway
              </h1>
              <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/20 py-0 font-semibold">
                मयालु गल्ली
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Review candidate Chinos curated by Maya
            </p>
          </div>
        </div>

        {/* Level / Super Like Pill */}
        <div className="flex items-center gap-1.5 bg-muted/50 dark:bg-slate-900/40 border border-border/60 px-2.5 py-1 rounded-full text-xs shadow-2xs">
          <Sparkles className="size-3 text-amber-500" />
          <span className="font-semibold text-foreground text-[11px]">Lvl {userLevel.level}</span>
          <span className="text-muted-foreground text-[10px]">•</span>
          <span className="text-violet-500 font-semibold text-[11px]">{superLikes} ★</span>
        </div>
      </div>

      {/* Mode Switch & Dhukuti Info (Compact pill row) */}
      <div className="w-full flex items-center justify-between gap-2 p-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-2xs mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">Mode:</span>
          <div className="flex items-center gap-1.5">
            <Switch
              id="mode-toggle"
              checked={useMatrimonialMode}
              onCheckedChange={setUseMatrimonialMode}
              className="scale-90"
            />
            <Label htmlFor="mode-toggle" className="text-xs font-semibold cursor-pointer">
              {useMatrimonialMode ? "💍 Matrimonial Chino" : "🔥 Dating"}
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Lock className="size-3 text-rose-500 shrink-0" />
          <span>Dhukuti Sealed 🔒</span>
        </div>
      </div>

      {/* DEDICATED TINDER SWIPE DECK */}
      <div className="w-full flex justify-center">
        <TinderSwipeDeck
          profiles={currentProfiles}
          isMatrimonialMode={useMatrimonialMode}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSuperLike={handleSuperLike}
          onResetStack={resetStack}
        />
      </div>
    </div>
  );
}
