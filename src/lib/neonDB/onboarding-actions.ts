"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/neonDB/auth-server";
import {
  formatBirthdateToISO,
  calculateAgeFromBirthdate,
} from "@/lib/date-utils";
import {
  findUserOnboardingStatus,
  isUserOnboarded,
  saveOnboardingProfileTx,
  findFullUserProfileWithAuth,
  type SaveOnboardingProfileInput,
} from "@/lib/neonDB/queries";

export interface OnboardingData {
  firstName: string;
  birthdate?: string;
  age?: number;
  gender: string;
  interestedIn: string;
  location: string;
  relationshipIntent: string;
  dalBhatFrequency?: string;
  musicRepeat?: string;
  greenFlag?: string;
  occupation?: string;
  bio?: string;
  height?: string;
  education?: string;
  interests?: string[];
  promptAnswers?: Record<string, string>;
  speedRound?: {
    drinking?: string;
    smoking?: string;
    kids?: string;
  };
  privateCorner?: {
    caste?: string;
    religion?: string;
    dietary?: string;
    familyNotes?: string;
    chiyaPreference?: string;
    astrologyOpenness?: string;
    familyVibe?: string;
    [key: string]: string | undefined;
  };
  dealbreakers?: {
    ageRangeMin?: number;
    ageRangeMax?: number;
    distance?: string;
  };
  profilePhoto?: string;
  additionalPhotos?: string[];
}

/**
 * Check whether the given user (or current session user) has completed onboarding.
 * Delegates database query to queries.ts.
 */
export async function getUserOnboardingStatus(userId?: string): Promise<{
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId?: string;
  profile?: Record<string, unknown> | null;
}> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const sessionUser = await getSessionUser();
      if (!sessionUser) {
        return { isAuthenticated: false, isOnboarded: false };
      }
      targetUserId = sessionUser.uid;
    }

    const row = await findUserOnboardingStatus(targetUserId);

    if (!row) {
      return {
        isAuthenticated: true,
        isOnboarded: false,
        userId: targetUserId,
        profile: null,
      };
    }

    const profile: Record<string, any> = { ...row };
    if (profile.birthdate) {
      profile.birthdate = formatBirthdateToISO(profile.birthdate);
    }
    const isOnboarded = Boolean(profile.onboarding_completed);

    // Sync cookie directly for edge proxy
    if (isOnboarded) {
      try {
        const cookieStore = await cookies();
        cookieStore.set("mayalu_onboarded", "true", {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
      } catch {
        // Ignored if called in context where cookies cannot be written
      }
    }

    return {
      isAuthenticated: true,
      isOnboarded,
      userId: targetUserId,
      profile,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { isAuthenticated: false, isOnboarded: false };
  }
}

/**
 * Verifies the user's onboarding completion status in Neon Postgres,
 * syncs the `mayalu_onboarded` cookie, and returns the destination route.
 */
export async function syncUserOnboardingStatus(): Promise<{
  isAuthenticated: boolean;
  isOnboarded: boolean;
  redirectTo: string;
}> {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return {
        isAuthenticated: false,
        isOnboarded: false,
        redirectTo: "/auth/login",
      };
    }

    const isOnboarded = await isUserOnboarded(sessionUser.uid);

    // Sync cookie for edge proxy
    try {
      const cookieStore = await cookies();
      if (isOnboarded) {
        cookieStore.set("mayalu_onboarded", "true", {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
      } else {
        cookieStore.delete("mayalu_onboarded");
      }
    } catch {
      // Ignored if called in a context where cookies cannot be written
    }

    return {
      isAuthenticated: true,
      isOnboarded,
      redirectTo: isOnboarded ? "/account/dashboard" : "/account/onboarding",
    };
  } catch (error) {
    console.error("Error syncing user onboarding status:", error);
    return {
      isAuthenticated: false,
      isOnboarded: false,
      redirectTo: "/account/onboarding",
    };
  }
}

/**
 * Save user profile and mark onboarding as complete using atomic transaction in queries.ts.
 */
export async function saveOnboardingProfile(data: OnboardingData) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error("Unauthorized: Please log in to complete onboarding");
  }

  const userId = sessionUser.uid;

  const cleanBirthdate = formatBirthdateToISO(data.birthdate);
  const birthdateVal =
    cleanBirthdate && /^\d{4}-\d{2}-\d{2}$/.test(cleanBirthdate)
      ? cleanBirthdate
      : null;
  let ageVal =
    data.age && !Number.isNaN(Number(data.age)) ? Number(data.age) : null;
  if (!ageVal && birthdateVal) {
    ageVal = calculateAgeFromBirthdate(birthdateVal);
  }

  const input: SaveOnboardingProfileInput = {
    ...data,
    birthdate: birthdateVal,
    age: ageVal,
  };

  try {
    const result = await saveOnboardingProfileTx(userId, input);

    // Set cookie for quick client/edge checking
    const cookieStore = await cookies();
    cookieStore.set("mayalu_onboarded", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    revalidatePath("/account/dashboard");
    revalidatePath("/account/profile");
    revalidatePath("/account/onboarding");

    return {
      success: true,
      profile: result,
    };
  } catch (err: unknown) {
    console.error("Error saving onboarding profile:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to save profile. Please try again.";
    throw new Error(message);
  }
}

/**
 * Fetch complete user profile joined with auth information for the Chino profile page.
 */
export async function getFullUserProfile(userId?: string) {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const sessionUser = await getSessionUser();
      if (!sessionUser) return null;
      targetUserId = sessionUser.uid;
    }

    const row = await findFullUserProfileWithAuth(targetUserId);
    if (!row) return null;

    const profile: Record<string, any> = { ...row };
    if (profile.birthdate) {
      profile.birthdate = formatBirthdateToISO(profile.birthdate);
    }
    if (profile.created_at && profile.created_at instanceof Date) {
      profile.created_at = profile.created_at.toISOString();
    }
    if (profile.updated_at && profile.updated_at instanceof Date) {
      profile.updated_at = profile.updated_at.toISOString();
    }
    return profile;
  } catch (err) {
    console.error("Error in getFullUserProfile:", err);
    return null;
  }
}
