"use server";

import { getSessionUser } from "@/lib/neonDB/auth-server";
import { findHallwayCandidateProfiles } from "@/lib/neonDB/queries";
import type { Profile } from "@/components/tinder-swipe-deck";

export async function getHallwayCandidatesAction(): Promise<{
  success: boolean;
  profiles: Profile[];
  currentUserId: string;
  error?: string;
}> {
  try {
    const sessionUser = await getSessionUser();
    const candidateRows = await findHallwayCandidateProfiles(sessionUser?.uid, 50);

    return {
      success: true,
      profiles: candidateRows as Profile[],
      currentUserId: sessionUser?.uid || "demo_user_you",
    };
  } catch (err: any) {
    console.error("Error fetching hallway candidates from database:", err);
    return {
      success: false,
      profiles: [],
      currentUserId: "demo_user_you",
      error: err?.message || "Failed to fetch candidate profiles",
    };
  }
}
