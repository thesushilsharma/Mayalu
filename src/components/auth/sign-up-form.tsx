"use client"

import type React from "react"
import { useActionState, useOptimistic } from "react"
import { useState, useEffect } from "react"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff, Mail, RefreshCw, User } from "lucide-react"
import Link from "next/link"
import { validatePasswordStrength } from "@/lib/validations/authHelper"
import { signUpAction } from "@/lib/firebase/auth-actions"
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSuccess?: (userData: { email: string; password: string; givenName: string; familyName: string }) => void
  onFormData?: (formData: FormData) => { email: string; password: string; givenName: string; familyName: string }
}

export function SignUpForm({ className, onSuccess, onFormData, ...props }: SignUpFormProps) {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const [optimisticState, addOptimistic] = useOptimistic(
    { isSubmitting: false, success: false },
    (state, newState: { isSubmitting?: boolean; success?: boolean }) => ({
      ...state,
      ...newState,
    })
  )

  
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    results: {
      minLength: false,
      maxLength: true,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  })

  const [passwordsMatch, setPasswordsMatch] = useState(false)

  // Handle successful signup
  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        // If callback provided, use it instead of default behavior
        const userData = {
          email: formData.email || "",
          password: formData.password || "",
          givenName: formData.givenName || "",
          familyName: formData.familyName || ""
        }
        onSuccess(userData)
      } else {
        // Default behavior
        toast.success("Account created successfully!")
        // Store email for resend functionality
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
        if (emailInput?.value) {
          sessionStorage.setItem('pendingVerificationEmail', emailInput.value)
        }
        //show msg to check email or resend email (sendEmailVerification)
      }
    }
  }, [state?.success, onSuccess, formData])

  // Handle form errors
  useEffect(() => {
    if (state?.error?.form) {
      state.error.form.forEach((error) => {
        toast.error(error)
      })
    }
  }, [state?.error?.form])

  // Validate password strength and matching on input change
  useEffect(() => {
    setPasswordValidation(validatePasswordStrength(formData.password))
    setPasswordsMatch(
      formData.password === formData.confirmPassword && formData.password.length > 0
    )
  }, [formData.password, formData.confirmPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (formData: FormData) => {
    addOptimistic({ isSubmitting: true })
    await formAction(formData)
    addOptimistic({ isSubmitting: false, success: true })
  }

  const givenNameErrors = state?.error?.givenName
  const familyNameErrors = state?.error?.familyName
  const emailErrors = state?.error?.email
  const passwordErrors = state?.error?.password
  const confirmPasswordErrors = state?.error?.confirmPassword
  const formError = state?.error?.form

  if (state?.success || optimisticState.success) {
    return <SignUpSuccessState formData={formData} className={className} {...props} />
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="givenName">First name</FieldLabel>
                    <Input
                      id="givenName"
                      name="givenName"
                      placeholder="John"
                      required
                      autoComplete="given-name"
                      value={formData.givenName}
                      onChange={handleInputChange}
                      aria-invalid={!!givenNameErrors}
                      className={cn(givenNameErrors && "border-destructive focus-visible:ring-destructive")}
                    />
                    <FieldError errors={givenNameErrors?.map(error => ({ message: error }))} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="familyName">Last name</FieldLabel>
                    <Input
                      id="familyName"
                      name="familyName"
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                      value={formData.familyName}
                      onChange={handleInputChange}
                      aria-invalid={!!familyNameErrors}
                      className={cn(familyNameErrors && "border-destructive focus-visible:ring-destructive")}
                    />
                    <FieldError errors={familyNameErrors?.map(error => ({ message: error }))} />
                  </FieldContent>
                </Field>
              </div>

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
                    value={formData.email}
                    onChange={handleInputChange}
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
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "pr-10",
                        formData.password &&
                          (passwordValidation.isValid
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-red-500 focus-visible:ring-red-500"),
                        passwordErrors && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!passwordErrors}
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
                  
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Password must:</div>
                      <ul className="space-y-1 text-sm">
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.minLength ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.minLength ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Be at least 12 characters
                        </li>
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.maxLength ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.maxLength ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Be at most 64 characters
                        </li>
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.hasUppercase ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.hasUppercase ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Include at least one uppercase letter
                        </li>
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.hasLowercase ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.hasLowercase ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Include at least one lowercase letter
                        </li>
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.hasNumber ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.hasNumber ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Include at least one number
                        </li>
                        <li
                          className={cn(
                            "flex items-center gap-2",
                            passwordValidation.results.hasSpecialChar ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {passwordValidation.results.hasSpecialChar ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Include at least one special character (!@#$%^&*())
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  <FieldError errors={passwordErrors?.map(error => ({ message: error }))} />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        "pr-20",
                        formData.confirmPassword &&
                          (passwordsMatch
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-red-500 focus-visible:ring-red-500"),
                        confirmPasswordErrors && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!confirmPasswordErrors}
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center">
                      {formData.confirmPassword && (
                        <div className="px-2">
                          {passwordsMatch ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {formData.confirmPassword && !passwordsMatch && (
                    <div className="mt-2 text-sm text-red-500">
                      Passwords need to match
                    </div>
                  )}
                  
                  <FieldError errors={confirmPasswordErrors?.map(error => ({ message: error }))} />
                </FieldContent>
              </Field>

              {formError && (
                <FieldError errors={formError.map(error => ({ message: error }))} />
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isPending || optimisticState.isSubmitting || !passwordValidation.isValid || !passwordsMatch}
              >
                {isPending || optimisticState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/auth/login" 
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Success state component with email verification functionality
function SignUpSuccessState({ 
  formData, 
  className, 
  ...props 
}: { 
  formData: { givenName: string; familyName: string; email: string; password: string; confirmPassword: string }
  className?: string 
} & React.ComponentPropsWithoutRef<"div">) {
  const [isResending, setIsResending] = useState(false)
  const [authState, setAuthState] = useState<string>("checking")

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAuthState("authenticated")
      } else {
        setAuthState("not-authenticated")
      }
    })

    return () => unsubscribe()
  }, [])

  const handleResendVerification = async () => {
    setIsResending(true)
    
    try {
      // Method 1: Try with current authenticated user
      if (auth.currentUser) {
        await auth.currentUser.reload()
        const currentUser = auth.currentUser
        
        if (currentUser.emailVerified) {
          toast.success("Your email is already verified!")
          return
        }

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL
        
        await sendEmailVerification(currentUser, {
          url: `${baseUrl}/auth/verify-email`,
          handleCodeInApp: false,
        })
        
        toast.success("Verification email sent successfully! Check your inbox.")
        return
      }

      // Method 2: If no authenticated user, try to sign in with form data
      if (formData.email && formData.password) {
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
          
          if (userCredential.user.emailVerified) {
            toast.success("Your email is already verified!")
            return
          }

          const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL
          
          await sendEmailVerification(userCredential.user, {
            url: `${baseUrl}/auth/verify-email`,
            handleCodeInApp: false,
          })
          
          toast.success("Verification email sent successfully! Check your inbox.")
          return
        } catch (signInError: any) {
          console.error("Sign-in for resend failed:", signInError)
          toast.error("Failed to resend verification email. Please try signing in manually.")
        }
      }

      toast.error("Unable to resend verification email. Please try signing in.")
      
    } catch (error: any) {
      console.error("Resend verification error:", error)
      
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait a few minutes before trying again.")
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your connection and try again.")
      } else {
        toast.error("Failed to resend verification email. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to {formData.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success message */}
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Account created successfully!
                </p>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
            </div>
          </div>

          {/* Account details */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Account Details
              </p>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Name:</strong> {formData.givenName} {formData.familyName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Status:</strong> {authState === "authenticated" ? "Signed in - Verification pending" : "Account created - Please verify email"}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-2">📧 What to do next:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Check your email inbox for a verification message</li>
                <li>Click the verification link in the email</li>
                <li>Return here and sign in to your account</li>
              </ol>
              <p className="mt-2 text-xs">
                Don&apos;t see the email? Check your spam folder or click resend below.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending verification email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>

            <div className="flex gap-3">
              <Button asChild variant="default" className="flex-1">
                <Link href="/auth/login">
                  Continue to sign in
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/auth/sign-up">
                  Create another account
                </Link>
              </Button>
            </div>
          </div>

          {/* Help text */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Having trouble? Contact{" "}
              <a href="mailto:support@example.com" className="underline hover:text-primary">
                support
              </a>{" "}
              for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}