"use server";

// Notice the import path is different from the client
import {
  createServerValidate,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { onboardingFormOpts } from "@/lib/onboarding-form";

// Type for the form values based on defaultValues
type OnboardingFormValues = {
  birthdate: string;
  gender: "male" | "female" | "non-binary" | "other" | "";
  location: string;
  bio: string;
  height: string;
  education: string;
  occupation: string;
  interestedIn: "men" | "women" | "everyone" | "";
  ageRangeMin: string;
  ageRangeMax: string;
  relationshipType: "dating" | "matrimonial";
  distanceRange: string;
  interests: string[];
  profilePhoto: string;
  additionalPhotos: string[];
};

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
  ...onboardingFormOpts,
  onServerValidate: ({ value }: { value: OnboardingFormValues }) => {
    // Validate birthdate (must be at least 18 years old)
    if (value.birthdate) {
      const birthDate = new Date(value.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        age < 18 ||
        (age === 18 && monthDiff < 0) ||
        (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return "You must be at least 18 years old to sign up";
      }
    }

    // Validate interests
    if (value.interests && value.interests.length < 3) {
      return "Please select at least 3 interests";
    }

    // Validate age range
    if (value.ageRangeMin && value.ageRangeMax) {
      const minAge = Number.parseInt(value.ageRangeMin);
      const maxAge = Number.parseInt(value.ageRangeMax);

      if (minAge >= maxAge) {
        return "Maximum age must be greater than minimum age";
      }
    }
  },
});

import {
  getUserOnboardingStatus as dbGetUserOnboardingStatus,
  saveOnboardingProfile as dbSaveOnboardingProfile,
  syncUserOnboardingStatus as dbSyncUserOnboardingStatus,
  type OnboardingData,
} from "@/lib/neonDB/onboarding-actions";

export type { OnboardingData };

export async function getUserOnboardingStatus(userId?: string) {
  return dbGetUserOnboardingStatus(userId);
}

export async function saveOnboardingProfile(data: OnboardingData) {
  return dbSaveOnboardingProfile(data);
}

export async function syncUserOnboardingStatus() {
  return dbSyncUserOnboardingStatus();
}

export async function submitOnboarding(_prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData);

    // Calculate approximate age if birthdate is present
    let calculatedAge: number | undefined;
    if (validatedData.birthdate) {
      const birthDate = new Date(validatedData.birthdate);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDate.getFullYear();
    }

    // Persist to Neon Postgres user_profiles table
    await saveOnboardingProfile({
      firstName: "",
      birthdate: validatedData.birthdate,
      age: calculatedAge,
      gender: validatedData.gender,
      interestedIn: validatedData.interestedIn,
      location: validatedData.location,
      relationshipIntent:
        validatedData.relationshipType === "matrimonial"
          ? "Marriage / Settle down"
          : "Dating with intent",
      bio: validatedData.bio,
      height: validatedData.height,
      education: validatedData.education,
      occupation: validatedData.occupation,
      interests: validatedData.interests,
      profilePhoto: validatedData.profilePhoto,
      additionalPhotos: validatedData.additionalPhotos,
      dealbreakers: {
        ageRangeMin: Number(validatedData.ageRangeMin) || 18,
        ageRangeMax: Number(validatedData.ageRangeMax) || 50,
        distance: validatedData.distanceRange,
      },
    });

    // Return the form state for successful submission
    return {
      values: validatedData,
      errors: [],
      errorMap: {},
    };
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    // Some other error occurred while validating your form
    throw e;
  }
}
