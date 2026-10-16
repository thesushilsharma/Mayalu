"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartIcon, MessageSquare, User, Settings, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUserLevel } from "@/contexts/userContext";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { TinderSwipeDeck, type Profile } from "@/components/tinder-swipe-deck";
import { toast } from "sonner";

import { Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { getDiceBearUrl } from "@/lib/dicebear";

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

export default function DashboardPage() {
  const { userLevel, addXp } = useUserLevel();
  const [useMatrimonialMode, setUseMatrimonialMode] = useState(false);
  const [currentProfiles, setCurrentProfiles] = useState<Profile[]>(mockProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const [superLikes, setSuperLikes] = useState(3);

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
    toast.info("Stack reset with fresh profiles ✨");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* Mayalu Dhukuti Photo & Verification Status Card */}
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-violet-500/10 p-3.5 mb-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Dhukuti Privacy Vault</span>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px] px-2 py-0 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Maya Verified</span>
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            3 showcase photos sealed in Dhukuti. Public sees your DiceBear avatar until mutual 💘 match.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-3.5 mb-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold">
                {useMatrimonialMode ? "💍 Matrimonial Mode" : "🔥 Dating Mode"}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {useMatrimonialMode ? "Kundali, Gotra & life partner discovery" : "Casual, connection & chemistry discovery"}
              </p>
            </div>
            <Switch
              checked={useMatrimonialMode}
              onCheckedChange={setUseMatrimonialMode}
            />
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-3 mb-5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold">Level {userLevel.level} Explorer</span>
            <span className="text-[11px] text-muted-foreground">{userLevel.xp}/{userLevel.requiredXp} XP</span>
          </div>
          <Progress
            value={(userLevel.xp / userLevel.requiredXp) * 100}
            className="h-1.5"
          />
        </div>

        {/* IN-HOUSE TINDER SWIPE DECK */}
        <div className="mb-6">
          <TinderSwipeDeck
            profiles={currentProfiles}
            isMatrimonialMode={useMatrimonialMode}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onSuperLike={handleSuperLike}
            onResetStack={resetStack}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-xl font-bold text-rose-500">{matches.length}</div>
            <div className="text-[11px] text-muted-foreground font-medium">Matches</div>
          </div>
          <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-xl font-bold text-violet-500">{superLikes}</div>
            <div className="text-[11px] text-muted-foreground font-medium">Super Likes</div>
          </div>
          <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-xl font-bold text-amber-500">{userLevel.level}</div>
            <div className="text-[11px] text-muted-foreground font-medium">XP Level</div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <Link href="/account/dashboard">
              <Button variant="ghost" size="icon" className="text-pink-500">
                <HeartIcon className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/account/chats">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/account/profile">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}