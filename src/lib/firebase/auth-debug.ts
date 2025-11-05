"use client"

import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"

export function debugAuthState() {
  console.log("=== Firebase Auth Debug ===")
  console.log("Current User:", auth.currentUser?.email || "None")
  console.log("Email Verified:", auth.currentUser?.emailVerified || false)
  console.log("User ID:", auth.currentUser?.uid || "None")
  console.log("Auth State:", auth.currentUser ? "Authenticated" : "Not Authenticated")
  
  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    console.log("Auth State Changed:", {
      email: user?.email || "None",
      verified: user?.emailVerified || false,
      uid: user?.uid || "None"
    })
  })
}

export function getAuthInfo() {
  return {
    user: auth.currentUser,
    email: auth.currentUser?.email || null,
    verified: auth.currentUser?.emailVerified || false,
    uid: auth.currentUser?.uid || null,
    isAuthenticated: !!auth.currentUser
  }
}