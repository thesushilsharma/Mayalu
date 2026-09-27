"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { validatePasswordStrength } from "@/lib/validations/authHelper"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  
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
      const { data, error } = await authClient.resetPassword({
        newPassword: formData.password,
      })

      if (error) {
        toast.error(error.message || "Failed to reset password")
        setIsSubmitting(false)
        return
      }

      toast.success("Password updated successfully!")
      setIsSuccess(true)
      setIsSubmitting(false)
      
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const isFormValid = passwordValidation.isValid && passwordsMatch

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Password Updated</CardTitle>
            <CardDescription>Your password has been successfully updated.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p>Password updated successfully! Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="New password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      formData.password &&
                        (passwordValidation.isValid
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"),
                    )}
                  />
                  
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Password must:</div>
                      <ul className="space-y-1 text-sm">
                        <li className={cn("flex items-center gap-2", passwordValidation.results.minLength ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.minLength ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Be at least 12 characters
                        </li>
                        <li className={cn("flex items-center gap-2", passwordValidation.results.maxLength ? "text-green-500" : "text-red-500")}>
                          {passwordValidation.results.maxLength ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Be at most 64 characters
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
                  <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        formData.confirmPassword &&
                          (passwordsMatch
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-red-500 focus-visible:ring-red-500"),
                      )}
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
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
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save new password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
