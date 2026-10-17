"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/neonDB/auth-server";

import {
  formatBirthdateToISO,
  calculateAgeFromBirthdate,
} from "@/lib/date-utils";

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

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(url);
}

/**
 * Check whether the given user (or current session user) has completed onboarding.
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

    const sql = getDb();
    const rows = await sql`
      SELECT 
        user_id,
        onboarding_completed,
        first_name,
        birthdate,
        age,
        gender,
        interested_in,
        location,
        relationship_intent,
        dal_bhat_frequency,
        music_repeat,
        green_flag,
        occupation,
        bio,
        height,
        education,
        interests,
        prompt_answers,
        speed_round,
        private_corner,
        dealbreakers,
        profile_photo,
        additional_photos,
        created_at,
        updated_at
      FROM public.user_profiles
      WHERE user_id = ${targetUserId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return {
        isAuthenticated: true,
        isOnboarded: false,
        userId: targetUserId,
        profile: null,
      };
    }

    const profile = { ...rows[0] };
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

    const sql = getDb();
    const rows = await sql`
      SELECT onboarding_completed
      FROM public.user_profiles
      WHERE user_id = ${sessionUser.uid}
      LIMIT 1
    `;

    const isOnboarded =
      rows.length > 0 && Boolean(rows[0].onboarding_completed);

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
 * Save user profile and mark onboarding as complete.
 */
export async function saveOnboardingProfile(data: OnboardingData) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error("Unauthorized: Please log in to complete onboarding");
  }

  const userId = sessionUser.uid;
  const sql = getDb();

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
  // Check if gender is changing on an existing profile
  const existingRows = await sql`
    SELECT gender, private_corner
    FROM public.user_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const existingProfile = existingRows[0];
  const oldGender = existingProfile?.gender;
  const newGender = data.gender;
  const isGenderChange = Boolean(
    oldGender &&
    newGender &&
    oldGender.trim().toLowerCase() !== newGender.trim().toLowerCase()
  );

  if (isGenderChange) {
    const newSelfie = data.privateCorner?.verificationSelfie?.trim();
    if (!newSelfie) {
      throw new Error(
        "Gender change detected: You must upload a fresh verification selfie so Maya can verify your identity."
      );
    }
    if (!data.privateCorner) {
      data.privateCorner = {};
    }
    data.privateCorner.verificationStatus = "pending_review";
    data.privateCorner.genderChangedAt = new Date().toISOString();
    data.privateCorner.previousGender = oldGender;
  }

  const interestsVal = Array.isArray(data.interests) ? data.interests : [];
  const promptAnswersVal = JSON.stringify(data.promptAnswers || {});
  const speedRoundVal = JSON.stringify(data.speedRound || {});
  const privateCornerVal = JSON.stringify(data.privateCorner || {});
  const dealbreakersVal = JSON.stringify(data.dealbreakers || {});
  const additionalPhotosVal = Array.isArray(data.additionalPhotos)
    ? data.additionalPhotos
    : [];

  try {
    const result = await sql`
      INSERT INTO public.user_profiles (
        user_id,
        onboarding_completed,
        first_name,
        birthdate,
        age,
        gender,
        interested_in,
        location,
        relationship_intent,
        dal_bhat_frequency,
        music_repeat,
        green_flag,
        occupation,
        bio,
        height,
        education,
        interests,
        prompt_answers,
        speed_round,
        private_corner,
        dealbreakers,
        profile_photo,
        additional_photos,
        updated_at
      ) VALUES (
        ${userId},
        true,
        ${data.firstName},
        ${birthdateVal},
        ${ageVal},
        ${data.gender || null},
        ${data.interestedIn || null},
        ${data.location || null},
        ${data.relationshipIntent || null},
        ${data.dalBhatFrequency || null},
        ${data.musicRepeat || null},
        ${data.greenFlag || null},
        ${data.occupation || null},
        ${data.bio || null},
        ${data.height || null},
        ${data.education || null},
        ${interestsVal},
        ${promptAnswersVal}::jsonb,
        ${speedRoundVal}::jsonb,
        ${privateCornerVal}::jsonb,
        ${dealbreakersVal}::jsonb,
        ${data.profilePhoto || null},
        ${additionalPhotosVal},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        onboarding_completed = true,
        first_name = EXCLUDED.first_name,
        birthdate = EXCLUDED.birthdate,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        interested_in = EXCLUDED.interested_in,
        location = EXCLUDED.location,
        relationship_intent = EXCLUDED.relationship_intent,
        dal_bhat_frequency = EXCLUDED.dal_bhat_frequency,
        music_repeat = EXCLUDED.music_repeat,
        green_flag = EXCLUDED.green_flag,
        occupation = EXCLUDED.occupation,
        bio = EXCLUDED.bio,
        height = EXCLUDED.height,
        education = EXCLUDED.education,
        interests = EXCLUDED.interests,
        prompt_answers = EXCLUDED.prompt_answers,
        speed_round = EXCLUDED.speed_round,
        private_corner = EXCLUDED.private_corner,
        dealbreakers = EXCLUDED.dealbreakers,
        profile_photo = EXCLUDED.profile_photo,
        additional_photos = EXCLUDED.additional_photos,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    // Also update neon_auth."user" name & image for seamless auth synchronization
    if (data.firstName) {
      try {
        await sql`
          UPDATE neon_auth."user"
          SET 
            name = ${data.firstName},
            image = ${data.profilePhoto || null},
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${userId}
        `;
      } catch (authUpdateErr) {
        console.warn("Failed to sync name to neon_auth.user:", authUpdateErr);
      }
    }

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
      profile: result[0],
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

    const sql = getDb();
    const rows = await sql`
      SELECT 
        p.*,
        u.email,
        u.name AS auth_name,
        u.image AS auth_image,
        u.role AS auth_role,
        u."emailVerified" AS auth_email_verified,
        u.banned AS auth_banned
      FROM public.user_profiles p
      JOIN neon_auth."user" u ON p.user_id = u.id
      WHERE p.user_id = ${targetUserId}::uuid
      LIMIT 1
    `;

    if (rows.length === 0) return null;
    const row = { ...rows[0] };
    if (row.birthdate) {
      row.birthdate = formatBirthdateToISO(row.birthdate);
    }
    if (row.created_at && row.created_at instanceof Date) {
      row.created_at = row.created_at.toISOString();
    }
    if (row.updated_at && row.updated_at instanceof Date) {
      row.updated_at = row.updated_at.toISOString();
    }
    return row;
  } catch (err) {
    console.error("Error in getFullUserProfile:", err);
    return null;
  }
}
