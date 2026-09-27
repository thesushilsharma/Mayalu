"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"

export async function createSessionCookie(idToken: string) {
  return { success: true }
}

export async function removeSessionCookie() {
  // Better Auth handles this
}

export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null
    return {
      uid: session.user.id,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
    }
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

export async function getUserProfile(uid: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null
    return {
      uid: session.user.id,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      displayName: session.user.name,
      photoURL: session.user.image,
      phoneNumber: null,
      disabled: false,
      metadata: {
        creationTime: session.user.createdAt.toString(),
        lastSignInTime: session.user.updatedAt.toString(),
        lastRefreshTime: null,
      },
      providerData: [] as Array<{
        uid?: string;
        providerId: string;
        email?: string;
      }>,
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getSessionUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  return user
}
