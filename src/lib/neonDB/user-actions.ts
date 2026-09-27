"use server";

import { neon } from "@neondatabase/serverless";

export interface User {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
  customClaims?: Record<string, unknown>;
}

export async function getAllUsers(maxResults = 1000): Promise<User[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if user table exists by querying the schema
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user'`;
    if (tables.length === 0) {
      return []; // Return empty if table doesn't exist yet
    }

    // Query Neon Postgres "user" table (created by Better Auth)
    const users = await sql`
      SELECT 
        id as uid, 
        email, 
        name as "displayName", 
        image as "photoURL", 
        "emailVerified",
        "createdAt" as "creationTime",
        "updatedAt" as "lastSignInTime"
      FROM "user"
      LIMIT ${maxResults}
    `;

    return users.map((user: any) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      disabled: false, // Better Auth doesn't have a default disabled field
      metadata: {
        creationTime: user.creationTime?.toString(),
        lastSignInTime: user.lastSignInTime?.toString(),
      }
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function updateUserStatus(uid: string, disabled: boolean): Promise<{ success: boolean; error?: string }> {
  // Mock as Better Auth doesn't natively handle disable without custom plugins/fields
  return { success: true };
}

export async function deleteUser(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM "user" WHERE id = ${uid}`;
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function setUserClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  // Implement custom claims if you extend the Neon schema later
  return { success: true };
}
