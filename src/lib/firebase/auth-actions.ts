"use server"

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User
} from "firebase/auth"
import { auth } from "./firebase"
import { 
  loginSchema, 
  signUpSchema, 
  forgotPasswordSchema, 
  updatePasswordSchema,
  changePasswordSchema,
  type LoginFormValues,
  type SignUpFormValues,
  type ForgotPasswordFormValues,
  type UpdatePasswordFormValues,
  type ChangePasswordFormValues
} from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export type ActionState = {
  error?: {
    [key: string]: string[]
    form?: string
  }
  success?: boolean
  message?: string
}

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const validatedData = loginSchema.parse(rawData)
    
    await signInWithEmailAndPassword(auth, validatedData.email, validatedData.password)
    
    return { success: true, message: "Login successful" }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    // Firebase auth errors
    let errorMessage = "Login failed"
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      errorMessage = "Invalid email or password"
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later."
    }

    return {
      error: {
        form: errorMessage,
      },
    }
  }
}

export async function signUpAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      givenName: formData.get("givenName") as string,
      familyName: formData.get("familyName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = signUpSchema.parse(rawData)
    
    await createUserWithEmailAndPassword(auth, validatedData.email, validatedData.password)
    
    return { success: true, message: "Account created successfully" }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    // Firebase auth errors
    let errorMessage = "Sign up failed"
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "An account with this email already exists"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
    }

    return {
      error: {
        form: errorMessage,
      },
    }
  }
}

export async function forgotPasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    }

    const validatedData = forgotPasswordSchema.parse(rawData)
    
    await sendPasswordResetEmail(auth, validatedData.email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    })
    
    return { success: true, message: "Password reset email sent" }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    // Firebase auth errors
    let errorMessage = "Failed to send reset email"
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email address"
    }

    return {
      error: {
        form: errorMessage,
      },
    }
  }
}

export async function updatePasswordAction(
  prevState: ActionState | null,
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
          form: "User not authenticated",
        },
      }
    }

    await updatePassword(user, validatedData.password)
    
    return { success: true, message: "Password updated successfully" }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    let errorMessage = "Failed to update password"
    if (error.code === "auth/requires-recent-login") {
      errorMessage = "Please log in again to update your password"
    }

    return {
      error: {
        form: errorMessage,
      },
    }
  }
}

export async function changePasswordAction(
  prevState: ActionState | null,
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
          form: "User not authenticated",
        },
      }
    }

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, validatedData.currentPassword)
    await reauthenticateWithCredential(user, credential)
    
    // Update to new password
    await updatePassword(user, validatedData.newPassword)
    
    return { success: true, message: "Password changed successfully" }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        error: error.flatten().fieldErrors,
      }
    }

    let errorMessage = "Failed to change password"
    if (error.code === "auth/wrong-password") {
      errorMessage = "Current password is incorrect"
    } else if (error.code === "auth/requires-recent-login") {
      errorMessage = "Please log in again to change your password"
    }

    return {
      error: {
        form: errorMessage,
      },
    }
  }
}