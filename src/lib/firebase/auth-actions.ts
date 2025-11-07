"use server"

import { 
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile
} from "firebase/auth"
import { auth } from "./firebase"
import { 
  changePasswordSchema,
  forgotPasswordSchema, 
  loginSchema, 
  signUpSchema, 
  updatePasswordSchema
} from "@/lib/validations/auth"
import { ZodError } from "zod"
import { loginLimiter, signupLimiter, forgotPasswordLimiter, resendVerificationLimiter } from "@/lib/RateLimiter/limiter"

export type ActionState = {
  error?: {
    [key: string]: string[]
  } & {
    form?: string[]
  }
  success?: boolean
  message?: string
  data?: {
    email: string
    password: string
  }
}

type FirebaseAuthError = {
  code: string
  message: string
}

function getAuthErrorMessage(error: FirebaseAuthError): string {
  switch (error.code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password"
    case "auth/email-already-in-use":
      return "An account with this email already exists"
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password"
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later"
    case "auth/user-disabled":
      return "This account has been disabled"
    case "auth/invalid-email":
      return "Invalid email address"
    case "auth/requires-recent-login":
      return "Please log in again to perform this action"
    case "auth/network-request-failed":
      return "Network error. Please check your connection"
    default:
      return error.message || "An unexpected error occurred"
  }
}

export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check rate limit
    if (!(await loginLimiter.removeTokens(1))) {
      return { 
        error: { 
          form: ['Too many login attempts. Please try again later.'] 
        } 
      }
    }

    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const validatedData = loginSchema.parse(rawData)
    
    // Note: This is a server action but Firebase Auth needs to happen on client
    // The client will get the ID token and send it to create a session cookie
    // This action is kept for validation purposes
    
    return { 
      success: true, 
      message: "Validation successful",
      data: validatedData 
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function signUpAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check rate limit
    if (!(await signupLimiter.removeTokens(1))) {
      return { 
        error: { 
          form: ['Too many signup attempts. Please try again later.'] 
        } 
      }
    }

    const rawData = {
      givenName: formData.get("givenName") as string,
      familyName: formData.get("familyName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = signUpSchema.parse(rawData)
    
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      validatedData.email, 
      validatedData.password
    )
    
    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: `${validatedData.givenName} ${validatedData.familyName}`,
      })
      
      // Send email verification but keep user signed in
      // Use the Firebase action handler URL for better compatibility
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      await sendEmailVerification(userCredential.user, {
        url: `${baseUrl}/auth/verify-email`,
        handleCodeInApp: false,
      })
    }
    
    return { success: true, message: "Account created successfully. Please check your email to verify your account." }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function forgotPasswordAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check rate limit
    if (!(await forgotPasswordLimiter.removeTokens(1))) {
      return { 
        error: { 
          form: ['Too many password reset attempts. Please try again later.'] 
        } 
      }
    }

    const rawData = {
      email: formData.get("email") as string,
    }

    const validatedData = forgotPasswordSchema.parse(rawData)
    
    await sendPasswordResetEmail(auth, validatedData.email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    })
    
    return { success: true, message: "Password reset email sent" }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function updatePasswordAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = updatePasswordSchema.parse(rawData)
    
    // This would typically be used with a password reset code
    // For now, we'll assume the user is authenticated
    const user = auth.currentUser
    if (!user) {
      return {
        error: {
          form: ["User not authenticated"],
        },
      }
    }

    await updatePassword(user, validatedData.password)
    
    return { success: true, message: "Password updated successfully" }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function changePasswordAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = changePasswordSchema.parse(rawData)
    
    const user = auth.currentUser
    if (!user || !user.email) {
      return {
        error: {
          form: ["User not authenticated"],
        },
      }
    }

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, validatedData.currentPassword)
    await reauthenticateWithCredential(user, credential)
    
    // Update to new password
    await updatePassword(user, validatedData.newPassword)
    
    return { success: true, message: "Password changed successfully" }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function resendEmailVerificationAction(): Promise<ActionState> {
  try {
    // Check rate limit
    if (!(await resendVerificationLimiter.removeTokens(1))) {
      return { 
        error: { 
          form: ['Too many verification email requests. Please try again later.'] 
        } 
      }
    }

    const user = auth.currentUser
    if (!user) {
      return {
        error: {
          form: ["User not authenticated"],
        },
      }
    }

    if (user.emailVerified) {
      return {
        error: {
          form: ["Email is already verified"],
        },
      }
    }

    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
      handleCodeInApp: false,
    })
    
    return { success: true, message: "Verification email sent successfully" }
  } catch (error: unknown) {
    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}

export async function resendEmailVerificationByEmailAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const email = formData.get("email") as string
    
    if (!email) {
      return {
        error: {
          form: ["Email address is required"],
        },
      }
    }

    // For non-authenticated users, we can't directly resend verification
    // But we can provide helpful guidance and suggest they try signing in
    return { 
      success: true, 
      message: "If an account with this email exists and needs verification, please try signing in. You'll be prompted to verify your email and can resend from there." 
    }
  } catch (error: unknown) {
    const authError = error as FirebaseAuthError
    return {
      error: {
        form: [getAuthErrorMessage(authError)],
      },
    }
  }
}