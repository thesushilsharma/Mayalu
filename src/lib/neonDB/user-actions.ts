"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";
import {
  findAllAuthUsers,
  deleteAuthUserById,
  updateAuthUserRoleQuery,
  toggleUserBanAndRevokeSessionsTx,
} from "@/lib/neonDB/queries";

export interface User {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  emailVerified: boolean;
  role: string;
  disabled: boolean;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
  customClaims?: Record<string, unknown>;
}

/**
 * Fetch all users from Neon Auth (neon_auth."user").
 * Security: Requires an active authenticated session.
 */
export async function getAllUsers(maxResults = 1000): Promise<User[]> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      console.warn("getAllUsers called without authenticated session");
      return [];
    }

    const users = await findAllAuthUsers(maxResults);

    return users.map((u) => ({
      uid: u.id,
      email: u.email || undefined,
      displayName: u.name || undefined,
      photoURL: u.image || undefined,
      emailVerified: Boolean(u.emailVerified),
      role: u.role || "user",
      disabled: Boolean(u.banned),
      metadata: {
        creationTime: u.createdAt
          ? new Date(u.createdAt).toISOString()
          : undefined,
        lastSignInTime: u.updatedAt
          ? new Date(u.updatedAt).toISOString()
          : undefined,
      },
      customClaims: {
        role: u.role || "user",
      },
    }));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest?: string }).digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw error;
    }
    console.error("Error fetching users from neon_auth:", error);
    return [];
  }
}

/**
 * Enable or disable a user account by toggling the banned flag in Neon Auth.
 * Automatically invalidates active sessions if disabled.
 */
export async function updateUserStatus(
  uid: string,
  disabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await toggleUserBanAndRevokeSessionsTx(uid, disabled);

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

/**
 * Permanently delete a user from Neon Auth.
 * Cascades to sessions, accounts, and memberships in neon_auth.
 */
export async function deleteUser(
  uid: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Guard against self-deletion in user management table
    if (session.user.id === uid) {
      return {
        success: false,
        error:
          "You cannot delete your own account from the user management console.",
      };
    }

    await deleteAuthUserById(uid);

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

/**
 * Assign a role to a user in Neon Auth.
 */
export async function setUserClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    if (typeof claims.role === "string") {
      await updateAuthUserRoleQuery(uid, claims.role);
    }

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error setting user claims:", error);
    return { success: false, error: "Failed to set user claims" };
  }
}
