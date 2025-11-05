"use client"

import { sendEmailVerification, User } from "firebase/auth"
import { auth } from "./firebase"

export async function sendVerificationEmail(user?: User) {
  const currentUser = user || auth.currentUser
  
  if (!currentUser) {
    throw new Error("No user is currently signed in")
  }

  if (currentUser.emailVerified) {
    throw new Error("Email is already verified")
  }

  await sendEmailVerification(currentUser, {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    handleCodeInApp: false,
  })
}

export function checkEmailVerified(): boolean {
  return auth.currentUser?.emailVerified ?? false
}

export async function reloadUser(): Promise<void> {
  if (auth.currentUser) {
    await auth.currentUser.reload()
  }
}