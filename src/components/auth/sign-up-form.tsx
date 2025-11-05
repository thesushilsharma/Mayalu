"use client"

import type React from "react"
import { useActionState, useOptimistic } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { validatePasswordStrength } from "@/lib/validations/authHelper"
import { signUpAction } from "@/lib/firebase/auth-actions"

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const [optimisticState, addOptimistic] = useOptimistic(
    { isSubmitting: false, success: false },
    (state, newState: { isSubmitting?: boolean; success?: boolean }) => ({
      ...state,
      ...newState,
    })
  )
  const router = useRouter()
  
  const [formData, setFormData] = useState({
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
      toast.success("Account created successfully!")
      // Store email for resend functionality
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
      if (emailInput?.value) {
        sessionStorage.setItem('pendingVerificationEmail', emailInput.value)
      }
      // Redirect to email verification page
      setTimeout(() => {
        router.push("/auth/sign-up-success")
      }, 1000)
    }
  }, [state?.success, state?.message, router])

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
    if (name === "password" || name === "confirmPassword") {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Created</CardTitle>
            <CardDescription>Your account has been successfully created.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p>Account created successfully!</p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="underline underline-offset-4">
                Go to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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