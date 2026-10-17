"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Cake,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  EyeOff,
  Heart,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Smile,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  Ghost,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/landing/brand-logo";
import { ButterflyIcon } from "@/components/landing/cloud-atmosphere";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/userContext";
import {
  formatBirthdateToISO,
  calculateAgeFromBirthdate,
} from "@/lib/date-utils";
import {
  getUserOnboardingStatus,
  type OnboardingData,
  saveOnboardingProfile,
} from "@/lib/neonDB/onboarding-actions";
import { cn } from "@/lib/utils";

import {
  DICEBEAR_AVATAR_OPTIONS,
  getDiceBearUrl,
} from "@/lib/dicebear";
import { DiceBearAvatarStudio } from "@/components/dicebear-avatar-studio";
import { DhukutiPhotoVault } from "@/components/dhukuti-photo-vault";

// Expressive DiceBear SVG avatars for profile onboarding
const AVATAR_OPTIONS = DICEBEAR_AVATAR_OPTIONS;

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

const NEPALI_RELIGIONS = [
  "Hindu",
  "Buddhist",
  "Kirat",
  "Christian",
  "Muslim",
  "Jain / Sikh",
  "Spiritual / Agnostic",
  "Open / No preference",
] as const;

const NEPALI_CASTES = [
  "Brahmin",
  "Chhetri",
  "Newar",
  "Magar",
  "Gurung",
  "Tamang",
  "Rai",
  "Limbu",
  "Tharu",
  "Thakuri",
  "Yadav",
  "Sherpa",
  "Dalit",
  "Marwadi",
  "Madhesi / Maithil",
  "Other / Open to all",
] as const;

const NEPALI_GOTRAS = [
  "Mudgal",
  "Kashyap",
  "Bharadwaj",
  "Vashistha",
  "Gautam",
  "Sandilya",
  "Garga",
  "Kaushik",
  "Parashara",
  "Agastya",
  "Atri",
  "Vishwamitra",
  "Angirasa",
  "Vatsa",
  "Harita",
  "Dhananjaya",
  "Kaudinya",
  "Upamanyu",
  "Not applicable / Unknown",
  "Open / Skip",
] as const;

export const STEP_NAV_ITEMS = [
  { step: 0, label: "Name", emoji: "✍️" },
  { step: 1, label: "Age", emoji: "🎂" },
  { step: 2, label: "Gender", emoji: "⚧️", isGender: true },
  { step: 3, label: "Location", emoji: "📍" },
  { step: 4, label: "Intent", emoji: "💍" },
  { step: 5, label: "Dal Bhat", emoji: "🍛" },
  { step: 6, label: "Chiya", emoji: "☕" },
  { step: 7, label: "Music", emoji: "🎶" },
  { step: 8, label: "Green Flag", emoji: "💚" },
  { step: 9, label: "Occupation", emoji: "💼" },
  { step: 10, label: "Passions", emoji: "🌟" },
  { step: 11, label: "Values", emoji: "🔒" },
  { step: 12, label: "Criteria", emoji: "🎯" },
  { step: 13, label: "Story", emoji: "💌" },
  { step: 14, label: "Speed", emoji: "⚡" },
  { step: 15, label: "Chino & Photos", emoji: "📸" },
];

export interface OnboardingComponentProps {
  mode?: "initial" | "redo";
  initialStep?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function OnboardingComponent({
  mode = "initial",
  initialStep = 0,
  onSuccess,
  onCancel,
  className = "",
}: OnboardingComponentProps = {}) {
  const router = useRouter();
  const { addXp, updateUserProfile } = useUser();

  // Onboarding conversational steps: 0 to 15 (16 total steps)
  const [step, setStep] = useState(initialStep);

  // Sync step if initialStep prop changes
  useEffect(() => {
    if (typeof initialStep === "number") {
      setStep(initialStep);
    }
  }, [initialStep]);
  const [step15Tab, setStep15Tab] = useState<string>("avatar");
  const [initialGender, setInitialGender] = useState<string | null>(null);
  const [initialSelfie, setInitialSelfie] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [earnedXpTotal, setEarnedXpTotal] = useState(0);

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    birthdate: "2000-01-01",
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
      caste: "Brahmin",
      religion: "Hindu",
      gotra: "Mudgal",
      dietary: "Non-vegetarian 🍗",
      chiyaPreference: "Kadak Masala Chiya with elaichi ☕",
      astrologyOpenness: "Open-minded / Casual ✨",
      familyVibe: "Close-knit & family-first 👨‍👩‍👧",
      verificationSelfie: "",
      verificationStatus: "pending_review",
    },
    dealbreakers: {
      ageRangeMin: 22,
      ageRangeMax: 27,
      distance: "Anywhere in Nepal & Diaspora 🌍",
    },
    profilePhoto: AVATAR_OPTIONS[0],
    additionalPhotos: [] as string[],
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

  // Private corner lock feedback state
  const [isPrivateCornerLocked, setIsPrivateCornerLocked] = useState(false);

  const [isChecking, setIsChecking] = useState(true);
  const [isAlreadyOnboarded, setIsAlreadyOnboarded] = useState(false);

