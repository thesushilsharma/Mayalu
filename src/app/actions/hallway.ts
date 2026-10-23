"use server";

import { getSessionUser } from "@/lib/neonDB/auth-server";
import { findHallwayCandidateProfiles, findUserProfileOrAuthFallback } from "@/lib/neonDB/queries";
import { augmentCandidatesWithNeo4j } from "@/lib/neo4j/graph-service";
import type { CandidateProfile } from "@/lib/neonDB/types";

export async function getHallwayCandidatesAction(genderFilter?: string | null): Promise<{
  success: boolean;
  profiles: CandidateProfile[];
  currentUserId: string;
  userGender?: string;
  userInterestedIn?: string;
  activeGenderFilter: string;
  error?: string;
}> {
  try {
    const sessionUser = await getSessionUser();
    const uid = sessionUser?.uid;

    let userGender: string | undefined;
    let userInterestedIn: string | undefined;
    let userInterests: string[] = [];

    if (uid) {
      try {
        const { profile } = await findUserProfileOrAuthFallback(uid);
        if (profile) {
          userGender = (profile as any).gender || undefined;
          userInterestedIn = (profile as any).interestedIn || (profile as any).interested_in || undefined;
          userInterests = Array.isArray(profile.interests) ? profile.interests : [];
        }
      } catch (err) {
        console.warn("Could not fetch user profile preferences for hallway:", err);
      }
    }

    // Determine target gender:
    // If explicitly specified by caller, use that; otherwise default to user's interestedIn, or "All"
    let effectiveGender = genderFilter;
    if (!effectiveGender || effectiveGender === "default") {
      if (userInterestedIn && (userInterestedIn === "Female" || userInterestedIn === "Male")) {
        effectiveGender = userInterestedIn;
      } else {
        effectiveGender = "All";
      }
    }

    const rawCandidates = await findHallwayCandidateProfiles(uid, effectiveGender, 50);

    // Augment with Neo4j Knowledge Graph compatibility & shared topological clusters
    const profiles = await augmentCandidatesWithNeo4j(
      uid || "demo_user_you",
      userInterests,
      rawCandidates
    );

    return {
      success: true,
      profiles,
      currentUserId: uid || "demo_user_you",
      userGender,
      userInterestedIn,
      activeGenderFilter: effectiveGender,
    };
  } catch (err: any) {
    console.error("Error fetching hallway candidates from database:", err);
    return {
      success: false,
      profiles: [],
      currentUserId: "demo_user_you",
      activeGenderFilter: "All",
      error: err?.message || "Failed to fetch candidate profiles",
    };
  }
}
