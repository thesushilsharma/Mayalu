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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SwipeCard } from "@/components/swipe-card";

import { Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { getDiceBearUrl } from "@/lib/dicebear";

const mockProfiles = [
  {
    id: "1",
    name: "Sarah",
    age: 27,
    location: "San Francisco, CA",
    bio: "Adventure enthusiast and coffee lover. Always up for hiking trails and discovering new cafes. Looking for someone who shares my passion for the outdoors! 🏔️☕",
    images: [
      getDiceBearUrl("Sarah", "initial-face"),
      getDiceBearUrl("Sarah-Outdoors", "personas"),
      getDiceBearUrl("Sarah-Chai", "lorelei"),
    ],
    interests: ["Hiking", "Photography", "Coffee", "Travel", "Yoga"],
    occupation: "UX Designer",
    education: "Stanford University",
    distance: 3,
    verified: true,
  },
  {
    id: "2",
    name: "David",
    age: 30,
    location: "Chicago, IL",
    bio: "Software engineer by day, chef by night. I love experimenting with new recipes and exploring the city's food scene. Let's cook together! 👨‍🍳",
    images: [
      getDiceBearUrl("David", "initial-face"),
      getDiceBearUrl("David-Chef", "notionists"),
      getDiceBearUrl("David-Tech", "personas"),
    ],
    interests: ["Cooking", "Technology", "Reading", "Board Games", "Wine"],
    occupation: "Software Engineer",
    education: "MIT",
    distance: 7,
    verified: false,
  },
  {
    id: "3",
    name: "Emily",
    age: 25,
    location: "Austin, TX",
    bio: "Music lover and festival enthusiast. I play guitar and love discovering new artists. Life's too short for bad music and boring conversations! 🎸🎵",
    images: [
      getDiceBearUrl("Emily", "initial-face"),
      getDiceBearUrl("Emily-Guitar", "lorelei"),
      getDiceBearUrl("Emily-Music", "adventurer"),
    ],
    interests: ["Music", "Concerts", "Guitar", "Art", "Dancing"],
    occupation: "Music Teacher",
    education: "Berklee College of Music",
    distance: 12,
    verified: true,
  },
  {
    id: "4",
    name: "Michael",
    age: 28,
    location: "Seattle, WA",
    bio: "Fitness enthusiast and nature photographer. When I'm not at the gym, you'll find me capturing the beauty of the Pacific Northwest. 📸💪",
    images: [
      getDiceBearUrl("Michael", "initial-face"),
      getDiceBearUrl("Michael-Trek", "adventurer"),
      getDiceBearUrl("Michael-Fit", "personas"),
    ],
    interests: ["Fitness", "Photography", "Hiking", "Rock Climbing", "Travel"],
    occupation: "Personal Trainer",
    education: "University of Washington",
    distance: 5,
    verified: false,
  },
  {
    id: "5",
    name: "Jessica",
    age: 26,
    location: "Miami, FL",
    bio: "Beach lover and yoga instructor. I believe in living life to the fullest and spreading positive vibes wherever I go. Namaste! 🧘‍♀️🌊",
    images: [
      getDiceBearUrl("Jessica", "initial-face"),
      getDiceBearUrl("Jessica-Yoga", "lorelei"),
      getDiceBearUrl("Jessica-Zen", "personas"),
    ],
    interests: ["Yoga", "Meditation", "Beach", "Wellness", "Surfing"],
    occupation: "Yoga Instructor",
    education: "Florida International University",
    distance: 8,
    verified: true,
  },
];

export default function DashboardPage() {
  const { userLevel, addXp } = useUserLevel();
  const [useMatrimonialMode, setUseMatrimonialMode] = useState(false);
  const [currentProfiles, setCurrentProfiles] = useState(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [superLikes, setSuperLikes] = useState(3); // Daily super likes

  const handleSwipe = (direction: 'left' | 'right', profileId: string) => {
    if (direction === 'right') {
      setMatches(prev => [...prev, profileId]);
      addXp(10);
      // toast({
      //   title: "It's a match! 💕",
      //   message: "+10 XP earned",
      // });
    }
    
    // Move to next profile
    setCurrentIndex(prev => prev + 1);
    
    // Add XP for swiping
    addXp(2);
  };

  const handleSuperLike = (profileId: string) => {
    if (superLikes > 0) {
      setSuperLikes(prev => prev - 1);
      setMatches(prev => [...prev, profileId]);
      addXp(20);
      // toast({
      //   title: "Super Like sent! ⭐",
      //   description: "+20 XP earned",
      // });
      setCurrentIndex(prev => prev + 1);
    } else {
      // toast({
      //   variant: "destructive",
      //   title: "No Super Likes left",
      //   description: "You'll get more tomorrow!",
      // });
    }
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setCurrentProfiles([...mockProfiles]);
  };

  const currentProfile = currentProfiles[currentIndex];
  const hasMoreProfiles = currentIndex < currentProfiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        {/* Mayalu Dhukuti Photo & Verification Status Card */}
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-violet-500/10 p-3.5 mb-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Dhukuti Photo Guarantee</span>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px] px-2 py-0 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Selfie Verified by Admin</span>
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            3 showcase photos sealed in Dhukuti. Public sees your DiceBear avatar until mutual 💘 match.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">
                {useMatrimonialMode ? "Matrimonial Mode" : "Dating Mode"}
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {useMatrimonialMode ? "Find your life partner" : "Discover connections"}
              </p>
            </div>
            <Switch
              checked={useMatrimonialMode}
              onCheckedChange={setUseMatrimonialMode}
            />
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {userLevel.level}</span>
            <span className="text-sm text-gray-500">{userLevel.xp}/{userLevel.requiredXp} XP</span>
          </div>
          <Progress
            value={(userLevel.xp / userLevel.requiredXp) * 100}
            className="h-2"
          />
        </div>

        {/* Swipe Cards */}
        <div className="relative h-[600px] mb-6">
          {!hasMoreProfiles ? (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                No more profiles to show. Check back later for new matches!
              </p>
              <Button onClick={resetStack} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Stack
              </Button>
            </div>
          ) : (
            <>
              {/* Next card (behind) */}
              {currentIndex + 1 < currentProfiles.length && (
                <SwipeCard
                  key={currentProfiles[currentIndex + 1].id}
                  profile={currentProfiles[currentIndex + 1]}
                  onSwipe={() => {}}
                  onSuperLike={() => {}}
                  style={{
                    scale: 0.95,
                    zIndex: 1,
                  }}
                />
              )}
              
              {/* Current card (front) */}
              <SwipeCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={handleSwipe}
                onSuperLike={handleSuperLike}
                style={{
                  zIndex: 2,
                }}
              />
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-pink-500">{matches.length}</div>
            <div className="text-sm text-gray-500">Matches</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-500">{superLikes}</div>
            <div className="text-sm text-gray-500">Super Likes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-500">{userLevel.level}</div>
            <div className="text-sm text-gray-500">Level</div>
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