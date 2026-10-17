"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// User level context
export type UserLevel = {
  level: number;
  xp: number;
  requiredXp: number;
};

export interface UserProfileState {
  id?: string;
  email?: string;
  name?: string | null;
  image?: string | null;
  role?: string;
  firstName?: string | null;
  profilePhoto?: string | null;
  age?: number | null;
  location?: string | null;
  occupation?: string | null;
  gender?: string | null;
  relationshipIntent?: string | null;
  verificationStatus?:
    | "verified"
    | "pending_review"
    | "rejected"
    | "unsubmitted"
    | string;
  onboardingCompleted?: boolean;
  superLikes?: number;
  [key: string]: unknown;
}

export interface UserContextType {
  userLevel: UserLevel;
  addXp: (amount: number) => void;
  userProfile: UserProfileState | null;
  setUserProfile: React.Dispatch<
    React.SetStateAction<UserProfileState | null>
  >;
  updateUserProfile: (updates: Partial<UserProfileState>) => void;
  superLikes: number;
  useSuperLike: () => boolean;
}

export const defaultUserLevel: UserLevel = {
  level: 1,
  xp: 0,
  requiredXp: 100,
};

const UserContext = createContext<UserContextType>({
  userLevel: defaultUserLevel,
  addXp: () => {},
  userProfile: null,
  setUserProfile: () => {},
  updateUserProfile: () => {},
  superLikes: 3,
  useSuperLike: () => false,
});

export interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role?: string;
  } | null;
  initialProfile?: Record<string, unknown> | null;
  initialRole?: string;
}

function extractProfileState(
  user?: UserProviderProps["initialUser"],
  profile?: Record<string, unknown> | null,
  role?: string
): UserProfileState | null {
  if (!user && !profile) return null;

  const privateCorner = (profile?.private_corner as
    | Record<string, unknown>
    | undefined) || {};

  const verificationStatus =
    (privateCorner.verificationStatus as string) ||
    (privateCorner.verificationSelfie ? "pending_review" : "unsubmitted");

  return {
    id: user?.id || (profile?.user_id as string) || "",
    email: user?.email || (profile?.email as string) || "",
    name: user?.name || (profile?.auth_name as string) || null,
    image: user?.image || (profile?.auth_image as string) || null,
    role: role || (profile?.auth_role as string) || user?.role || "user",
    firstName:
      (profile?.first_name as string) ||
      user?.name?.split(" ")[0] ||
      (user?.email ? user.email.split("@")[0] : null),
    profilePhoto:
      (profile?.profile_photo as string) ||
      user?.image ||
      (profile?.auth_image as string) ||
      null,
    age: (profile?.age as number) || null,
    location: (profile?.location as string) || null,
    occupation: (profile?.occupation as string) || null,
    gender: (profile?.gender as string) || null,
    relationshipIntent: (profile?.relationship_intent as string) || null,
    verificationStatus,
    onboardingCompleted: Boolean(profile?.onboarding_completed),
  };
}

export function UserProvider({
  children,
  initialUser,
  initialProfile,
  initialRole,
}: UserProviderProps) {
  const [userLevel, setUserLevel] = useState<UserLevel>(defaultUserLevel);
  const [superLikes, setSuperLikes] = useState<number>(3);
  const [userProfile, setUserProfile] = useState<UserProfileState | null>(() =>
    extractProfileState(initialUser, initialProfile, initialRole)
  );

  // Sync state when initial props update (e.g. after router.refresh())
  useEffect(() => {
    const extracted = extractProfileState(
      initialUser,
      initialProfile,
      initialRole
    );
    if (extracted) {
      setUserProfile((prev) => ({
        ...prev,
        ...extracted,
      }));
    }
  }, [initialUser, initialProfile, initialRole]);

  // Load user level and super likes from localStorage on client side
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem("mayalu_user_level");
      if (savedLevel) {
        const parsed = JSON.parse(savedLevel);
        if (
          parsed &&
          typeof parsed.level === "number" &&
          typeof parsed.xp === "number"
        ) {
          setUserLevel(parsed);
        }
      }
      const savedSuperLikes = localStorage.getItem("mayalu_super_likes");
      if (savedSuperLikes) {
        const parsedSl = Number.parseInt(savedSuperLikes, 10);
        if (!Number.isNaN(parsedSl)) {
          setSuperLikes(parsedSl);
        }
      }
      const savedProfile = localStorage.getItem("mayalu_user_profile");
      if (savedProfile) {
        const parsedProf = JSON.parse(savedProfile);
        if (parsedProf && typeof parsedProf === "object") {
          setUserProfile((prev) => prev || parsedProf);
        }
      }
    } catch {
      // LocalStorage access may fail in restricted browser environments
    }
  }, []);

  const addXp = useCallback((amount: number) => {
    if (typeof amount !== "number" || amount <= 0) return;

    setUserLevel((prev) => {
      let currentXp = prev.xp + amount;
      let currentLevel = prev.level;
      let currentRequired = prev.requiredXp || 100;

      // Handle multi-level jump if large XP awarded
      while (currentXp >= currentRequired) {
        currentXp -= currentRequired;
        currentLevel += 1;
        currentRequired = Math.floor(currentRequired * 1.5);
      }

      const nextLevel: UserLevel = {
        level: currentLevel,
        xp: currentXp,
        requiredXp: currentRequired,
      };

      try {
        localStorage.setItem(
          "mayalu_user_level",
          JSON.stringify(nextLevel)
        );
      } catch {
        // Ignored if storage is blocked
      }

      return nextLevel;
    });
  }, []);

  const updateUserProfile = useCallback(
    (updates: Partial<UserProfileState>) => {
      setUserProfile((prev) => {
        const next = prev ? { ...prev, ...updates } : (updates as UserProfileState);
        try {
          localStorage.setItem("mayalu_user_profile", JSON.stringify(next));
        } catch {
          // Ignored if storage is blocked
        }
        return next;
      });
    },
    []
  );

  const useSuperLike = useCallback((): boolean => {
    if (superLikes <= 0) return false;
    setSuperLikes((prev) => {
      const next = Math.max(0, prev - 1);
      try {
        localStorage.setItem("mayalu_super_likes", String(next));
      } catch {
        // Ignored
      }
      return next;
    });
    return true;
  }, [superLikes]);

  const value = useMemo(
    () => ({
      userLevel,
      addXp,
      userProfile,
      setUserProfile,
      updateUserProfile,
      superLikes,
      useSuperLike,
    }),
    [
      userLevel,
      addXp,
      userProfile,
      updateUserProfile,
      superLikes,
      useSuperLike,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
export const useUserLevel = () => {
  const { userLevel, addXp } = useContext(UserContext);
  return { userLevel, addXp };
};
export const useUserProfile = () => {
  const { userProfile, setUserProfile, updateUserProfile, superLikes, useSuperLike } =
    useContext(UserContext);
  return {
    userProfile,
    setUserProfile,
    updateUserProfile,
    superLikes,
    useSuperLike,
  };
};