"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Cake,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/landing/brand-logo";
import { ButterflyIcon } from "@/components/landing/cloud-atmosphere";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireInput,
  QuestionnaireItem,
} from "@/components/ui/questionnaire";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUserLevel } from "@/contexts/userContext";
import {
  getUserOnboardingStatus,
  type OnboardingData,
  saveOnboardingProfile,
} from "@/lib/neonDB/onboarding-actions";

// Curated avatar options with Nepali & South Asian aesthetic portraits
const AVATAR_OPTIONS = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
];

// Rich Nepali dating prompts with click-to-inspire suggestions
interface PromptItem {
  prompt: string;
  inspirations: string[];
}

const PROMPTS_DATA: PromptItem[] = [
  {
    prompt: "The quickest way to win my heart is...",
    inspirations: [
      "A piping hot plate of spicy jhol momo on a rainy day 🥟",
      "Remembering the small things I mentioned once in passing 💌",
      "A spontaneous midnight drive for hot Masala Chiya ☕",
    ],
  },
  {
    prompt: "A perfect Sunday with me looks like...",
    inspirations: [
      "Morning chiya overlooking the hills, afternoon thrift run, and home-cooked dinner 🌿",
      "Lazy morning with coffee & acoustic music, followed by a walk in Baglung 🎸",
      "Scenic bike ride to Nagarkot and deep conversations till dusk 🏍️",
    ],
  },
  {
    prompt: "My most controversial Nepali opinion is...",
    inspirations: [
      "Buff momo is objectively superior to chicken momo every single time 🥟🔥",
      "Bhatbhateni on a Saturday is essentially an amusement park for adults 🛒",
      "Crisp Kathmandu winter mornings beat monsoon humidity by a mile ❄️",
    ],
  },
  {
    prompt: "My dream trip across Nepal or beyond...",
    inspirations: [
      "Stargazing camp at Rara Lake with an acoustic guitar around a bonfire 🌌",
      "Motorbike journey through the mystical trails of Upper Mustang 🏍️",
      "Peaceful trek to Gosainkunda during a starry clear night 🏔️",
    ],
  },
  {
    prompt: "We'll get along if you also believe...",
    inspirations: [
      "Chiya is not just tea; it's an emotion, a conversation, and therapy ☕",
      "Calm, direct communication fixes 99% of misunderstandings 💬",
      "Kindness to animals and servers is the highest form of green flag ✨",
    ],
  },
  {
    prompt: "The best momo spot in Nepal, hands down...",
    inspirations: [
      "Shandar Momo in Sankhamul — extra spicy jhol achar! 🥟",
      "That tiny hole-in-the-wall corner shop near Baglung that only locals know 🤫",
      "Home-made steaming momos wrapped together with laughter and music 🥟❤️",
    ],
  },
  {
    prompt: "My ideal first date vibe is...",
    inspirations: [
      "A warm Chiya walk through Baglung under fairy lights 🏛️",
      "Steaming momos with sunset city views at Swayambhu 🌅",
      "A cozy cafe with board games, dessert, and zero awkward silences 🍰",
    ],
  },
  {
    prompt: "One promise I make to my future partner...",
    inspirations: [
      "I will always listen to understand, never just to respond 🤝",
      "I will happily split the last piece of momo with you 🥟",
      "I will celebrate your smallest wins like Olympic gold medals 🏆",
    ],
  },
];

// Rich Passions & Interests catalog
const INTEREST_CATEGORIES = [
  {
    category: "🥟 Food & Hangouts",
    items: [
      "Momos & Street Food 🥟",
      "Chiya Walks ☕",
      "Dal Bhat 24/7 🍛",
      "Home Cooking 🍳",
      "Basantapur Nights 🏛️",
      "Café Hopping 🧋",
    ],
  },
  {
    category: "🏔️ Outdoors & Travel",
    items: [
      "Himalayan Trekking 🏔️",
      "Hiking Trails 🥾",
      "Camping & Bonfires 🔥",
      "Motorbike Rides 🏍️",
      "Stargazing 🌌",
      "Roadtrips 🚗",
    ],
  },
  {
    category: "🎸 Music, Arts & Media",
    items: [
      "Live Gigs & Acoustic 🎸",
      "Nepali Indie 🎶",
      "Photography 📸",
      "Cinema & Anime 🍿",
      "Bookworm & Writing 📚",
      "Art & Exhibitions 🎨",
    ],
  },
  {
    category: "🧘 Lifestyle & Wellness",
    items: [
      "Gym & Fitness 💪",
      "Yoga & Mindfulness 🧘",
      "Tech & Startups 💻",
      "Gaming & Esports 🎮",
      "Animal & Pet Lover 🐾",
      "Futsal & Football ⚽",
    ],
  },
];

// Web Audio synthesizer for tactile gamified micro-interactions
function playTone(freq = 440, type: OscillatorType = "sine", duration = 0.12) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context not allowed or blocked
  }
}

function playStepSound() {
  playTone(523.25, "sine", 0.09); // C5
  setTimeout(() => playTone(659.25, "sine", 0.12), 60); // E5
}

function playCelebrateSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, "triangle", 0.22), idx * 85);
  });
}

const DAL_BHAT_PRESETS = [
  {
    id: "Twice a day 🔥",
    label: "Twice a day 🔥",
    note: "Dal Bhat Power 24 Hour — true powerhouse.",
  },
  {
    id: "Daily once (dinner/lunch) 🍚",
    label: "Daily once 🍚",
    note: "One solid meal of dal, bhat & tarkari every day.",
  },
  {
    id: "A few times a week 🥗",
    label: "A few times a week 🥗",
    note: "Mix of Momo, Chowmein, Salads & Bhat.",
  },
  {
    id: "Special occasions only",
    label: "Occasions only 🥟",
    note: "More into Momos, Chowmein & Thukpa.",
  },
];

const CHIYA_PRESETS = [
  {
    id: "Kadak Masala Chiya with elaichi ☕",
    title: "Kadak Masala Chiya ☕",
    sub: "With aduwa, elaichi & whole milk — sweet & spicy.",
  },
  {
    id: "Kalo Chiya / Black tea purist 🍵",
    title: "Kalo Chiya Purist 🍵",
    sub: "Clean Ilam tea with lemon or ginger, zero fuss.",
  },
  {
    id: "Filter Coffee / Iced Latte 🧋",
    title: "Specialty Coffee / Latte 🧋",
    sub: "Jhamsikhel cafe hopper & cold brew enthusiast.",
  },
  {
    id: "Hot Lemon with Honey 🍯",
    title: "Hot Lemon with Honey 🍯",
    sub: "Warm, soothing, and wellness-focused.",
  },
];

const MUSIC_PRESETS = [
  "Sajjan Raj Vaidya 🎶",
  "Bartika Eam Rai 🎸",
  "1974 AD & Classic Rock 🤘",
  "Tribal Rain / Indie 🌿",
  "Narayan Gopal Classics 🎙️",
  "Yama Buddha / Nepali Rap 🎤",
  "Global Indie & R&B 🌍",
  "Bollywood Melodies ✨",
  "Phosphenes / Albatross ⚡",
];

