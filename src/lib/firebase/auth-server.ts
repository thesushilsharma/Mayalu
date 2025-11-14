"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export async function createSessionCookie(idToken: string) {
  try {
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days

    // Create the session cookie
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating session cookie:", error)
    return { success: false, error: "Failed to create session" }
  }
}

export async function removeSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return null
    }

    // Verify the session cookie
    const decodedClaims = await admin.auth().verifySessionCookie(session.value, true)
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified,
    }
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

export async function getUserProfile(uid: string) {
  try {
    const userRecord = await admin.auth().getUser(uid)
    
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      phoneNumber: userRecord.phoneNumber,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        lastRefreshTime: userRecord.metadata.lastRefreshTime,
      },
      providerData: userRecord.providerData,
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
