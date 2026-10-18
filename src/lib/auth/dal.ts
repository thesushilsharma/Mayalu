import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import {
  findAuthUserById,
  promoteAuthUserToAdmin,
} from "@/lib/neonDB/queries";

export type UserRole = "admin" | "moderator" | "user";

export interface SessionUserDTO {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: boolean;
  banned: boolean;
}

export interface AuthSessionDTO {
  isAuth: boolean;
  user: SessionUserDTO | null;
  role: UserRole;
}

/**
 * Parses configured admin emails from environment variables and built-in defaults.
 */
function getAdminEmails(): string[] {
  const envEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // Default initial team / admin email for developer and administrator
  const defaultAdmins = ["sushilsharma@duck.com"];

  return Array.from(new Set([...envEmails, ...defaultAdmins]));
}

/**
 * Next.js Data Access Layer (DAL) Session Verifier
 * Memoized using React.cache() to deduplicate requests across a single server render pass.
 */
export const verifySession = cache(async (): Promise<AuthSessionDTO> => {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return { isAuth: false, user: null, role: "user" };
    }

    const dbUser = await findAuthUserById(session.user.id);

    const email = (dbUser?.email || session.user.email || "").toLowerCase();
    const adminEmails = getAdminEmails();

    // Check if user has explicit 'admin' role in DB or is in the admin email list
    const isExplicitAdmin =
      dbUser?.role === "admin" || adminEmails.includes(email);

    // If email is in admin list but DB role is not updated, auto-sync DB role to admin
    if (isExplicitAdmin && dbUser?.role !== "admin") {
      try {
        await promoteAuthUserToAdmin(session.user.id);
      } catch (e) {
        console.warn("Could not auto-promote admin in neon_auth:", e);
      }
    }

    const role: UserRole = isExplicitAdmin
      ? "admin"
      : dbUser?.role === "moderator"
      ? "moderator"
      : "user";

    return {
      isAuth: true,
      role,
      user: {
        id: session.user.id,
        email,
        name: dbUser?.name || session.user.name || null,
        image: dbUser?.image || session.user.image || null,
        role,
        emailVerified: Boolean(dbUser?.emailVerified),
        banned: Boolean(dbUser?.banned),
      },
    };
  } catch (error) {
    console.error("verifySession DAL error:", error);
    return { isAuth: false, user: null, role: "user" };
  }
});

/**
 * DAL Guard: Requires the user to have an active authenticated session.
 * Redirects to /auth/login if unauthenticated.
 */
export async function requireAuth(): Promise<SessionUserDTO> {
  const { isAuth, user } = await verifySession();
  if (!isAuth || !user) {
    redirect("/auth/login");
  }
  return user;
}

/**
 * DAL Guard: Requires the user to hold the 'admin' role.
 * Redirects to /account/dashboard if not an admin.
 */
export async function requireAdmin(): Promise<SessionUserDTO> {
  const { isAuth, user, role } = await verifySession();
  if (!isAuth || !user) {
    redirect("/auth/login");
  }
  if (role !== "admin") {
    redirect("/account/dashboard");
  }
  return user;
}

/**
 * Helper to check whether the current session user has admin rights.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { isAuth, role } = await verifySession();
  return isAuth && role === "admin";
}
