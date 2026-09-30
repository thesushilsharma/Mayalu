"use server";

import { getSessionUser, requireAuth } from "@/lib/neonDB/auth-server";
import { neon } from "@neondatabase/serverless";

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

    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const users = await sql`
          SELECT 
            id as uid, 
            email, 
            name as "displayName", 
            image as "photoURL"
          FROM "user"
          WHERE id = ${sessionUser.uid}
          LIMIT 1
        `;

        if (users.length > 0 && users[0]) {
          const u = users[0];
          if (u.displayName) displayName = u.displayName;
          if (u.photoURL) profileImage = u.photoURL;
        }
      } catch (dbErr) {
        console.error("Error querying user profile from database:", dbErr);
      }
    }

    return {
      name: displayName,
      age: 25,
      location: "Location not set",
      relationshipType: "Dating",
      bio: "Welcome to my profile!",
      profileImage: profileImage || undefined,
      photos: profileImage ? [profileImage] : [],
      height: undefined,
      education: undefined,
      occupation: undefined,
      interests: ["Travel", "Music", "Photography"],
      preferences: {
        interestedIn: "Everyone",
        ageRange: "20-30",
        distance: "25 miles",
      },
      badges: [
        { name: "Early Adopter", description: "Joined during beta" },
        { name: "Profile Complete", description: "Filled in basic info" }
      ],
      xpHistory: [
        { activity: "Completed Profile", xp: 50, date: "Today" },
        { activity: "Daily Login", xp: 10, date: "Today" }
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

export async function updateProfileAction(prevState: any, formData: FormData) {
  return { success: true };
}

