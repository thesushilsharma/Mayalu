"use server";

import { getSessionUser, requireAuth } from "@/lib/firebase/auth-server";
import * as admin from "firebase-admin";
import "server-only";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export interface UserProfile {
  // Basic Info
  name: string;
  age: number;
  location: string;
  relationshipType: "Dating" | "Matrimonial";
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
    interestedIn: string;
    ageRange: string;
    distance: string;
  };
  
  // Achievements
  badges?: Array<{
    name: string;
    description: string;
  }>;
  
  // XP History
  xpHistory?: Array<{
    activity: string;
    xp: number;
    date: string;
  }>;
}

/**
 * Fetch user profile data from Firestore
 * Falls back to Firebase Auth data if profile doesn't exist in Firestore
 */
export async function getUserProfileData(): Promise<UserProfile | null> {
  try {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
      return null;
    }

    // Try to fetch from Firestore first using Admin SDK
    const db = admin.firestore();
    const profileRef = db.collection("users").doc(sessionUser.uid);
    const profileSnap = await profileRef.get();

    if (profileSnap.exists) {
      const data = profileSnap.data();
      
      // Calculate age from birthdate if available
      let age = data?.age;
      if (data?.birthdate && !age) {
        const birthDate = data.birthdate.toDate ? data.birthdate.toDate() : new Date(data.birthdate);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Format location
      let location = data?.location || "";
      if (data?.locationLat && data?.locationLng) {
        // If you have coordinates, you might want to reverse geocode
        // For now, just use the location string if available
        location = data?.location || "Location not set";
      }

      // Format age range preference
      const ageRange = data?.ageRangeMin && data?.ageRangeMax 
        ? `${data.ageRangeMin}-${data.ageRangeMax}`
        : "Not set";

      // Format interested in
      let interestedIn = "Everyone";
      if (data?.interestedIn === "men") interestedIn = "Men";
      else if (data?.interestedIn === "women") interestedIn = "Women";
      else if (data?.interestedIn === "everyone") interestedIn = "Everyone";

      // Combine photos
      const photos: string[] = [];
      if (data?.profilePhoto) photos.push(data.profilePhoto);
      if (data?.additionalPhotos && Array.isArray(data.additionalPhotos)) {
        photos.push(...data.additionalPhotos);
      }

      return {
        name: data?.givenName && data?.familyName 
          ? `${data.givenName} ${data.familyName}`
          : data?.displayName || data?.name || sessionUser.email?.split("@")[0] || "User",
        age: age || 0,
        location: location,
        relationshipType: data?.relationshipType === "matrimonial" ? "Matrimonial" : "Dating",
        bio: data?.bio || "",
        profileImage: data?.profilePhoto || data?.profileImage || "",
        photos: photos.length > 0 ? photos : undefined,
        height: data?.height || undefined,
        education: data?.education || undefined,
        occupation: data?.occupation || undefined,
        interests: data?.interests && Array.isArray(data.interests) ? data.interests : undefined,
        preferences: {
          interestedIn: interestedIn,
          ageRange: ageRange,
          distance: data?.distanceRange ? `${data.distanceRange} miles` : "Not set",
        },
        badges: data?.badges || [],
        xpHistory: data?.xpHistory || [],
      };
    }

    // Fallback: Return basic profile from Firebase Auth
    // This happens when user hasn't completed onboarding
    return {
      name: sessionUser.email?.split("@")[0] || "User",
      age: 0,
      location: "Location not set",
      relationshipType: "Dating",
      bio: "",
      profileImage: "",
      preferences: {
        interestedIn: "Everyone",
        ageRange: "Not set",
        distance: "Not set",
      },
      badges: [],
      xpHistory: [],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Get current user's profile data (requires authentication)
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    await requireAuth(); // This will redirect if not authenticated
    return await getUserProfileData();
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
}