const GREEN_FLAGS_PRESET = [
  "Texts back fast & communicates 📱",
  "Makes me laugh till stomach hurts 😂",
  "Family-first & respectful to elders 👨‍👩‍👧",
  "Has goals, ambition & curiosity 🎯",
  "Down for midnight Chiya conversations ☕",
  "Emotionally mature & calm under pressure 🧘",
  "Kind to animals & service staff 🐾",
  "Active listener who remembers details 💌",
];

export default function OnboardingComponent() {
  const router = useRouter();
  const { addXp } = useUserLevel();

  // Onboarding conversational steps: 0 to 15 (16 total steps)
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [earnedXpTotal, setEarnedXpTotal] = useState(0);

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    birthdate: "",
    age: 24,
    gender: "woman",
    interestedIn: "men",
    location: "Kathmandu 🇳🇵",
    relationshipIntent: "Marriage & Serious",
    dalBhatFrequency: "Twice a day 🔥",
    musicRepeat: "Sajjan Raj Vaidya 🎶",
    greenFlag: "Texts back fast & communicates 📱",
    occupation: "Tech & Software 💻",
    bio: "",
    promptAnswers: {
      [PROMPTS_DATA[0].prompt]: PROMPTS_DATA[0].inspirations[0],
    },
    speedRound: {
      drinking: "Socially",
      smoking: "Never",
      kids: "Want someday",
    },
    privateCorner: {
      caste: "Open / No preference",
      religion: "Spiritual / Hindu",
      dietary: "Non-vegetarian 🍗",
      chiyaPreference: "Kadak Masala Chiya with elaichi ☕",
      astrologyOpenness: "Open-minded / Casual ✨",
      familyVibe: "Close-knit & family-first 👨‍👩‍👧",
    },
    dealbreakers: {
      ageRangeMin: 22,
      ageRangeMax: 32,
      distance: "Anywhere in Nepal & Diaspora 🌍",
    },
    profilePhoto: AVATAR_OPTIONS[0],
    interests: [
      "Momos & Street Food 🥟",
      "Chiya Walks ☕",
      "Live Gigs & Acoustic 🎸",
      "Himalayan Trekking 🏔️",
      "Photography 📸",
    ],
  });

  const [activePrompt, setActivePrompt] = useState(PROMPTS_DATA[0].prompt);
  const [activePromptText, setActivePromptText] = useState(
    PROMPTS_DATA[0].inspirations[0],
  );

  // Custom "Others / Own option" text states
  const [customGreenFlag, setCustomGreenFlag] = useState("");
  const [isOtherGreenFlag, setIsOtherGreenFlag] = useState(false);

  const [customChiya, setCustomChiya] = useState("");
  const [isOtherChiya, setIsOtherChiya] = useState(false);

  const [customMusic, setCustomMusic] = useState("");
  const [isOtherMusic, setIsOtherMusic] = useState(false);

  const [customDalBhat, setCustomDalBhat] = useState("");
  const [isOtherDalBhat, setIsOtherDalBhat] = useState(false);

  const [customInterestInput, setCustomInterestInput] = useState("");

  // Custom photo link state
  const [customPhotoInput, setCustomPhotoInput] = useState("");
  const [showCustomPhotoField, setShowCustomPhotoField] = useState(false);

  const [isChecking, setIsChecking] = useState(true);
  const [isAlreadyOnboarded, setIsAlreadyOnboarded] = useState(false);

  // Check if user is already onboarded
  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await getUserOnboardingStatus();
        if (status.isOnboarded) {
          setIsAlreadyOnboarded(true);
        }
        if (!status.isAuthenticated) {
          router.replace("/auth/login");
          return;
        }
        if (status.profile) {
          const p = status.profile as Record<string, unknown>;
          setFormData((prev) => ({
            ...prev,
            firstName: (p.first_name as string) || prev.firstName,
            age: typeof p.age === "number" ? p.age : prev.age,
            birthdate: p.birthdate
              ? String(p.birthdate).split("T")[0]
              : prev.birthdate,
            gender: (p.gender as string) || prev.gender,
            interestedIn: (p.interested_in as string) || prev.interestedIn,
            location: (p.location as string) || prev.location,
            relationshipIntent:
              (p.relationship_intent as string) || prev.relationshipIntent,
            dalBhatFrequency:
              (p.dal_bhat_frequency as string) || prev.dalBhatFrequency,
            musicRepeat: (p.music_repeat as string) || prev.musicRepeat,
            greenFlag: (p.green_flag as string) || prev.greenFlag,
            occupation: (p.occupation as string) || prev.occupation,
            bio: (p.bio as string) || prev.bio,
            profilePhoto: (p.profile_photo as string) || prev.profilePhoto,
            interests:
              Array.isArray(p.interests) && p.interests.length > 0
                ? (p.interests as string[])
                : prev.interests,
            speedRound:
              (p.speed_round as typeof prev.speedRound) || prev.speedRound,
            privateCorner:
              (p.private_corner as typeof prev.privateCorner) ||
              prev.privateCorner,
            dealbreakers:
              (p.dealbreakers as typeof prev.dealbreakers) || prev.dealbreakers,
            promptAnswers:
              (p.prompt_answers as Record<string, string>) ||
              prev.promptAnswers,
          }));

          // Detect custom answers from loaded profile
          if (p.green_flag) {
            const gf = p.green_flag as string;
            if (!GREEN_FLAGS_PRESET.includes(gf)) {
              setCustomGreenFlag(gf);
              setIsOtherGreenFlag(true);
            }
          }
          if (p.music_repeat) {
            const mr = p.music_repeat as string;
            if (!MUSIC_PRESETS.includes(mr)) {
              setCustomMusic(mr);
              setIsOtherMusic(true);
            }
          }
          if (p.dal_bhat_frequency) {
            const db = p.dal_bhat_frequency as string;
            if (!DAL_BHAT_PRESETS.some((d) => d.id === db)) {
              setCustomDalBhat(db);
              setIsOtherDalBhat(true);
            }
          }
          const pc = p.private_corner as Record<string, unknown> | undefined;
          if (pc?.chiyaPreference) {
            const cp = pc.chiyaPreference as string;
            if (!CHIYA_PRESETS.some((c) => c.id === cp)) {
              setCustomChiya(cp);
              setIsOtherChiya(true);
            }
          }
        }
      } catch (err) {
        console.error("Status check:", err);
      } finally {
        setIsChecking(false);
      }
    }
    checkStatus();
  }, [router]);

  const awardStepXp = (amount: number) => {
    addXp(amount);
    setEarnedXpTotal((prev) => prev + amount);
  };

  const advanceStep = () => {
    if (soundEnabled) playStepSound();
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep((prev) => Math.min(prev + 1, totalSteps - 1));
      awardStepXp(15);
    }, 320);
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  // Birthday change handler with age derivation
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let derivedAge = 24;
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      derivedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        derivedAge -= 1;
      }
    }
    setFormData((prev) => ({
      ...prev,
      birthdate: val,
      age: derivedAge > 0 ? derivedAge : 24,
    }));
  };

  // Toggle interest item
  const toggleInterest = (item: string) => {
    setFormData((prev) => {
      const current = prev.interests || [];
      if (current.includes(item)) {
        return { ...prev, interests: current.filter((x) => x !== item) };
      }
      if (current.length >= 7) {
        toast.info(
          "Maximum 7 interests chosen! Tap an active item to unselect.",
        );
        return prev;
      }
      return { ...prev, interests: [...current, item] };
    });
  };

  // Add custom interest
  const handleAddCustomInterest = () => {
    const item = customInterestInput.trim();
    if (!item) return;
    if (formData.interests?.includes(item)) {
      toast.info("Interest already added!");
      return;
    }
    if ((formData.interests?.length || 0) >= 7) {
      toast.info("Maximum 7 interests chosen! Tap an active item to unselect.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      interests: [...(prev.interests || []), item],
    }));
    setCustomInterestInput("");
    toast.success(`Added "${item}" to your interests! ✨`);
  };

  // Smart Bio Weaver (generates an authentic bio based on their answers)
  const generateMayaBio = () => {
    const parts: string[] = [];
    if (formData.occupation) {
      parts.push(
        `${formData.occupation} based in ${formData.location || "Nepal"}.`,
      );
    } else if (formData.location) {
      parts.push(`Based in ${formData.location}.`);
    }

    if (formData.dalBhatFrequency?.includes("Twice")) {
      parts.push("Powered by 2x daily Dal Bhat.");
    } else if (formData.dalBhatFrequency) {
      parts.push(`Dal bhat vibe: ${formData.dalBhatFrequency}.`);
    }

    if (formData.privateCorner?.chiyaPreference) {
      parts.push(`Daily ritual: ${formData.privateCorner.chiyaPreference}.`);
    }

    if (formData.greenFlag) {
      parts.push(`Biggest green flag: ${formData.greenFlag}.`);
    }

    const crafted =
      parts.join(" ") ||
      `${formData.firstName}, seeking genuine connection & meaningful conversation on Mayalu.`;
    setFormData((prev) => ({ ...prev, bio: crafted }));
    toast.success("Bio woven with Maya! ✨ Feel free to edit or keep it.");
  };

  // Apply custom photo link
  const applyCustomPhoto = () => {
    if (
      customPhotoInput.trim().startsWith("http://") ||
      customPhotoInput.trim().startsWith("https://")
    ) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: customPhotoInput.trim(),
      }));
      toast.success("Custom photo applied! 📸");
      setShowCustomPhotoField(false);
    } else {
      toast.error("Please enter a valid web image URL starting with https://");
    }
  };

  // Submit and finalize Kura-Kani
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalBio =
        formData.bio ||
        `${formData.occupation || "Mayalu member"} based in ${formData.location}. ${formData.relationshipIntent}. Dal bhat: ${formData.dalBhatFrequency}.`;

      const payload: OnboardingData = {
        ...formData,
        bio: finalBio,
        promptAnswers: {
          [activePrompt]: activePromptText,
        },
      };

      await saveOnboardingProfile(payload);
      awardStepXp(100);
      if (soundEnabled) playCelebrateSound();
      toast.success("Subhakamana! 🌟 Your Chino is live!");

      setTimeout(() => {
        router.push("/account/dashboard");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  const totalSteps = 16;
  const progressPercent = Math.min(
    100,
    Math.round(((step + 1) / totalSteps) * 100),
  );

  // Chapter labels matching Mayalu's romantic journey
  const getChapterName = () => {
    if (step <= 4) return "१. परिचय • The Basics";
    if (step <= 9) return "२. संस्कृति र जीवनशैली • Culture & Vibe";
    if (step <= 14) return "३. रुचि र प्रसङ्ग • Passions & Stories";
    return "४. मायालु चिनो • Grand Reveal";
  };

  // Dynamic question copy for Maya
  const getMayaQuestion = () => {
    switch (step) {
      case 0:
        return (
          <>
            Namaste & welcome! 🙏 I'm <strong>Maya</strong>, your personal
            matchmaker. What's your first name? It will be woven onto your
            authentic <strong>Chino</strong>.
          </>
        );
      case 1:
        return (
          <>
            Sweet name, {formData.firstName}! 🎂 When's your birthday? Only your{" "}
            <strong>age</strong> appears on your Chino — your exact birthdate
            remains strictly private.
          </>
        );
      case 2:
        return (
          <>
            Let's set up your dating dynamics 👇 Tell me who you are and who
            you'd love to meet.
          </>
        );
      case 3:
        return (
          <>
            Where are you currently based? 📍 Morning chiya in Baglung, lakeside
            breeze in Pokhara, or coffee overseas?
          </>
        );
      case 4:
        return (
          <>
            Real talk: what brings you to Mayalu? 💍 Clarity from day one
            protects everyone's precious time and heart!
          </>
        );
      case 5:
        return (
          <>
            Crucial cultural test! 🍛 <strong>Dal Bhat Power 24 Hour</strong> —
            how often does it hit your plate?
          </>
        );
      case 6:
        return (
          <>
            Nepal runs on Chiya and heartfelt conversations! ☕ What's your
            daily drink ritual?
          </>
        );
      case 7:
        return (
          <>
            Who's on repeat when you put your headphones on? 🎧 Music reveals
            the soul!
          </>
        );
      case 8:
        return (
          <>
            What is your <strong>#1 Green Flag</strong> in someone? 💚
          </>
        );
      case 9:
        return (
          <>
            What keeps you busy during the day? 💼 Tell me about your work or
            study.
          </>
        );
      case 10:
        return (
          <>
            What lights a fire in your heart? 🌟 Pick{" "}
            <strong>3 to 7 passions</strong> that define your lifestyle:
          </>
        );
      case 11:
        return (
          <>
            Compatibility is in the details! ✨ Let's set your dietary & values
            preferences (your Private Corner):
          </>
        );
      case 12:
        return (
          <>
            What age window and distance scope works best for your matches? 🎯
          </>
        );
      case 13:
        return (
          <>
            Now the best part 💛 Pick a <strong>Prasang</strong> and drop your
            authentic, witty answer:
          </>
        );
      case 14:
        return (
          <>Speed round! ⚡ 3 quick taps on daily habits and future plans:</>
        );
      case 15:
        return (
          <>
            Subhakamana, {formData.firstName}! 🌸 Your authentic{" "}
            <strong>Chino</strong> is woven and ready. Choose your avatar, tweak
            your bio, and seal your profile to enter Mayalu!
          </>
        );
      default:
        return "Let's continue weaving your profile! 💫";
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground selection:bg-rose-500">
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <BrandLogo className="w-14 h-14 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-semibold text-foreground">
              Connecting with Maya...
            </p>
            <p className="text-xs text-muted-foreground">
              Verifying your profile & Kura-Kani status
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative selection:bg-rose-500 selection:text-white">
      {/* Landing page ethereal ambient cloud lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-rose-500/15 via-pink-500/10 to-transparent blur-3xl opacity-75" />
        <div className="absolute -bottom-40 -right-20 w-[550px] h-[450px] bg-gradient-to-t from-violet-500/15 via-purple-500/8 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent blur-3xl opacity-40" />
      </div>

      {/* Sticky Glass Navbar (Mirrors landing page Header) */}
      <header className="h-16 shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-30 px-4 sm:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95 shrink-0"
        >
          <BrandLogo className="w-8 h-8" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Mayalu
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 border border-rose-500/20">
                <ButterflyIcon className="w-2.5 h-2.5" />
                मयालु
              </span>
            </div>
          </div>
        </Link>

        {/* Center Progress Pill & Narrative Chapter */}
        <div className="flex flex-col items-center gap-1 w-48 sm:w-64">
          <div className="flex justify-between w-full text-xs">
            <span className="font-medium text-foreground truncate max-w-[140px] sm:max-w-[180px]">
              {getChapterName()}
            </span>
            <span className="text-rose-500 font-semibold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-muted/80 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isAlreadyOnboarded && (
            <Link href="/account/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex text-xs h-8 px-2.5 rounded-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10 gap-1"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          )}

          <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-500 gap-1 text-xs px-2.5 py-1 rounded-full font-medium">
            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>+{earnedXpTotal} XP</span>
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
            title={soundEnabled ? "Audio cues active" : "Audio muted"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-500" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>

          <ModeToggle />
        </div>
      </header>

      {/* Main Focus Area (Strictly zero outer window scroll) */}
      <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center p-2 sm:px-4 sm:py-2">
        {/* The Central Onboarding Glass Card */}
        <Card className="w-full max-w-2xl h-full max-h-[min(650px,calc(100dvh-5.25rem))] flex flex-col rounded-3xl border border-border/60 bg-card/90 backdrop-blur-2xl shadow-2xl overflow-hidden relative p-0 gap-0">
          {/* Card Top: Maya's Guidance Section (Compact & sleek) */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border/30 bg-muted/20 shrink-0">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="relative shrink-0">
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-rose-500/40 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-xs">
                    M
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-card" />
              </div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">
                    Maya
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-rose-500/30 text-rose-500 bg-rose-500/10 font-medium"
                  >
                    Matchmaker
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    • Online
                  </span>
                </div>

                <div className="rounded-2xl rounded-tl-sm bg-muted/60 dark:bg-muted/40 border border-border/50 text-foreground text-xs sm:text-sm leading-relaxed p-2.5 sm:p-3 shadow-xs">
                  {isTyping ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-muted-foreground ml-1.5">
                        Maya is weaving...
                      </span>
                    </div>
                  ) : (
                    getMayaQuestion()
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Body: Interactive Step Content with native momentum scroll & sleek slim scrollbar */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-3.5 space-y-3 overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(150,150,150,0.25)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-button]:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-3"
              >
                {/* ================= STEP 0: NAME ================= */}
                {step === 0 && (
                  <div className="space-y-3 max-w-md mx-auto pt-1">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="first-name-input"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                      >
                        Your First Name
                      </label>
                      <Input
                        id="first-name-input"
                        autoFocus
                        placeholder="e.g. Aarav, Preeti, Shreya, Rohan..."
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          formData.firstName.trim().length >= 2 &&
                          advanceStep()
                        }
                        className="h-11 text-base bg-background/80 border-input focus-visible:ring-rose-500 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will be the title of your Chino. Genuine names
                      receive 3.4x more genuine matches.
                    </p>
                  </div>
                )}

                {/* ================= STEP 1: BIRTHDAY & AGE ================= */}
                {step === 1 && (
                  <div className="space-y-3 max-w-md mx-auto pt-1">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="birthdate-input"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                      >
                        Date of Birth
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Input
                          id="birthdate-input"
                          type="date"
                          value={formData.birthdate || "2000-01-01"}
                          onChange={handleBirthdateChange}
                          className="h-11 text-base bg-background/80 border-input focus-visible:ring-rose-500 rounded-xl max-w-xs"
                        />
                        <Badge
                          variant="secondary"
                          className="px-3.5 py-2 text-sm rounded-xl font-semibold gap-1.5"
                        >
                          <Cake className="w-4 h-4 text-amber-500" />
                          <span>Age: {formData.age} yrs</span>
                        </Badge>
                      </div>
                    </div>

                    {(formData.age ?? 0) < 18 ? (
                      <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                        ⚠️ You must be at least 18 years old to join Mayalu.
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>
                          {(formData.age ?? 0) >= 26
                            ? "Prime vibe age! Aama is definitely dropping bihe hints! 😂💍"
                            : "Youthful & energetic! Ready for authentic connections. 💫"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= STEP 2: GENDER & LOOKING FOR ================= */}
                {step === 2 && (
                  <div className="space-y-3 max-w-lg mx-auto pt-1">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        I am a
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "woman", label: "Woman 👩" },
                          { id: "man", label: "Man 👨" },
                          { id: "non-binary", label: "Non-binary 🌈" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                gender: opt.id,
                              })
                            }
                            className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                              formData.gender === opt.id
                                ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25"
                                : "bg-card border-border/80 text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-1.5" />

                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        Looking for
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "men", label: "Men 👨" },
                          { id: "women", label: "Women 👩" },
                          { id: "everyone", label: "Everyone 💫" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                interestedIn: opt.id,
                              })
                            }
                            className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                              formData.interestedIn === opt.id
                                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md shadow-amber-500/20"
                                : "bg-card border-border/80 text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: LOCATION & DIASPORA ================= */}
                {step === 3 && (
                  <div className="space-y-2.5 max-w-lg mx-auto pt-1">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Popular Hubs (Tap to select)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Kathmandu 🇳🇵",
                          "Pokhara 🏔️",
                          "Lalitpur 🏛️",
                          "Bhaktapur 🏺",
                          "Chitwan 🌿",
                          "Dharan ☀️",
                          "Butwal 🌾",
                          "Sydney 🇦🇺",
                          "Melbourne 🇦🇺",
                          "Dallas 🇺🇸",
                          "New York 🇺🇸",
                          "London 🇬🇧",
                          "Toronto 🇨🇦",
                          "Dubai 🇦🇪",
                        ].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                location: loc,
                              })
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                              formData.location === loc
                                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <Input
                        placeholder="Or type another city/neighborhood..."
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          formData.location.trim() &&
                          advanceStep()
                        }
                        className="h-10 text-xs sm:text-sm bg-background/80 border-input focus-visible:ring-rose-500 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* ================= STEP 4: RELATIONSHIP INTENT ================= */}
                {step === 4 && (
                  <Questionnaire
                    defaultItem="intent"
                    className="max-w-xl mx-auto pt-1 gap-0"
                  >
                    <QuestionnaireItem name="intent" className="gap-2.5">
                      <QuestionnaireChoices className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: "Marriage & Serious",
                            title: "💍 Marriage & Serious",
                            desc: "Ready to settle down, family-aligned, seeking a lifelong partner.",
                          },
                          {
                            id: "Dating with intent",
                            title: "💖 Dating with intent",
                            desc: "Meaningful romance & chemistry, seeing where it leads.",
                          },
                          {
                            id: "Open to possibilities",
                            title: "✨ Open to it",
                            desc: "Meeting genuine people first, seeing what develops naturally.",
                          },
                        ].map((item) => (
                          <QuestionnaireChoice
                            key={item.id}
                            value={item.id}
                            checked={formData.relationshipIntent === item.id}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                relationshipIntent: item.id,
                              })
                            }
                            className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
                              formData.relationshipIntent === item.id
                                ? "bg-rose-500/10 border-rose-500 text-foreground shadow-lg shadow-rose-500/10 ring-1 ring-rose-500"
                                : "bg-card border-border/70 text-foreground hover:border-border"
                            }`}
                          >
                            <div className="flex flex-col">
                              <h4 className="font-semibold text-xs sm:text-sm mb-1 text-rose-500 dark:text-rose-400">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </QuestionnaireChoice>
                        ))}
                      </QuestionnaireChoices>
                    </QuestionnaireItem>
                  </Questionnaire>
                )}

                {/* ================= STEP 5: DAL BHAT POWER + CUSTOM OPTION ================= */}
                {step === 5 && (
                  <Questionnaire
                    defaultItem="dalBhat"
                    className="max-w-lg mx-auto pt-1 gap-2"
                  >
                    <QuestionnaireItem name="dalBhat" className="gap-2">
                      <QuestionnaireChoices className="grid grid-cols-1 gap-2">
                        {DAL_BHAT_PRESETS.map((item) => (
                          <QuestionnaireChoice
                            key={item.id}
                            value={item.id}
                            checked={
                              formData.dalBhatFrequency === item.id &&
                              !isOtherDalBhat
                            }
                            onChange={() => {
                              setFormData({
                                ...formData,
                                dalBhatFrequency: item.id,
                              });
                              setIsOtherDalBhat(false);
                              setCustomDalBhat("");
                            }}
                            className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all ${
                              formData.dalBhatFrequency === item.id &&
                              !isOtherDalBhat
                                ? "bg-amber-500/15 border-amber-500 text-foreground shadow-sm ring-1 ring-amber-500"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <div className="flex flex-col">
                              <div className="text-xs sm:text-sm font-semibold">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {item.note}
                              </div>
                            </div>
                          </QuestionnaireChoice>
                        ))}

                        {/* Explicit "Others" Button */}
                        <QuestionnaireChoice
                          value="others"
                          checked={isOtherDalBhat}
                          onChange={() => {
                            setIsOtherDalBhat(true);
                            setFormData({
                              ...formData,
                              dalBhatFrequency: customDalBhat.trim() || "",
                            });
                          }}
                          className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all ${
                            isOtherDalBhat
                              ? "bg-amber-500/15 border-amber-500 text-foreground shadow-sm ring-1 ring-amber-500"
                              : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="text-xs sm:text-sm font-semibold text-amber-500 dark:text-amber-400">
                                Others / Custom Food Routine ✍️
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {isOtherDalBhat && customDalBhat.trim()
                                  ? `Selected: "${customDalBhat.trim()}"`
                                  : "Describe your own eating habits, diet, or routine."}
                              </div>
                            </div>
                            {isOtherDalBhat && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-500 bg-amber-500/10 font-medium ml-auto"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                        </QuestionnaireChoice>
                      </QuestionnaireChoices>

                      {/* Custom Dal Bhat Input */}
                      <div className="pt-0.5 space-y-1">
                        <QuestionnaireInput
                          placeholder="Or describe your custom dal bhat / food routine..."
                          value={customDalBhat}
                          onFocus={() => {
                            setIsOtherDalBhat(true);
                            if (customDalBhat.trim()) {
                              setFormData({
                                ...formData,
                                dalBhatFrequency: customDalBhat.trim(),
                              });
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomDalBhat(val);
                            setIsOtherDalBhat(true);
                            setFormData({
                              ...formData,
                              dalBhatFrequency: val.trim(),
                            });
                          }}
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${
                            isOtherDalBhat
                              ? "border-amber-500 ring-1 ring-amber-500"
                              : "border-input"
                          }`}
                        />
                      </div>
                    </QuestionnaireItem>
                  </Questionnaire>
                )}

                {/* ================= STEP 6: CHIYA & RITUAL + CUSTOM OPTION ================= */}
                {step === 6 && (
                  <Questionnaire
                    defaultItem="chiya"
                    className="max-w-lg mx-auto pt-0.5 gap-1.5"
                  >
                    <QuestionnaireItem name="chiya" className="gap-1.5">
                      <QuestionnaireChoices className="grid grid-cols-1 gap-1.5">
                        {CHIYA_PRESETS.map((ch) => (
                          <QuestionnaireChoice
                            key={ch.id}
                            value={ch.id}
                            checked={
                              formData.privateCorner?.chiyaPreference ===
                                ch.id && !isOtherChiya
                            }
                            onChange={() => {
                              setFormData({
                                ...formData,
                                privateCorner: {
                                  ...formData.privateCorner,
                                  chiyaPreference: ch.id,
                                },
                              });
                              setIsOtherChiya(false);
                              setCustomChiya("");
                            }}
                            className={`w-full p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                              formData.privateCorner?.chiyaPreference ===
                                ch.id && !isOtherChiya
                                ? "bg-rose-500/15 border-rose-500 text-foreground shadow-sm ring-1 ring-rose-500"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <div className="flex flex-col">
                              <div className="text-xs sm:text-sm font-semibold text-rose-500 dark:text-rose-400">
                                {ch.title}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {ch.sub}
                              </div>
                            </div>
                          </QuestionnaireChoice>
                        ))}

                        {/* Explicit "Others" Button */}
                        <QuestionnaireChoice
                          value="others"
                          checked={isOtherChiya}
                          onChange={() => {
                            setIsOtherChiya(true);
                            setFormData({
                              ...formData,
                              privateCorner: {
                                ...formData.privateCorner,
                                chiyaPreference: customChiya.trim() || "",
                              },
                            });
                          }}
                          className={`w-full p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                            isOtherChiya
                              ? "bg-rose-500/15 border-rose-500 text-foreground shadow-sm ring-1 ring-rose-500"
                              : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="text-xs sm:text-sm font-semibold text-rose-500 dark:text-rose-400">
                                Others / Custom Drink Ritual ✍️
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {isOtherChiya && customChiya.trim()
                                  ? `Selected: "${customChiya.trim()}"`
                                  : "Matcha, herbal infusion, freshly brewed coffee, or cold water purist."}
                              </div>
                            </div>
                            {isOtherChiya && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-rose-500/40 text-rose-500 bg-rose-500/10 font-medium ml-auto"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                        </QuestionnaireChoice>
                      </QuestionnaireChoices>

                      {/* Custom Chiya Input */}
                      <div className="pt-0.5 space-y-1">
                        <QuestionnaireInput
                          placeholder="Or enter your custom daily drink (e.g. Matcha latte, Mint tea, Lassi)..."
                          value={customChiya}
                          onFocus={() => {
                            setIsOtherChiya(true);
                            if (customChiya.trim()) {
                              setFormData({
                                ...formData,
                                privateCorner: {
                                  ...formData.privateCorner,
                                  chiyaPreference: customChiya.trim(),
                                },
                              });
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomChiya(val);
                            setIsOtherChiya(true);
                            setFormData({
                              ...formData,
                              privateCorner: {
                                ...formData.privateCorner,
                                chiyaPreference: val.trim(),
                              },
                            });
                          }}
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${
                            isOtherChiya
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-input"
                          }`}
                        />
                      </div>
                    </QuestionnaireItem>
                  </Questionnaire>
                )}

                {/* ================= STEP 7: MUSIC ON REPEAT + CUSTOM OPTION ================= */}
                {step === 7 && (
                  <Questionnaire
                    defaultItem="music"
                    className="max-w-lg mx-auto pt-1 gap-2.5"
                  >
                    <QuestionnaireItem name="music" className="gap-2.5">
                      <QuestionnaireChoices className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {MUSIC_PRESETS.map((art) => (
                          <QuestionnaireChoice
                            key={art}
                            value={art}
                            checked={
                              formData.musicRepeat === art && !isOtherMusic
                            }
                            onChange={() => {
                              setFormData({ ...formData, musicRepeat: art });
                              setIsOtherMusic(false);
                              setCustomMusic("");
                            }}
                            className={`p-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                              formData.musicRepeat === art && !isOtherMusic
                                ? "bg-rose-500/15 border-rose-500 text-foreground ring-1 ring-rose-500 font-semibold"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <span className="leading-snug">{art}</span>
                          </QuestionnaireChoice>
                        ))}

                        {/* Explicit "Others" Music Chip */}
                        <QuestionnaireChoice
                          value="others"
                          checked={isOtherMusic}
                          onChange={() => {
                            setIsOtherMusic(true);
                            setFormData({
                              ...formData,
                              musicRepeat: customMusic.trim() || "",
                            });
                          }}
                          className={`p-2 rounded-xl text-xs sm:text-sm font-medium transition-all col-span-2 sm:col-span-3 ${
                            isOtherMusic
                              ? "bg-rose-500/15 border-rose-500 text-foreground ring-1 ring-rose-500 font-semibold"
                              : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>Others ✍️</span>
                            {isOtherMusic && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-rose-500/40 text-rose-500 bg-rose-500/10 font-medium ml-auto"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                        </QuestionnaireChoice>
                      </QuestionnaireChoices>

                      {/* Custom Music Artist Option */}
                      <div className="pt-0.5 space-y-1">
                        <QuestionnaireInput
                          placeholder="Or enter your favorite artist, band, or genre on repeat..."
                          value={customMusic}
                          onFocus={() => {
                            setIsOtherMusic(true);
                            if (customMusic.trim()) {
                              setFormData({
                                ...formData,
                                musicRepeat: customMusic.trim(),
                              });
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomMusic(val);
                            setIsOtherMusic(true);
                            setFormData({
                              ...formData,
                              musicRepeat: val.trim(),
                            });
                          }}
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${
                            isOtherMusic
                              ? "border-rose-500 ring-1 ring-rose-500"
                              : "border-input"
                          }`}
                        />
                        {isOtherMusic && customMusic.trim() && (
                          <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Selected artist /
                            sound: "{customMusic.trim()}"
                          </p>
                        )}
                      </div>
                    </QuestionnaireItem>
                  </Questionnaire>
                )}

                {/* ================= STEP 8: GREEN FLAG + SHADCN QUESTIONNAIRE ================= */}
                {step === 8 && (
                  <Questionnaire
                    defaultItem="greenFlag"
                    className="max-w-xl mx-auto pt-1 gap-2.5"
                  >
                    <QuestionnaireItem name="greenFlag" className="gap-2.5">
                      <QuestionnaireChoices className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {GREEN_FLAGS_PRESET.map((flag) => (
                          <QuestionnaireChoice
                            key={flag}
                            value={flag}
                            checked={
                              formData.greenFlag === flag && !isOtherGreenFlag
                            }
                            onChange={() => {
                              setFormData({ ...formData, greenFlag: flag });
                              setIsOtherGreenFlag(false);
                              setCustomGreenFlag("");
                            }}
                            className={`rounded-2xl p-2.5 sm:p-3 text-xs sm:text-[13px] font-medium transition-all ${
                              formData.greenFlag === flag && !isOtherGreenFlag
                                ? "border-emerald-500 bg-emerald-500/15 text-foreground ring-1 ring-emerald-500 font-semibold"
                                : "border-border/70 hover:bg-muted/50"
                            }`}
                          >
                            <span className="leading-snug break-words">
                              {flag}
                            </span>
                          </QuestionnaireChoice>
                        ))}

                        {/* Explicit "Others / Type your own" Option */}
                        <QuestionnaireChoice
                          value="others"
                          checked={isOtherGreenFlag}
                          onChange={() => {
                            setIsOtherGreenFlag(true);
                            setFormData({
                              ...formData,
                              greenFlag: customGreenFlag.trim() || "",
                            });
                          }}
                          className={`rounded-2xl p-2.5 sm:p-3 text-xs sm:text-[13px] font-medium transition-all col-span-1 sm:col-span-2 ${
                            isOtherGreenFlag
                              ? "border-emerald-500 bg-emerald-500/15 text-foreground ring-1 ring-emerald-500 font-semibold"
                              : "border-border/70 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                              <span>✍️</span>
                              <span className="break-words">
                                {isOtherGreenFlag && customGreenFlag.trim()
                                  ? `Others: "${customGreenFlag.trim()}"`
                                  : "Others (Type your own green flag)"}
                              </span>
                            </span>
                            {isOtherGreenFlag && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-500 bg-emerald-500/10 font-medium ml-auto"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                        </QuestionnaireChoice>
                      </QuestionnaireChoices>

                      {/* Custom Green Flag Input */}
                      <div className="pt-0.5 space-y-1">
                        <QuestionnaireInput
                          placeholder="Or type your own #1 green flag (e.g. Always sends goodnight texts, emotionally honest)..."
                          value={customGreenFlag}
                          onFocus={() => {
                            setIsOtherGreenFlag(true);
                            if (customGreenFlag.trim()) {
                              setFormData({
                                ...formData,
                                greenFlag: customGreenFlag.trim(),
                              });
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomGreenFlag(val);
                            setIsOtherGreenFlag(true);
                            setFormData({ ...formData, greenFlag: val.trim() });
                          }}
                          className={`h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${
                            isOtherGreenFlag
                              ? "border-emerald-500 ring-1 ring-emerald-500"
                              : "border-input"
                          }`}
                        />
                        {isOtherGreenFlag && customGreenFlag.trim() && (
                          <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Using your custom
                            green flag: "{customGreenFlag.trim()}"
                          </p>
                        )}
                      </div>
                    </QuestionnaireItem>
                  </Questionnaire>
                )}

                {/* ================= STEP 9: OCCUPATION ================= */}
                {step === 9 && (
                  <div className="space-y-2.5 max-w-lg mx-auto pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Tech & Software 💻",
                        "Healthcare & Nursing 🩺",
                        "Business & Finance 📊",
                        "Design & Creative 🎨",
                        "Student / Academic 📚",
                        "Entrepreneur / Founder 🚀",
                        "Civil / Engineering 🛠️",
                        "Hospitality & Tourism ✈️",
                        "Marketing & Media 📢",
                      ].map((occ) => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              occupation: occ,
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                            formData.occupation === occ
                              ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                              : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>

                    <Input
                      placeholder="Or enter your specific title / field..."
                      value={formData.occupation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          occupation: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        formData.occupation?.trim() &&
                        advanceStep()
                      }
                      className="h-10 text-xs sm:text-sm bg-background/80 border-input focus-visible:ring-rose-500 rounded-xl"
                    />
                  </div>
                )}

                {/* ================= STEP 10: PASSIONS & INTERESTS + CUSTOM TAGS ================= */}
                {step === 10 && (
                  <div className="space-y-2.5 max-w-xl mx-auto pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Select 3 to 7 passions:
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          (formData.interests?.length || 0) >= 3
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                      >
                        {formData.interests?.length || 0}/7 selected
                      </Badge>
                    </div>

                    {INTEREST_CATEGORIES.map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          {cat.category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.items.map((item) => {
                            const isSelected =
                              formData.interests?.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleInterest(item)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-rose-500 text-white border-rose-500 shadow-sm ring-1 ring-rose-400"
                                    : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                                }`}
                              >
                                <span>{item}</span>
                                {isSelected && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Add Custom Passion / Interest */}
                    <div className="pt-1 space-y-1">
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Add custom passion (e.g. Astrophotography, Futsal)..."
                          value={customInterestInput}
                          onChange={(e) =>
                            setCustomInterestInput(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomInterest();
                            }
                          }}
                          className="h-8 text-xs bg-background/80 rounded-xl"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddCustomInterest}
                          disabled={!customInterestInput.trim()}
                          className="h-8 text-xs px-3 rounded-xl bg-rose-500 text-white shrink-0"
                        >
                          + Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 11: VALUES & PRIVATE CORNER ================= */}
                {step === 11 && (
                  <div className="space-y-3 max-w-lg mx-auto pt-1">
                    {/* Private Corner Trust Banner */}
                    <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-violet-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Private Corner Guarantee</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Caste, gotra, religion and visa status stay private. I
                        only use them for matching, and only if you choose to
                        answer.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground block">
                        Dietary Preference 🥗
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Non-vegetarian 🍗",
                          "Vegetarian 🥬",
                          "Eggetarian 🥚",
                          "Vegan 🥑",
                        ].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                privateCorner: {
                                  ...formData.privateCorner,
                                  dietary: d,
                                },
                              })
                            }
                            className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                              formData.privateCorner?.dietary === d
                                ? "bg-rose-500/15 border-rose-500 text-foreground ring-1 ring-rose-500 font-semibold"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground block">
                        Astrology & Kundali Vibe 🔮
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {[
                          {
                            id: "Believer (Kundali match is fun/meaningful) 🔮",
                            label: "Believer (Kundali match matters) 🔮",
                          },
                          {
                            id: "Open-minded / Casual ✨",
                            label: "Open-minded / Casual ✨",
                          },
                          {
                            id: "Not into it 🙅‍♂️",
                            label: "Not into it / Modern outlook 🙅‍♂️",
                          },
                        ].map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                privateCorner: {
                                  ...formData.privateCorner,
                                  astrologyOpenness: a.id,
                                },
                              })
                            }
                            className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                              formData.privateCorner?.astrologyOpenness === a.id
                                ? "bg-amber-500/15 border-amber-500 text-foreground ring-1 ring-amber-500 font-semibold"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 12: DEALBREAKERS & AGE WINDOW ================= */}
                {step === 12 && (
                  <div className="space-y-3 max-w-lg mx-auto pt-1">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">
                          Preferred Partner Age Window:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-rose-500 border-rose-500/30 font-semibold"
                        >
                          {formData.dealbreakers?.ageRangeMin || 21} -{" "}
                          {formData.dealbreakers?.ageRangeMax || 32} yrs
                        </Badge>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] text-muted-foreground">
                            Min Age
                          </span>
                          <Input
                            type="number"
                            min={18}
                            max={60}
                            value={formData.dealbreakers?.ageRangeMin || 21}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dealbreakers: {
                                  ...formData.dealbreakers,
                                  ageRangeMin: Number(e.target.value) || 21,
                                },
                              })
                            }
                            className="bg-background/80 border-input h-9 text-xs sm:text-sm rounded-xl"
                          />
                        </div>
                        <span className="text-muted-foreground pt-4 text-xs">
                          to
                        </span>
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] text-muted-foreground">
                            Max Age
                          </span>
                          <Input
                            type="number"
                            min={18}
                            max={65}
                            value={formData.dealbreakers?.ageRangeMax || 32}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dealbreakers: {
                                  ...formData.dealbreakers,
                                  ageRangeMax: Number(e.target.value) || 32,
                                },
                              })
                            }
                            className="bg-background/80 border-input h-9 text-xs sm:text-sm rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground block">
                        Distance Scope 🗺️
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {[
                          "Within my city / nearby 📍",
                          "Anywhere in Nepal 🇳🇵",
                          "Open to Global Diaspora 🌍",
                          "No distance restriction ✈️",
                        ].map((dist) => (
                          <button
                            key={dist}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                dealbreakers: {
                                  ...formData.dealbreakers,
                                  distance: dist,
                                },
                              })
                            }
                            className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                              formData.dealbreakers?.distance === dist
                                ? "bg-rose-500/15 border-rose-500 text-foreground ring-1 ring-rose-500 font-semibold"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {dist}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 13: MAYALU PRASANG & ANSWER ================= */}
                {step === 13 && (
                  <div className="space-y-2.5 max-w-xl mx-auto pt-1">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        मयालु प्रसङ्ग रोज्नुहोस् (Choose your topic)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PROMPTS_DATA.map((pObj) => (
                          <button
                            key={pObj.prompt}
                            type="button"
                            onClick={() => {
                              setActivePrompt(pObj.prompt);
                              if (!activePromptText) {
                                setActivePromptText(pObj.inspirations[0]);
                              }
                            }}
                            className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${
                              activePrompt === pObj.prompt
                                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                : "bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {pObj.prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/40 border border-border/70 rounded-2xl p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-semibold italic">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                        <span>"{activePrompt}"</span>
                      </div>
                      <Textarea
                        rows={2}
                        value={activePromptText}
                        onChange={(e) => setActivePromptText(e.target.value)}
                        placeholder="पोख्नुहोस् आफ्नो मनको कुरा (Write your authentic response)..."
                        className="bg-background/80 border-input text-xs resize-none rounded-xl"
                      />

                      <div className="space-y-1 pt-0.5">
                        <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Tap to pre-fill
                          inspiration:
                        </span>
                        <div className="flex flex-col gap-1">
                          {PROMPTS_DATA.find(
                            (p) => p.prompt === activePrompt,
                          )?.inspirations.map((insp) => (
                            <button
                              key={insp}
                              type="button"
                              onClick={() => setActivePromptText(insp)}
                              className="text-left text-xs bg-card/70 hover:bg-muted/80 border border-border/60 p-2 rounded-xl text-muted-foreground transition-all hover:text-foreground"
                            >
                              💡 "{insp}"
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 14: SPEED ROUND ================= */}
                {step === 14 && (
                  <div className="space-y-2.5 max-w-lg mx-auto pt-1">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-medium block">
                        Drinking 🍷
                      </span>
                      <div className="flex gap-2">
                        {["Never", "Socially", "Regularly"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                speedRound: {
                                  ...formData.speedRound,
                                  drinking: v,
                                },
                              })
                            }
                            className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${
                              formData.speedRound?.drinking === v
                                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-medium block">
                        Smoking 🚭
                      </span>
                      <div className="flex gap-2">
                        {["Never", "Socially", "Yes"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                speedRound: {
                                  ...formData.speedRound,
                                  smoking: v,
                                },
                              })
                            }
                            className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${
                              formData.speedRound?.smoking === v
                                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-medium block">
                        Kids in the future? 👶
                      </span>
                      <div className="flex gap-2">
                        {["Want someday", "Open to it", "Don't want"].map(
                          (v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  speedRound: {
                                    ...formData.speedRound,
                                    kids: v,
                                  },
                                })
                              }
                              className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${
                                formData.speedRound?.kids === v
                                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                  : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                              }`}
                            >
                              {v}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 15: CHINO REVEAL ================= */}
                {step === 15 && (
                  <div className="space-y-3 max-w-lg mx-auto pt-1">
                    {/* Mayalu's Privacy Dhukuti Guarantee */}
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                        <Mail className="w-4 h-4" />
                        <span>Mayalu&apos;s Privacy Dhukuti Guarantee</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your photo stays in my dhukuti until you say so. Only
                        your nickname, age, city and answers are shown. Nobody
                        sees your photos until you both match and say yes.
                      </p>
                    </div>

                    {/* Avatar selector */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Pick your avatar:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowCustomPhotoField(!showCustomPhotoField)
                          }
                          className="text-rose-500 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Custom photo URL</span>
                        </button>
                      </div>

                      <div className="flex justify-center items-center gap-2 overflow-x-auto py-1">
                        {AVATAR_OPTIONS.map((img) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                profilePhoto: img,
                              })
                            }
                            className={`rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                              formData.profilePhoto === img
                                ? "border-rose-500 scale-110 shadow-lg shadow-rose-500/30"
                                : "border-border/60 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={img}
                              alt="Avatar"
                              width={42}
                              height={42}
                              className="w-10 h-10 object-cover rounded-xl"
                            />
                          </button>
                        ))}
                      </div>

                      {showCustomPhotoField && (
                        <div className="p-2.5 bg-muted/50 border border-border/70 rounded-xl flex gap-2 items-center mt-1">
                          <Input
                            placeholder="Paste image URL (https://...)"
                            value={customPhotoInput}
                            onChange={(e) =>
                              setCustomPhotoInput(e.target.value)
                            }
                            className="h-8 text-xs bg-background"
                          />
                          <Button
                            size="sm"
                            onClick={applyCustomPhoto}
                            className="h-8 text-xs bg-rose-500 text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Bio weaver */}
                    <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Chino Bio:
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateMayaBio}
                          className="text-amber-500 hover:text-amber-600 text-xs h-6 px-2 gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>✨ Craft with Maya</span>
                        </Button>
                      </div>
                      <Textarea
                        rows={2}
                        value={formData.bio || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Write a bio or tap '✨ Craft with Maya'..."
                        className="text-xs bg-background/80 border-input resize-none rounded-xl"
                      />
                    </div>

                    {/* The Chino Card */}
                    <div className="relative rounded-3xl p-0.5 bg-gradient-to-br from-rose-500 via-purple-500 to-amber-400 shadow-xl shadow-rose-500/15">
                      <div className="bg-card/95 backdrop-blur-xl rounded-[22px] p-3.5 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={formData.profilePhoto || AVATAR_OPTIONS[0]}
                            alt={formData.firstName || "Profile"}
                            width={54}
                            height={54}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base">
                              <span>{formData.firstName}</span>
                              <span className="text-rose-500 font-semibold text-xs sm:text-sm">
                                {formData.age}
                              </span>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate">
                                {formData.location}
                              </span>
                              <span>•</span>
                              <span className="truncate">
                                {formData.occupation}
                              </span>
                            </p>
                            <div className="flex gap-1.5 pt-0.5">
                              <Badge className="bg-rose-500/15 text-rose-500 text-[10px] px-2 py-0 border-none">
                                {formData.relationshipIntent}
                              </Badge>
                              {formData.privateCorner?.dietary && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0 border-none">
                                  {formData.privateCorner.dietary}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {formData.bio && (
                          <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded-xl">
                            "{formData.bio}"
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/40 p-2 rounded-xl">
                            <span className="text-[10px] text-muted-foreground block">
                              Dal Bhat
                            </span>
                            <span className="font-semibold text-amber-500 text-xs">
                              {formData.dalBhatFrequency}
                            </span>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-xl">
                            <span className="text-[10px] text-muted-foreground block">
                              On Repeat
                            </span>
                            <span className="font-semibold text-violet-500 text-xs truncate block">
                              {formData.musicRepeat}
                            </span>
                          </div>
                        </div>

                        {formData.interests &&
                          formData.interests.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {formData.interests.map((int) => (
                                <Badge
                                  key={int}
                                  variant="secondary"
                                  className="text-[10px] px-2 py-0.5"
                                >
                                  {int}
                                </Badge>
                              ))}
                            </div>
                          )}

                        <div className="bg-slate-900/40 p-2.5 rounded-xl text-xs space-y-0.5 border border-border/40">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                            मयालु प्रसङ्ग
                          </span>
                          <p className="text-[10px] text-rose-500 font-semibold italic">
                            "{activePrompt}"
                          </p>
                          <p className="text-xs leading-relaxed">
                            "{activePromptText}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Bottom: Navigation Action Bar */}
          <div className="p-3.5 sm:p-4 pt-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={step === 0 || isSubmitting}
              className="text-muted-foreground hover:text-foreground rounded-full px-4 gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <span className="text-xs text-muted-foreground hidden sm:inline-block font-medium">
              Step {step + 1} of {totalSteps}
            </span>

            {step === totalSteps - 1 ? (
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold px-6 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Saving Chino...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Mayalu</span>
                    <Heart className="w-4 h-4 fill-white" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={advanceStep}
                disabled={
                  (step === 0 && formData.firstName.trim().length < 2) ||
                  (step === 1 && (formData.age ?? 0) < 18) ||
                  (step === 3 && !formData.location.trim()) ||
                  (step === 8 && !formData.greenFlag?.trim()) ||
                  (step === 10 && (formData.interests?.length || 0) < 3) ||
                  (step === 13 && !activePromptText.trim())
                }
                className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold px-6 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </main>

      {/* Discreet Footer */}
      <footer className="shrink-0 py-2.5 text-center text-[11px] text-muted-foreground border-t border-border/30 bg-background/50">
        Mayalu Matchmaking • Sealed until mutual Kura-Kani • Privacy First
      </footer>
    </div>
  );
}