  const isGenderChanged = Boolean(
    initialGender &&
    formData.gender &&
    initialGender.trim().toLowerCase() !== formData.gender.trim().toLowerCase()
  );

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
          if (p.gender) {
            setInitialGender(p.gender as string);
          }
          const pc = p.private_corner as Record<string, unknown> | undefined;
          if (pc?.verificationSelfie) {
            setInitialSelfie(pc.verificationSelfie as string);
          }
          const loadedBirthdate =
            formatBirthdateToISO(p.birthdate) || "2000-01-01";
          const loadedAge =
            typeof p.age === "number" && p.age >= 18
              ? p.age
              : calculateAgeFromBirthdate(loadedBirthdate);
          setFormData((prev) => ({
            ...prev,
            firstName: (p.first_name as string) || prev.firstName,
            age: loadedAge,
            birthdate: loadedBirthdate,
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
            additionalPhotos:
              Array.isArray(p.additional_photos) && p.additional_photos.length > 0
                ? (p.additional_photos as string[])
                : prev.additionalPhotos,
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

  const totalSteps = 16;

  const awardStepXp = (amount: number) => {
    addXp(amount);
    setEarnedXpTotal((prev) => prev + amount);
  };

  // Comprehensive step-by-step validator for each questionnaire
  const getStepValidation = (
    stepIndex: number,
  ): {
    isValid: boolean;
    error: string | null;
    hint?: string;
  } => {
    switch (stepIndex) {
      case 0: {
        const name = formData.firstName?.trim() || "";
        if (name.length < 2) {
          return {
            isValid: false,
            error: "Please enter your first name (at least 2 letters)",
            hint: "Type at least 2 letters",
          };
        }
        return { isValid: true, error: null };
      }
      case 1: {
        const bdate = formatBirthdateToISO(formData.birthdate);
        const age = formData.age ?? 0;
        if (!bdate || !/^\d{4}-\d{2}-\d{2}$/.test(bdate)) {
          return {
            isValid: false,
            error: "Please select a valid date of birth (YYYY-MM-DD)",
            hint: "Select your birthday",
          };
        }
        if (age < 18) {
          return {
            isValid: false,
            error: "You must be at least 18 years old to join Mayalu",
            hint: "Minimum age requirement is 18",
          };
        }
        if (age > 100) {
          return {
            isValid: false,
            error: "Please enter a realistic date of birth",
            hint: "Age must be under 100",
          };
        }
        return { isValid: true, error: null };
      }
      case 2: {
        const hasGender = Boolean(formData.gender?.trim());
        const hasInterestedIn = Boolean(formData.interestedIn?.trim());
        if (!hasGender || !hasInterestedIn) {
          return {
            isValid: false,
            error:
              "Please select both your gender and who you are looking for",
            hint: !hasGender
              ? "Select your gender"
              : "Select who you are looking for",
          };
        }
        return { isValid: true, error: null };
      }
      case 3: {
        const loc = formData.location?.trim() || "";
        if (loc.length < 2) {
          return {
            isValid: false,
            error: "Please select a hub or enter your city/neighborhood",
            hint: "Select or type your location",
          };
        }
        return { isValid: true, error: null };
      }
      case 4: {
        const intent = formData.relationshipIntent?.trim() || "";
        if (!intent) {
          return {
            isValid: false,
            error: "Please select your relationship intention",
            hint: "Select your relationship intent",
          };
        }
        return { isValid: true, error: null };
      }
      case 5: {
        if (isOtherDalBhat) {
          if (!customDalBhat.trim() || customDalBhat.trim().length < 2) {
            return {
              isValid: false,
              error:
                "Please describe your custom food routine (at least 2 letters)",
              hint: "Type custom routine or pick preset",
            };
          }
        } else if (!formData.dalBhatFrequency?.trim()) {
          return {
            isValid: false,
            error:
              "Please choose your Dal Bhat frequency or describe your routine",
            hint: "Choose your frequency",
          };
        }
        return { isValid: true, error: null };
      }
      case 6: {
        const chiya = formData.privateCorner?.chiyaPreference?.trim() || "";
        if (isOtherChiya) {
          if (!customChiya.trim() || customChiya.trim().length < 2) {
            return {
              isValid: false,
              error:
                "Please enter your custom daily drink ritual (at least 2 letters)",
              hint: "Type custom drink or pick preset",
            };
          }
        } else if (!chiya) {
          return {
            isValid: false,
            error: "Please choose your daily Chiya / drink ritual",
            hint: "Select your drink ritual",
          };
        }
        return { isValid: true, error: null };
      }
      case 7: {
        const music = formData.musicRepeat?.trim() || "";
        if (isOtherMusic) {
          if (!customMusic.trim() || customMusic.trim().length < 2) {
            return {
              isValid: false,
              error: "Please enter your favorite artist or sound on repeat",
              hint: "Type artist name or pick preset",
            };
          }
        } else if (!music) {
          return {
            isValid: false,
            error: "Please choose who is on repeat in your headphones",
            hint: "Select an artist on repeat",
          };
        }
        return { isValid: true, error: null };
      }
      case 8: {
        const flag = formData.greenFlag?.trim() || "";
        if (isOtherGreenFlag) {
          if (!customGreenFlag.trim() || customGreenFlag.trim().length < 3) {
            return {
              isValid: false,
              error:
                "Please enter your custom #1 green flag (at least 3 characters)",
              hint: "Type green flag (min 3 chars)",
            };
          }
        } else if (!flag) {
          return {
            isValid: false,
            error: "Please select or type your #1 green flag",
            hint: "Select a green flag",
          };
        }
        return { isValid: true, error: null };
      }
      case 9: {
        const occ = formData.occupation?.trim() || "";
        if (occ.length < 2) {
          return {
            isValid: false,
            error: "Please select or enter your occupation/field of study",
            hint: "Select or type your career/field",
          };
        }
        return { isValid: true, error: null };
      }
      case 10: {
        const count = formData.interests?.length || 0;
        if (count < 3) {
          return {
            isValid: false,
            error: `Please select at least 3 passions (${count}/3 selected)`,
            hint: `Pick ${3 - count} more passion${3 - count === 1 ? "" : "s"} (${count}/7)`,
          };
        }
        if (count > 7) {
          return {
            isValid: false,
            error: "Maximum 7 passions allowed",
            hint: "Keep 7 or fewer",
          };
        }
        return { isValid: true, error: null };
      }
      case 11: {
        const dietary = formData.privateCorner?.dietary?.trim();
        const astro = formData.privateCorner?.astrologyOpenness?.trim();
        if (!dietary || !astro) {
          return {
            isValid: false,
            error:
              "Please select both dietary preference and astrology outlook",
            hint: !dietary
              ? "Select dietary preference"
              : "Select astrology vibe",
          };
        }
        return { isValid: true, error: null };
      }
      case 12: {
        const minAge = formData.dealbreakers?.ageRangeMin ?? 21;
        const maxAge = formData.dealbreakers?.ageRangeMax ?? 32;
        const dist = formData.dealbreakers?.distance?.trim();
        if (minAge < 18) {
          return {
            isValid: false,
            error: "Minimum partner age must be at least 18",
            hint: "Min age >= 18",
          };
        }
        if (maxAge < minAge) {
          return {
            isValid: false,
            error: "Maximum age must be greater than or equal to minimum age",
            hint: "Max age >= Min age",
          };
        }
        if (!dist) {
          return {
            isValid: false,
            error: "Please select your preferred distance scope",
            hint: "Select distance scope",
          };
        }
        return { isValid: true, error: null };
      }
      case 13: {
        const promptText = activePromptText?.trim() || "";
        if (promptText.length < 5) {
          return {
            isValid: false,
            error:
              "Please write an authentic answer to the prompt (at least 5 characters)",
            hint: "Write at least 5 characters",
          };
        }
        return { isValid: true, error: null };
      }
      case 14: {
        const drinking = formData.speedRound?.drinking?.trim();
        const smoking = formData.speedRound?.smoking?.trim();
        const kids = formData.speedRound?.kids?.trim();
        if (!drinking || !smoking || !kids) {
          return {
            isValid: false,
            error:
              "Please answer all 3 speed round questions (Drinking, Smoking, Kids)",
            hint: !drinking
              ? "Select drinking habit"
              : !smoking
                ? "Select smoking habit"
                : "Select kids preference",
          };
        }
        return { isValid: true, error: null };
      }
      case 15: {
        const photo = formData.profilePhoto?.trim();
        const name = formData.firstName?.trim();
        if (!photo) {
          return {
            isValid: false,
            error: "Please choose an avatar for your Chino",
            hint: "Select an avatar",
          };
        }
        if (!name) {
          return {
            isValid: false,
            error: "First name is missing from your profile",
            hint: "Name required",
          };
        }
        return { isValid: true, error: null };
      }
      default:
        return { isValid: true, error: null };
    }
  };

  const advanceStep = () => {
    const val = getStepValidation(step);
    if (!val.isValid) {
      toast.warning(val.error || "Please complete this step to continue");
      return;
    }
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
    const rawVal = e.target.value;
    const val = formatBirthdateToISO(rawVal) || rawVal;
    let derivedAge = 24;
    if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      derivedAge = calculateAgeFromBirthdate(val);
    }
    setFormData((prev) => ({
      ...prev,
      birthdate: val,
      age: derivedAge,
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
      // Validate all steps first
      for (let s = 0; s < totalSteps; s++) {
        const val = getStepValidation(s);
        if (!val.isValid) {
          setStep(s);
          toast.warning(`Please review step ${s + 1}: ${val.error}`);
          setIsSubmitting(false);
          return;
        }
      }

      if (isGenderChanged) {
        const currentSelfie = formData.privateCorner?.verificationSelfie?.trim();
        if (!currentSelfie) {
          setStep(15);
          setStep15Tab("verify");
          toast.error(
            "Gender change detected! Maya requires a fresh verification selfie before saving your updated Chino.",
            { duration: 6000 }
          );
          setIsSubmitting(false);
          return;
        }
      }

      const cleanBirthdate =
        formatBirthdateToISO(formData.birthdate) || "2000-01-01";
      const cleanAge =
        typeof formData.age === "number" && formData.age >= 18
          ? formData.age
          : calculateAgeFromBirthdate(cleanBirthdate);

      const finalBio =
        formData.bio?.trim() ||
        `${formData.occupation || "Mayalu member"} based in ${formData.location}. ${formData.relationshipIntent}. Dal bhat: ${formData.dalBhatFrequency}.`;

      const payload: OnboardingData = {
        ...formData,
        birthdate: cleanBirthdate,
        age: cleanAge,
        bio: finalBio,
        profilePhoto: formData.profilePhoto || AVATAR_OPTIONS[0],
        promptAnswers: {
          [activePrompt]: activePromptText.trim(),
        },
      };

      await saveOnboardingProfile(payload);
      awardStepXp(100);
      if (soundEnabled) playCelebrateSound();

      // Immediately synchronize live UserProfile state across dashboard & layout
      updateUserProfile({
        firstName: payload.firstName,
        profilePhoto: payload.profilePhoto,
        age: payload.age,
        location: payload.location,
        occupation: payload.occupation,
        gender: payload.gender,
        relationshipIntent: payload.relationshipIntent,
        verificationStatus: payload.privateCorner?.verificationSelfie
          ? "pending_review"
          : "unsubmitted",
        onboardingCompleted: true,
      });

      const photoCount = payload.additionalPhotos?.length || 0;
      const hasThreePhotos = photoCount >= 3;
      const hasSelfie = Boolean(payload.privateCorner?.verificationSelfie);

      if (isGenderChanged) {
        toast.success("Subhakamana! 🌟 Your Chino has been updated!");
        toast.info(
          "🛡️ Gender updated! Your verification selfie has been submitted to Maya for 1-on-1 review.",
          { duration: 6000 }
        );
      } else if (hasThreePhotos && hasSelfie) {
        toast.success("Subhakamana! 🌟 Your Chino is saved, Hallway ready, and selfie submitted for verification!");
      } else {
        toast.success("Subhakamana! 🌟 Your Chino has been saved!");
        if (!hasThreePhotos) {
          toast.info(
            `Dhukuti: ${photoCount}/3 showcase photos uploaded. Submit all 3 photos to be available in the Hallway.`,
            { duration: 5500 }
          );
        }
        if (!hasSelfie) {
          toast.warning(
            "👻 You're entering in Ghost Spectator Mode! Send Maya your selfie so matching and Kura-Kani unlock.",
            { duration: 6000 }
          );
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push("/account/profile");
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

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

  const currentValidation = getStepValidation(step);

  return (
    <div className={cn("h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative selection:bg-rose-500 selection:text-white", className)}>
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
          {mode === "redo" && onCancel ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs h-8 px-3 rounded-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10 gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Chino</span>
            </Button>
          ) : isAlreadyOnboarded ? (
            <Link href="/account/profile">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex text-xs h-8 px-2.5 rounded-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10 gap-1"
              >
                <span>Chino Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          ) : null}

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
        <Card className={`w-full h-full flex flex-col rounded-3xl border border-border/60 bg-card/90 backdrop-blur-2xl shadow-2xl overflow-hidden relative p-0 gap-0 transition-all duration-300 ${step === 15
            ? "max-w-4xl lg:max-w-5xl max-h-[min(760px,calc(100dvh-4.5rem))]"
            : "max-w-2xl max-h-[min(650px,calc(100dvh-5.25rem))]"
          }`}>
          {/* Quick Step Navigator (Jump to any step to redo or edit) */}
          <div className="px-3 sm:px-4 py-2 border-b border-border/30 bg-muted/30 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0 flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider shrink-0 mr-1 hidden sm:inline">
              Jump:
            </span>
            {STEP_NAV_ITEMS.map((item) => {
              const isActive = step === item.step;
              const isGenderAlert = item.isGender && isGenderChanged;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setStep(item.step)}
                  className={cn(
                    "shrink-0 text-[11px] font-medium px-2 sm:px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 select-none active:scale-95",
                    isActive
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/20"
                      : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
                    isGenderAlert && !isActive && "border-amber-500/70 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                  )}
                  title={`Step ${item.step + 1}: ${item.label}`}
                >
                  <span className="text-[11px]">{item.emoji}</span>
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.step + 1}</span>
                  {isGenderAlert && (
                    <span className="size-1.5 rounded-full bg-amber-500 animate-ping ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Card Top: Maya's Guidance Section (Compact & sleek) */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border/30 bg-muted/20 shrink-0">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="relative shrink-0">
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-rose-500/40 shadow-sm">
                  <AvatarImage
                    src="https://robohash.org/mayalu"
                    alt="Maya"
                    className="object-cover"
                  />
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
                          min="1920-01-01"
                          max={new Date(
                            new Date().setFullYear(
                              new Date().getFullYear() - 18,
                            ),
                          )
                            .toISOString()
                            .slice(0, 10)}
                          value={
                            formatBirthdateToISO(formData.birthdate) ||
                            "2000-01-01"
                          }
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          I am a
                        </span>
                        {!formData.gender && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center ${formData.gender === opt.id
                              ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25"
                              : "bg-card border-border/80 text-foreground hover:bg-muted/80"
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {isGenderChanged && (
                        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 mt-1">
                          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                            <Camera className="size-3.5" />
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-amber-700 dark:text-amber-300">
                                Gender Update Requires Selfie Verification
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium py-0"
                              >
                                Mandatory
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Changing your gender from <strong className="capitalize text-foreground font-semibold">{initialGender}</strong> to <strong className="capitalize text-foreground font-semibold">{formData.gender}</strong> requires a fresh selfie. Maya verifies every change to protect you and prevent impersonation.
                            </p>
                            <div className="pt-0.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setStep(15);
                                  setStep15Tab("verify");
                                }}
                                className="h-7 text-[11px] rounded-full gap-1.5 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300"
                              >
                                <Camera className="size-3" />
                                <span>Upload / Snap Verification Selfie 🤳</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-1.5" />

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          Looking for
                        </span>
                        {!formData.interestedIn && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center ${formData.interestedIn === opt.id
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${formData.location === loc
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
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Select what describes your intent:
                        </span>
                        {!formData.relationshipIntent && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`p-3.5 rounded-2xl cursor-pointer transition-all ${formData.relationshipIntent === item.id
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
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Choose a routine or customize below:
                        </span>
                        {isOtherDalBhat &&
                          (!customDalBhat.trim() ||
                            customDalBhat.trim().length < 2) && (
                            <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Type routine
                              below
                            </span>
                          )}
                      </div>
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
                            className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all ${formData.dalBhatFrequency === item.id &&
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
                          className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all ${isOtherDalBhat
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
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${isOtherDalBhat
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
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Pick your favorite or enter a custom ritual:
                        </span>
                        {isOtherChiya &&
                          (!customChiya.trim() ||
                            customChiya.trim().length < 2) && (
                            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Type drink
                              below
                            </span>
                          )}
                      </div>
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
                            className={`w-full p-2 sm:p-2.5 rounded-xl border text-left transition-all ${formData.privateCorner?.chiyaPreference ===
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
                          className={`w-full p-2 sm:p-2.5 rounded-xl border text-left transition-all ${isOtherChiya
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
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${isOtherChiya
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
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Choose an artist or type your own below:
                        </span>
                        {isOtherMusic &&
                          (!customMusic.trim() ||
                            customMusic.trim().length < 2) && (
                            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Type artist
                              below
                            </span>
                          )}
                      </div>
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
                            className={`p-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${formData.musicRepeat === art && !isOtherMusic
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
                          className={`p-2 rounded-xl text-xs sm:text-sm font-medium transition-all col-span-2 sm:col-span-3 ${isOtherMusic
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
                          className={`h-9 sm:h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${isOtherMusic
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
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Select a green flag or write your own below:
                        </span>
                        {isOtherGreenFlag &&
                          (!customGreenFlag.trim() ||
                            customGreenFlag.trim().length < 3) && (
                            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Min 3 chars
                              below
                            </span>
                          )}
                      </div>
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
                            className={`rounded-2xl p-2.5 sm:p-3 text-xs sm:text-[13px] font-medium transition-all ${formData.greenFlag === flag && !isOtherGreenFlag
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
                          className={`rounded-2xl p-2.5 sm:p-3 text-xs sm:text-[13px] font-medium transition-all col-span-1 sm:col-span-2 ${isOtherGreenFlag
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
                          className={`h-10 text-xs sm:text-sm bg-background/80 rounded-xl px-3 border transition-all ${isOtherGreenFlag
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
                    <div className="flex items-center justify-between pb-0.5">
                      <span className="text-xs text-muted-foreground font-medium">
                        Popular categories (or enter your specific field):
                      </span>
                      {!formData.occupation?.trim() && (
                        <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Select or type field
                        </span>
                      )}
                    </div>
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
                          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${formData.occupation === occ
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
                                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${isSelected
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
                  <div className="flex flex-col gap-2.5 max-w-lg mx-auto pt-0.5">
                    {/* Nepali Religion, Caste & Gotra Selector Card with Integrated Guarantee */}
                    <div className="rounded-2xl border-2 border-dashed border-violet-500/30 dark:border-violet-500/40 bg-violet-500/[0.03] dark:bg-violet-950/20 p-3 sm:p-3.5 text-foreground shadow-xs flex flex-col gap-2.5 backdrop-blur-sm">
                      {/* Integrated Private Corner Guarantee Header */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50 dark:border-border/30">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                          <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                          <span>Private Corner Guarantee</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 px-1.5 bg-violet-500/10 border-violet-500/25 text-violet-600 dark:text-violet-300 font-medium"
                          >
                            Confidential
                          </Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          Caste, gotra & religion stay private
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Caste, gotra, religion remain private — only used to match if you choose to share.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                        {/* Religion */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground block">
                            Religion
                          </label>
                          <div className="relative">
                            <select
                              value={formData.privateCorner?.religion || "Hindu"}
                              onChange={(e) => {
                                setIsPrivateCornerLocked(false);
                                setFormData({
                                  ...formData,
                                  privateCorner: {
                                    ...formData.privateCorner,
                                    religion: e.target.value,
                                  },
                                });
                              }}
                              className="w-full appearance-none rounded-full bg-background border border-border/80 text-foreground font-semibold px-3 py-1.5 pr-7 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 hover:border-violet-500/40 transition-colors cursor-pointer"
                            >
                              {NEPALI_RELIGIONS.map((rel) => (
                                <option key={rel} value={rel}>
                                  {rel}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                          </div>
                        </div>

                        {/* Caste */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground block">
                            Caste
                          </label>
                          <div className="relative">
                            <select
                              value={formData.privateCorner?.caste || "Brahmin"}
                              onChange={(e) => {
                                setIsPrivateCornerLocked(false);
                                setFormData({
                                  ...formData,
                                  privateCorner: {
                                    ...formData.privateCorner,
                                    caste: e.target.value,
                                  },
                                });
                              }}
                              className="w-full appearance-none rounded-full bg-background border border-border/80 text-foreground font-semibold px-3 py-1.5 pr-7 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 hover:border-violet-500/40 transition-colors cursor-pointer"
                            >
                              {NEPALI_CASTES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                          </div>
                        </div>

                        {/* Gotra */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground block">
                            Gotra
                          </label>
                          <div className="relative">
                            <select
                              value={formData.privateCorner?.gotra || "Mudgal"}
                              onChange={(e) => {
                                setIsPrivateCornerLocked(false);
                                setFormData({
                                  ...formData,
                                  privateCorner: {
                                    ...formData.privateCorner,
                                    gotra: e.target.value,
                                  },
                                });
                              }}
                              className="w-full appearance-none rounded-full bg-background border border-violet-500/40 dark:border-violet-400/40 text-foreground font-semibold px-3 py-1.5 pr-7 text-xs shadow-xs ring-1 ring-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-colors cursor-pointer"
                            >
                              {NEPALI_GOTRAS.map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span>Sealed & private in your Dhukuti 🔒</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPrivateCornerLocked(false);
                              setFormData({
                                ...formData,
                                privateCorner: {
                                  ...formData.privateCorner,
                                  religion: "Open / No preference",
                                  caste: "Other / Open to all",
                                  gotra: "Open / Skip",
                                },
                              });
                              toast.info("Skipped — kept open for all matches ✨");
                            }}
                            className="px-3.5 py-1 text-xs font-semibold rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-transform duration-150 ease-out active:scale-95 shadow-xs"
                          >
                            Skip
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsPrivateCornerLocked(true);
                              toast.success("Locked in your Private Corner 🔒", {
                                description: `${formData.privateCorner?.religion || "Hindu"} • ${formData.privateCorner?.caste || "Brahmin"} • ${formData.privateCorner?.gotra || "Mudgal"} sealed securely.`,
                              });
                            }}
                            className={`px-4 py-1 text-xs font-semibold rounded-full transition-transform duration-150 ease-out active:scale-95 flex items-center gap-1.5 shadow-sm ${isPrivateCornerLocked
                                ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30"
                                : "bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white shadow-rose-500/25 hover:shadow-rose-500/35 hover:scale-[1.02]"
                              }`}
                          >
                            <span>{isPrivateCornerLocked ? "Locked in" : "Lock it in"}</span>
                            <span>🔒</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dietary Preference (Compact 4-Pill Row) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <span>Dietary Preference</span>
                          <span>🥗</span>
                        </span>
                        {!formData.privateCorner?.dietary && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                            className={`py-1.5 px-2 rounded-xl text-xs font-medium text-center border transition-all duration-150 active:scale-[0.98] ${formData.privateCorner?.dietary === d
                                ? "bg-rose-500/15 border-rose-500 text-foreground ring-1 ring-rose-500 font-semibold shadow-xs"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                              }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Astrology & Kundali Vibe (Compact 3-Card Row) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <span>Astrology & Kundali Vibe</span>
                          <span>🔮</span>
                        </span>
                        {!formData.privateCorner?.astrologyOpenness && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          {
                            id: "Believer (Kundali match is fun/meaningful) 🔮",
                            title: "Believer 🔮",
                            desc: "Kundali match matters",
                          },
                          {
                            id: "Open-minded / Casual ✨",
                            title: "Open-minded ✨",
                            desc: "Casual & fun vibe",
                          },
                          {
                            id: "Not into it 🙅‍♂️",
                            title: "Not into it 🙅‍♂️",
                            desc: "Modern outlook",
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
                            className={`py-1.5 px-2.5 rounded-xl text-left border transition-all duration-150 active:scale-[0.98] flex flex-col justify-between ${formData.privateCorner?.astrologyOpenness === a.id
                                ? "bg-amber-500/15 border-amber-500 text-foreground ring-1 ring-amber-500 font-semibold shadow-xs"
                                : "bg-card border-border/70 text-foreground hover:bg-muted/60"
                              }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-semibold">{a.title}</span>
                              {formData.privateCorner?.astrologyOpenness === a.id && (
                                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                              {a.desc}
                            </span>
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
                          {formData.dealbreakers?.ageRangeMin || 23} -{" "}
                          {formData.dealbreakers?.ageRangeMax || 27} yrs
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
                            value={formData.dealbreakers?.ageRangeMin || 23}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dealbreakers: {
                                  ...formData.dealbreakers,
                                  ageRangeMin: Number(e.target.value) || 23,
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
                            value={formData.dealbreakers?.ageRangeMax || 27}
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
                      {(formData.dealbreakers?.ageRangeMin ?? 21) >
                        (formData.dealbreakers?.ageRangeMax ?? 32) && (
                          <p className="text-xs text-destructive font-medium flex items-center gap-1 pt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Maximum age must be greater than or equal to minimum
                              age.
                            </span>
                          </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground block">
                          Distance Scope 🗺️
                        </span>
                        {!formData.dealbreakers?.distance && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${formData.dealbreakers?.distance === dist
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
                            className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${activePrompt === pObj.prompt
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
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span>Authentic answers get 2.8x more replies</span>
                        <span
                          className={
                            activePromptText.trim().length >= 5
                              ? "text-emerald-500 font-medium"
                              : "text-amber-500 font-medium"
                          }
                        >
                          {activePromptText.trim().length}/5 min characters
                        </span>
                      </div>

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
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium block">
                          Drinking 🍷
                        </span>
                        {!formData.speedRound?.drinking && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${formData.speedRound?.drinking === v
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium block">
                          Smoking 🚭
                        </span>
                        {!formData.speedRound?.smoking && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                            className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${formData.speedRound?.smoking === v
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium block">
                          Kids in the future? 👶
                        </span>
                        {!formData.speedRound?.kids && (
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Select one
                          </span>
                        )}
                      </div>
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
                              className={`flex-1 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all border ${formData.speedRound?.kids === v
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
                {step === 15 && (() => {
                  const renderChinoCard = () => (
                    <div className="relative rounded-3xl p-0.5 bg-gradient-to-br from-rose-500/80 via-purple-500/80 to-amber-400/80 shadow-xl shadow-rose-500/10">
                      <div className="bg-card/95 backdrop-blur-xl rounded-[22px] p-3.5 sm:p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-2xl overflow-hidden ring-2 ring-rose-500/50 shrink-0 bg-muted/50">
                            <Image
                              src={formData.profilePhoto || AVATAR_OPTIONS[0]}
                              alt={formData.firstName || "Profile"}
                              fill
                              className="object-cover transition-all duration-200"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base">
                              <span>{formData.firstName}</span>
                              <span className="text-rose-500 font-semibold text-xs sm:text-sm">
                                {formData.age}
                              </span>
                              {formData.privateCorner?.verificationSelfie ? (
                                <div
                                  className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                                  title="Selfie submitted — Maya is reviewing"
                                >
                                  <ShieldCheck className="size-3 text-emerald-500" />
                                  <span className="text-[10px]">Maya Checking</span>
                                </div>
                              ) : (
                                <div
                                  className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30"
                                  title="Unverified profiles remain in Ghost Spectator mode"
                                >
                                  <Ghost className="size-3 text-purple-500" />
                                  <span className="text-[10px]">Ghost Mode 👻</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3 text-rose-500 shrink-0" />
                              <span className="truncate">{formData.location}</span>
                              <span>•</span>
                              <span className="truncate">{formData.occupation}</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              <Badge className="bg-rose-500/15 text-rose-500 text-[10px] px-2 py-0 border-none font-medium">
                                {formData.relationshipIntent}
                              </Badge>
                              {formData.privateCorner?.dietary && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0 border-none font-medium">
                                  {formData.privateCorner.dietary}
                                </Badge>
                              )}
                              {(formData.additionalPhotos?.length || 0) >= 3 ? (
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="size-2.5" />
                                  <span>Hallway Ready</span>
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 flex items-center gap-1 font-medium">
                                  <AlertCircle className="size-2.5" />
                                  <span>{formData.additionalPhotos?.length || 0}/3 Photos</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {formData.bio && (
                          <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded-xl border border-border/30">
                            "{formData.bio}"
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/40 p-2 rounded-xl border border-border/30">
                            <span className="text-[10px] text-muted-foreground block">Dal Bhat</span>
                            <span className="font-semibold text-amber-500 text-xs">
                              {formData.dalBhatFrequency}
                            </span>
                          </div>
                          <div className="bg-muted/40 p-2 rounded-xl border border-border/30">
                            <span className="text-[10px] text-muted-foreground block">On Repeat</span>
                            <span className="font-semibold text-violet-500 text-xs truncate block">
                              {formData.musicRepeat}
                            </span>
                          </div>
                        </div>

                        {formData.interests && formData.interests.length > 0 && (
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

                        <div className="bg-muted/50 dark:bg-slate-900/40 p-2.5 rounded-xl text-xs space-y-0.5 border border-border/40">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                            मयालु प्रसङ्ग
                          </span>
                          <p className="text-[10px] text-rose-500 font-semibold italic">
                            "{activePrompt}"
                          </p>
                          <p className="text-xs leading-relaxed text-foreground/90">
                            "{activePromptText}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <div className="w-full pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Left Pane (Desktop): Hero Pinned Chino Card */}
                        <div className="hidden md:flex md:col-span-5 flex-col gap-2.5">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                              <Sparkles className="size-3.5 text-rose-500" />
                              <span>Your Chino Identity Card</span>
                            </span>
                            <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/20 py-0 font-medium">
                              Live Preview
                            </Badge>
                          </div>
                          {renderChinoCard()}
                        </div>

                        {/* Right Pane (Desktop) / Full Pane (Mobile): Studio Tabs */}
                        <div className="col-span-1 md:col-span-7 flex flex-col gap-3 min-h-0">
                          <Tabs value={step15Tab} onValueChange={setStep15Tab} className="w-full flex flex-col gap-3">
                            <TabsList className="grid w-full grid-cols-4 md:grid-cols-3 bg-muted/80 dark:bg-muted/50 p-1 rounded-2xl h-11 border border-border/70 shadow-xs">
                              {/* Mobile Only: Preview Card Tab */}
                              <TabsTrigger
                                value="preview"
                                className="md:hidden rounded-xl text-xs font-medium gap-1.5 transition-all text-muted-foreground hover:text-foreground data-active:bg-background data-active:text-rose-600 dark:data-active:text-rose-400 data-active:font-bold data-active:shadow-md data-active:shadow-black/5 data-active:ring-1.5 data-active:ring-rose-500/40 active:scale-[0.98]"
                              >
                                <Sparkles className="size-3.5 text-muted-foreground/70 group-data-active/tab:text-rose-500 group-data-active/tab:scale-110 transition-all" />
                                <span>Card</span>
                              </TabsTrigger>

                              {/* Tab 1: Face & Bio */}
                              <TabsTrigger
                                value="avatar"
                                className="rounded-xl text-xs font-medium gap-1.5 transition-all text-muted-foreground hover:text-foreground data-active:bg-background data-active:text-rose-600 dark:data-active:text-rose-400 data-active:font-bold data-active:shadow-md data-active:shadow-black/5 data-active:ring-1.5 data-active:ring-rose-500/40 active:scale-[0.98]"
                              >
                                <Smile className="size-3.5 text-muted-foreground/70 group-data-active/tab:text-rose-500 group-data-active/tab:scale-110 transition-all" />
                                <span>Face & Bio</span>
                              </TabsTrigger>

                              {/* Tab 2: Dhukuti Showcase Photos */}
                              <TabsTrigger
                                value="photos"
                                className="rounded-xl text-xs font-medium gap-1.5 transition-all text-muted-foreground hover:text-foreground data-active:bg-background data-active:text-amber-600 dark:data-active:text-amber-400 data-active:font-bold data-active:shadow-md data-active:shadow-black/5 data-active:ring-1.5 data-active:ring-amber-500/40 active:scale-[0.98]"
                              >
                                <Lock className="size-3.5 text-muted-foreground/70 group-data-active/tab:text-amber-500 group-data-active/tab:scale-110 transition-all" />
                                <span>Dhukuti ({formData.additionalPhotos?.length || 0}/3)</span>
                              </TabsTrigger>

                              {/* Tab 3: Verification */}
                              <TabsTrigger
                                value="verify"
                                className={cn(
                                  "rounded-xl text-xs font-medium gap-1.5 transition-all text-muted-foreground hover:text-foreground data-active:bg-background data-active:font-bold data-active:shadow-md data-active:shadow-black/5 data-active:ring-1.5 active:scale-[0.98]",
                                  isGenderChanged
                                    ? "text-amber-600 dark:text-amber-400 data-active:text-amber-600 dark:data-active:text-amber-400 data-active:ring-amber-500/50"
                                    : "data-active:text-violet-600 dark:data-active:text-violet-400 data-active:ring-violet-500/40"
                                )}
                              >
                                {isGenderChanged ? (
                                  <>
                                    <Camera className="size-3.5 text-amber-500 animate-pulse" />
                                    <span>Selfie Required ⚠️</span>
                                  </>
                                ) : formData.privateCorner?.verificationSelfie ? (
                                  <>
                                    <ShieldCheck className="size-3.5 text-muted-foreground/70 group-data-active/tab:text-emerald-500 group-data-active/tab:scale-110 transition-all" />
                                    <span>Verified 🔑</span>
                                  </>
                                ) : (
                                  <>
                                    <Ghost className="size-3.5 text-muted-foreground/70 group-data-active/tab:text-violet-500 group-data-active/tab:scale-110 transition-all" />
                                    <span>Exit Ghost Mode 👻</span>
                                  </>
                                )}
                              </TabsTrigger>
                            </TabsList>

                            {/* Mobile Preview Content */}
                            <TabsContent value="preview" className="md:hidden flex flex-col gap-2">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-medium text-muted-foreground">Chino Profile Card</span>
                                <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-500/20 py-0">Live Preview</Badge>
                              </div>
                              {renderChinoCard()}
                            </TabsContent>

                            {/* Tab Content: Face & Bio */}
                            <TabsContent value="avatar" className="flex flex-col gap-3">
                              <DiceBearAvatarStudio
                                variant="plain"
                                selectedAvatarUrl={formData.profilePhoto || AVATAR_OPTIONS[0]}
                                onSelectAvatar={(url) =>
                                  setFormData({
                                    ...formData,
                                    profilePhoto: url,
                                  })
                                }
                                userFirstName={formData.firstName}
                              />

                              {/* Chino Bio */}
                              <div className="p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 flex flex-col gap-2 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <span>Chino Bio</span>
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={generateMayaBio}
                                    className="text-amber-500 hover:text-amber-600 text-xs h-6 px-2 gap-1 active:scale-[0.96] transition-transform"
                                  >
                                    <Sparkles className="size-3" />
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
                            </TabsContent>

                            {/* Tab Content: Dhukuti Showcase Photos */}
                            <TabsContent value="photos" className="flex flex-col gap-3">
                              <DhukutiPhotoVault
                                mode="photos"
                                photos={formData.additionalPhotos || []}
                                onChangePhotos={(photos) =>
                                  setFormData({
                                    ...formData,
                                    additionalPhotos: photos,
                                  })
                                }
                              />
                            </TabsContent>

                            {/* Tab Content: Admin Verification Selfie */}
                            <TabsContent value="verify" className="flex flex-col gap-3">
                              <DhukutiPhotoVault
                                mode="selfie"
                                photos={formData.additionalPhotos || []}
                                onChangePhotos={() => { }}
                                verificationSelfie={formData.privateCorner?.verificationSelfie || ""}
                                onChangeSelfie={(selfieUrl) =>
                                  setFormData({
                                    ...formData,
                                    privateCorner: {
                                      ...formData.privateCorner,
                                      verificationSelfie: selfieUrl,
                                      verificationStatus: selfieUrl ? "pending_review" : "unsubmitted",
                                    },
                                  })
                                }
                              />
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Bottom: Navigation Action Bar */}
          <div className="p-3.5 sm:p-4 pt-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between shrink-0 gap-2">
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

            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center min-w-0">
              <span className="text-xs text-muted-foreground font-medium shrink-0">
                Step {step + 1} of {totalSteps}
              </span>
              {!currentValidation.isValid && (
                <span className="text-[11px] text-amber-500 dark:text-amber-400 font-medium hidden md:inline-flex items-center gap-1 max-w-[220px] truncate">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {currentValidation.hint || currentValidation.error}
                  </span>
                </span>
              )}
            </div>

            {step === totalSteps - 1 ? (
              <Button
                onClick={handleFinalSubmit}
                disabled={!currentValidation.isValid || isSubmitting}
                className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold px-6 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                disabled={!currentValidation.isValid || isSubmitting}
                className="rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white font-semibold px-6 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
