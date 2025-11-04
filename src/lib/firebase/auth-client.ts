"use client"

import { signOut } from "firebase/auth"
import { auth } from "./firebase"

export async function logout() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout" }
  }
}

export { auth }