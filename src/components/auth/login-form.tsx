"use client"

import type React from "react"
import { useActionState, useOptimistic, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [optimisticState, addOptimistic] = useOptimistic(
    { isSubmitting: false },
    (state, newState: { isSubmitting?: boolean }) => ({
      ...state,
      ...newState,
    })
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false)
  const router = useRouter()

  // Handle successful login
  useEffect(() => {
    if (state?.success) {
      if (state.message?.includes("verify your email")) {
        // User logged in but needs email verification
        toast.warning(state.message)
      } else {
        // Normal successful login
        toast.success(state.message || "Login successful!")
        router.push("/account/dashboard")
      }
    }
  }, [state?.success, state?.message, router])

  // Handle form errors
  useEffect(() => {
    if (state?.error?.form) {
      state.error.form.forEach((error) => {
        toast.error(error)
        // Show email verification banner if the error is about email verification
        if (error.includes("verify your email")) {
          setShowEmailVerificationBanner(true)
        }
      })
    }
  }, [state?.error?.form])

  const handleSubmit = async (formData: FormData) => {
    addOptimistic({ isSubmitting: true })
    await formAction(formData)
    addOptimistic({ isSubmitting: false })
  }

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
          
          <form action={handleSubmit}>
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
                disabled={isPending || optimisticState.isSubmitting}
              >
                {isPending || optimisticState.isSubmitting ? (
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