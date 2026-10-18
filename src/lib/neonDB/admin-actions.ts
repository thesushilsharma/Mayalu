"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, type UserRole } from "@/lib/auth/dal";
import {
  findVerificationCandidates,
  approveVerificationSelfieQuery,
  rejectVerificationSelfieQuery,
  updateAuthUserRoleQuery,
  toggleUserBanAndRevokeSessionsTx,
} from "@/lib/neonDB/queries";

export interface VerificationCandidate {
  userId: string;
  name: string;
  email: string;
  age: number | null;
  location: string | null;
  gender: string | null;
  profilePhoto: string | null;
  verificationSelfie: string | null;
  verificationStatus: "pending_review" | "verified" | "rejected" | "unsubmitted";
  additionalPhotosCount: number;
  bio: string | null;
  updatedAt: string | null;
}

/**
 * Fetch all candidate profiles that have submitted or attempted verification.
 * Protected by Next.js RBAC DAL (requireAdmin).
 */
export async function getVerificationCandidates(): Promise<VerificationCandidate[]> {
  await requireAdmin();

  try {
    const rows = await findVerificationCandidates(100);

    return rows.map((r) => ({
      userId: r.user_id,
      name: r.name,
      email: r.email,
      age: r.age,
      location: r.location,
      gender: r.gender,
      profilePhoto: r.profile_photo,
      verificationSelfie: r.verification_selfie || null,
      verificationStatus: (r.verification_status as any) || "unsubmitted",
      additionalPhotosCount: Number(r.additional_photos_count || 0),
      bio: r.bio,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching verification candidates:", error);
    return [];
  }
}

/**
 * Admin Action: Approve verification selfie.
 * Lifts user out of Ghost Spectator mode into Maya Verified.
 */
export async function approveVerification(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    await approveVerificationSelfieQuery(userId);

    revalidatePath("/account/users");
    revalidatePath("/account/dashboard");
    revalidatePath("/account/hallway");
    return { success: true };
  } catch (error) {
    console.error("Error approving verification:", error);
    return { success: false, error: "Failed to approve verification selfie" };
  }
}

/**
 * Admin Action: Reject verification selfie and request retake.
 */
export async function rejectVerification(
  userId: string,
  _reason = "Selfie was unclear or did not match avatar"
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    await rejectVerificationSelfieQuery(userId);

    revalidatePath("/account/users");
    revalidatePath("/account/dashboard");
    revalidatePath("/account/hallway");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting verification:", error);
    return { success: false, error: "Failed to reject verification selfie" };
  }
}

/**
 * Admin Action: Update user role (Admin, Moderator, User) in Neon Auth.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  const currentAdmin = await requireAdmin();

  // Guard against admin demoting themselves
  if (currentAdmin.id === userId && newRole !== "admin") {
    return { success: false, error: "You cannot demote yourself from admin." };
  }

  try {
    await updateAuthUserRoleQuery(userId, newRole);

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update role in neon_auth" };
  }
}

/**
 * Admin Action: Ban or Unban user account and atomically revoke active sessions.
 */
export async function toggleUserBan(
  userId: string,
  banned: boolean,
  banReason?: string
): Promise<{ success: boolean; error?: string }> {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId) {
    return { success: false, error: "You cannot ban your own account." };
  }

  try {
    await toggleUserBanAndRevokeSessionsTx(userId, banned, banReason);

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error toggling user ban:", error);
    return { success: false, error: "Failed to update ban status" };
  }
}
