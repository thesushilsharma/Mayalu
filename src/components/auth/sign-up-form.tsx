"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff, Mail } from "lucide-react"
import Link from "next/link"
import { validatePasswordStrength } from "@/lib/validations/authHelper"
import { authClient } from "@/lib/auth/client"

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.givenName} ${formData.familyName}`.trim(),
      })

      if (error) {
        toast.error(error.message || "Failed to create account")
        setIsSubmitting(false)
        return
      }

      toast.success("Account created successfully!")
      setIsSuccess(true)
      setIsSubmitting(false)
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className={cn("max-w-md mx-auto", className)} {...props}>
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
          <Button className="w-full" onClick={() => router.push("/auth/login")}>
            Continue to sign in
          </Button>
        </CardContent>
      </Card>
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
          <form onSubmit={handleSubmit}>
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
                    />
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
                    />
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
                  />
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
                            : "border-red-500 focus-visible:ring-red-500")
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Password must:</div>
                      <ul className="space-y-1 text-sm">
                        {/* Password rules matching checks */}
                        <li className={cn("flex items-center gap-2", passwordValidation.results.minLength ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.minLength ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Be at least 12 characters
                        </li>
                        <li className={cn("flex items-center gap-2", passwordValidation.results.hasUppercase ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.hasUppercase ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Include at least one uppercase letter
                        </li>
                        <li className={cn("flex items-center gap-2", passwordValidation.results.hasLowercase ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.hasLowercase ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Include at least one lowercase letter
                        </li>
                        <li className={cn("flex items-center gap-2", passwordValidation.results.hasNumber ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.hasNumber ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Include at least one number
                        </li>
                        <li className={cn("flex items-center gap-2", passwordValidation.results.hasSpecialChar ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.hasSpecialChar ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Include at least one special character
                        </li>
                      </ul>
                    </div>
                  )}
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
                            : "border-red-500 focus-visible:ring-red-500")
                      )}
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center">
                      {formData.confirmPassword && (
                        <div className="px-2">
                          {passwordsMatch ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {formData.confirmPassword && !passwordsMatch && (
                    <div className="mt-2 text-sm text-red-500">
                      Passwords need to match
                    </div>
                  )}
                </FieldContent>
              </Field>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !passwordValidation.isValid || !passwordsMatch}
              >
                {isSubmitting ? (
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