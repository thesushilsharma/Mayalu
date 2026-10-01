"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";

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

interface NeonAuthUserRow {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  emailVerified: boolean | null;
  role: string | null;
  banned: boolean | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(url);
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

    const sql = getDb();

    // Query Neon Auth managed table in the neon_auth schema
    const users = await sql`
      SELECT 
        id, 
        email, 
        name, 
        image, 
        "emailVerified",
        role,
        banned,
        "createdAt",
        "updatedAt"
      FROM neon_auth."user"
      ORDER BY "createdAt" DESC
      LIMIT ${maxResults}
    `;

    return (users as unknown as NeonAuthUserRow[]).map((u) => ({
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
  disabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const sql = getDb();

    await sql`
      UPDATE neon_auth."user"
      SET banned = ${disabled},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${uid}::uuid
    `;

    // Revoke active sessions if user is disabled/banned
    if (disabled) {
      await sql`DELETE FROM neon_auth."session" WHERE "userId" = ${uid}::uuid`;
    }

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
  uid: string,
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

    const sql = getDb();
    await sql`DELETE FROM neon_auth."user" WHERE id = ${uid}::uuid`;

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
  claims: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const sql = getDb();
    if (typeof claims.role === "string") {
      await sql`
        UPDATE neon_auth."user"
        SET role = ${claims.role},
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${uid}::uuid
      `;
    }

    revalidatePath("/account/users");
    return { success: true };
  } catch (error) {
    console.error("Error setting user role in neon_auth:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
