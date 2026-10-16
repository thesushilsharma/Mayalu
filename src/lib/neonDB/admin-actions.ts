"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { requireAdmin, type UserRole } from "@/lib/auth/dal";

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

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(url);
}

/**
 * Fetch all candidate profiles that have submitted or attempted verification.
 * Protected by Next.js RBAC DAL (requireAdmin).
 */
export async function getVerificationCandidates(): Promise<VerificationCandidate[]> {
  await requireAdmin();
  const sql = getDb();

  try {
    const rows = await sql`
      SELECT 
        u.id AS user_id,
        COALESCE(p.first_name, u.name, 'Candidate') AS name,
        COALESCE(u.email, 'unknown@mayalu.app') AS email,
        p.age,
        p.location,
        p.gender,
        p.profile_photo,
        p.private_corner->>'verificationSelfie' AS verification_selfie,
        COALESCE(p.private_corner->>'verificationStatus', 'unsubmitted') AS verification_status,
        COALESCE(array_length(p.additional_photos, 1), 0) AS additional_photos_count,
        p.bio,
        p.updated_at
      FROM public.user_profiles p
      JOIN neon_auth."user" u ON p.user_id = u.id
      ORDER BY 
        CASE 
          WHEN p.private_corner->>'verificationStatus' = 'pending_review' THEN 1
          WHEN p.private_corner->>'verificationSelfie' IS NOT NULL THEN 2
          ELSE 3
        END,
        p.updated_at DESC
      LIMIT 100
    `;

    return rows.map((r: any) => ({
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
export async function approveVerification(userId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const sql = getDb();

  try {
    await sql`
      UPDATE public.user_profiles
      SET 
        private_corner = jsonb_set(
          COALESCE(private_corner, '{}'::jsonb), 
          '{verificationStatus}', 
          '"verified"'
        ),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}::uuid
    `;

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
  reason = "Selfie was unclear or did not match avatar",
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const sql = getDb();

  try {
    await sql`
      UPDATE public.user_profiles
      SET 
        private_corner = jsonb_set(
          jsonb_set(
            COALESCE(private_corner, '{}'::jsonb), 
            '{verificationStatus}', 
            '"rejected"'
          ),
          '{verificationSelfie}',
          '""'
        ),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}::uuid
    `;

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
  newRole: UserRole,
): Promise<{ success: boolean; error?: string }> {
  const currentAdmin = await requireAdmin();

  // Guard against admin demoting themselves
  if (currentAdmin.id === userId && newRole !== "admin") {
    return { success: false, error: "You cannot demote yourself from admin." };
  }

  const sql = getDb();

  try {
    await sql`
      UPDATE neon_auth."user"
      SET role = ${newRole}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${userId}::uuid
    `;

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update role in neon_auth" };
  }
}

/**
 * Admin Action: Ban or Unban user account and revoke active sessions.
 */
export async function toggleUserBan(
  userId: string,
  banned: boolean,
  banReason?: string,
): Promise<{ success: boolean; error?: string }> {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId) {
    return { success: false, error: "You cannot ban your own account." };
  }

  const sql = getDb();

  try {
    await sql`
      UPDATE neon_auth."user"
      SET 
        banned = ${banned},
        "banReason" = ${banReason || (banned ? "Violation of community standards" : null)},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${userId}::uuid
    `;

    // Invalidate sessions immediately if banned
    if (banned) {
      await sql`DELETE FROM neon_auth."session" WHERE "userId" = ${userId}::uuid`;
    }

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error toggling user ban:", error);
    return { success: false, error: "Failed to update ban status" };
  }
}
