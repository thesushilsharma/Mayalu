"use server";

import { getSessionUser, requireAuth } from "@/lib/neonDB/auth-server";
import { findUserProfileOrAuthFallback } from "@/lib/neonDB/queries";

export interface UserProfile {
  // Basic Info
  name: string;
  age: number;
  location: string;
  relationshipType: "Dating" | "Matrimonial" | string;
  bio?: string;
  profileImage?: string;
  photos?: string[];

  // Additional Info
  height?: string;
  education?: string;
  occupation?: string;
  interests?: string[];

  // Preferences
  preferences?: {
    interestedIn?: string;
    ageRange?: string;
    distance?: string;
  };

  // Achievements
  badges?: Array<{
    name: string;
    description?: string;
  }>;

  // XP History
  xpHistory?: Array<{
    activity: string;
    xp: number;
    date: string;
  }>;
}

export async function getUserProfileData(): Promise<UserProfile | null> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return null;
    }

    let displayName = sessionUser.email?.split("@")[0] || "User";
    let profileImage = "";
    let age = 25;
    let location = "Location not set";
    let relationshipType = "Dating";
    let bio = "Welcome to my profile!";
    let height: string | undefined;
    let education: string | undefined;
    let occupation: string | undefined;
    let interests = ["Travel", "Music", "Photography"];
    let interestedIn = "Everyone";

    try {
      const { profile, authUser } = await findUserProfileOrAuthFallback(sessionUser.uid);

      if (profile) {
        const p: any = profile;
        displayName = p.first_name || p.auth_name || displayName;
        profileImage = p.profile_photo || p.auth_image || "";
        age = p.age || age;
        location = p.location || location;
        relationshipType = p.relationship_intent || relationshipType;
        bio = p.bio || bio;
        height = p.height || undefined;
        education = p.education || undefined;
        occupation = p.occupation || undefined;
        if (Array.isArray(p.interests) && p.interests.length > 0) {
          interests = p.interests;
        }
        if (p.interested_in) {
          interestedIn = p.interested_in;
        }
      } else if (authUser) {
        if (authUser.name) displayName = authUser.name;
        if (authUser.image) profileImage = authUser.image;
      }
    } catch (dbErr) {
      console.error("Error querying user profile from database:", dbErr);
    }

    return {
      name: displayName,
      age,
      location,
      relationshipType,
      bio,
      profileImage: profileImage || undefined,
      photos: profileImage ? [profileImage] : [],
      height,
      education,
      occupation,
      interests,
      preferences: {
        interestedIn,
        ageRange: "20-35",
        distance: "50 km",
      },
      badges: [
        {
          name: "Kura-Kani Verified",
          description: "Completed Mayalu Onboarding",
        },
        { name: "Early Pioneer", description: "Joined the community" },
      ],
      xpHistory: [
        { activity: "Completed Onboarding Kura-Kani", xp: 100, date: "Today" },
        { activity: "Daily Active", xp: 10, date: "Today" },
      ],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    await requireAuth();
    return await getUserProfileData();
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
}

export async function updateProfileAction(_prevState: any, _formData: FormData) {
  return { success: true };
}
