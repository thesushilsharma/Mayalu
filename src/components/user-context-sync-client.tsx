"use client";

import { useEffect } from "react";
import { useUser } from "@/contexts/userContext";

interface UserContextSyncClientProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  profile: Record<string, unknown> | null;
  role?: string;
}

/**
 * Client component rendered by UserSessionSync to update the shared UserContext
 * once dynamic session/profile data streams in from the server.
 */
export function UserContextSyncClient({
  user,
  profile,
  role,
}: UserContextSyncClientProps) {
  const { updateUserProfile } = useUser();

  useEffect(() => {
    if (!user && !profile) return;

    const privateCorner = (profile?.private_corner as
      | Record<string, unknown>
      | undefined) || {};

    const verificationStatus =
      (privateCorner.verificationStatus as string) ||
      (privateCorner.verificationSelfie ? "pending_review" : "unsubmitted");

    updateUserProfile({
      id: user.id || (profile?.user_id as string) || "",
      email: user.email || (profile?.email as string) || "",
      name: user.name || (profile?.auth_name as string) || null,
      image: user.image || (profile?.auth_image as string) || null,
      role: role || (profile?.auth_role as string) || user.role || "user",
      firstName:
        (profile?.first_name as string) ||
        user.name?.split(" ")[0] ||
        (user.email ? user.email.split("@")[0] : null),
      profilePhoto:
        (profile?.profile_photo as string) ||
        user.image ||
        (profile?.auth_image as string) ||
        null,
      age: (profile?.age as number) || null,
      location: (profile?.location as string) || null,
      occupation: (profile?.occupation as string) || null,
      gender: (profile?.gender as string) || null,
      relationshipIntent: (profile?.relationship_intent as string) || null,
      verificationStatus,
      onboardingCompleted: Boolean(profile?.onboarding_completed),
    });
  }, [user, profile, role, updateUserProfile]);

  return null;
}
