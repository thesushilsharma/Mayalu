"use client"

import type React from "react"
import { useActionState, useOptimistic, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { EmailVerificationBanner } from "./email-verification-banner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { loginAction } from "@/lib/firebase/auth-actions"
import { createSessionCookie } from "@/lib/firebase/auth-server"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  // React 19 hooks
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [isPendingTransition, startTransition] = useTransition()
  const [optimisticState, setOptimisticState] = useOptimistic(
    { isSubmitting: false, message: "" },
    (currentState, newState: { isSubmitting?: boolean; message?: string }) => ({
      ...currentState,
      ...newState,
    })
  )
  
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false)
  const router = useRouter()

  // Handle successful validation and perform client-side auth
  useEffect(() => {
    if (state?.success && state?.data) {
      // Start optimistic update
      setOptimisticState({ isSubmitting: true, message: "Signing in..." })
      
      // Perform client-side authentication
      startTransition(async () => {
        try {
          if (!state.data) return
          
          const { email, password } = state.data
          
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          
          // Get ID token
          const idToken = await userCredential.user.getIdToken()
          
          // Create server-side session cookie
          const result = await createSessionCookie(idToken)
          
          if (!result.success) {
            throw new Error("Failed to create session")
          }
          
          // Check if email is verified
          if (!userCredential.user.emailVerified) {
            toast.warning("Please verify your email address to access all features")
            setShowEmailVerificationBanner(true)
          } else {
            toast.success("Login successful!")
          }
          
          // Update optimistic state
          setOptimisticState({ isSubmitting: false, message: "Redirecting..." })
          
          // Redirect to dashboard
          router.push("/account/dashboard")
          router.refresh() // Refresh to update server components with new session
        } catch (error: any) {
          console.error("Login error:", error)
          
          let errorMessage = "An error occurred during login"
          
          switch (error.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
              errorMessage = "Invalid email or password"
              break
            case "auth/too-many-requests":
              errorMessage = "Too many failed attempts. Please try again later"
              break
            case "auth/user-disabled":
              errorMessage = "This account has been disabled"
              break
            case "auth/invalid-email":
              errorMessage = "Invalid email address"
              break
            default:
              errorMessage = error.message || errorMessage
          }
          
          toast.error(errorMessage)
          setOptimisticState({ isSubmitting: false, message: "" })
        }
      })
    }
  }, [state?.success, state?.data, router, setOptimisticState])

  // Handle form errors
  useEffect(() => {
    if (state?.error?.form) {
      state.error.form.forEach((error) => {
        toast.error(error)
      })
    }
  }, [state?.error?.form])

  const isLoading = isPending || isPendingTransition || optimisticState.isSubmitting
  const emailErrors = state?.error?.email
  const passwordErrors = state?.error?.password
  const formError = state?.error?.form

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailVerificationBanner 
            show={showEmailVerificationBanner}
            onClose={() => setShowEmailVerificationBanner(false)}
          />
          
          <form action={formAction}>
            <div className="flex flex-col gap-4">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    aria-invalid={!!emailErrors}
                    className={cn(emailErrors && "border-destructive focus-visible:ring-destructive")}
                  />
                  <FieldError errors={emailErrors?.map(error => ({ message: error }))} />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      aria-invalid={!!passwordErrors}
                      className={cn(
                        "pr-10",
                        passwordErrors && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FieldError errors={passwordErrors?.map(error => ({ message: error }))} />
                </FieldContent>
              </Field>

              {formError && (
                <FieldError errors={formError.map(error => ({ message: error }))} />
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
              >
                Forgot your password?
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/sign-up" 
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}