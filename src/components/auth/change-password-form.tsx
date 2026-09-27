"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { validatePasswordStrength, doPasswordsMatch } from "@/lib/validations/authHelper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"

export function ChangePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
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

  // Update form values and validate on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  // Validate password strength and matching on input change
  useEffect(() => {
    setPasswordValidation(validatePasswordStrength(formValues.newPassword))
    setPasswordsMatch(doPasswordsMatch(formValues.newPassword, formValues.confirmPassword))
  }, [formValues.newPassword, formValues.confirmPassword])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { data, error } = await authClient.changePassword({
        newPassword: formValues.newPassword,
        currentPassword: formValues.currentPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        toast.error(error.message || "Failed to change password")
        setIsSubmitting(false)
        return
      }

      toast.success("Password changed successfully!")
      setIsSuccess(true)
      setIsSubmitting(false)
      
      // Optionally reset form
      setFormValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const isFormValid = passwordValidation.isValid && passwordsMatch && formValues.currentPassword.length > 0

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Password Changed</CardTitle>
            <CardDescription>Your password has been successfully updated.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p>Password changed successfully!</p>
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
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    value={formValues.currentPassword}
                    onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={formValues.newPassword}
                    onChange={handleChange}
                    className={cn(
                      formValues.newPassword &&
                        (passwordValidation.isValid
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"),
                    )}
                  />

                  {formValues.newPassword && (
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
                          {passwordValidation.results.hasSpecialChar ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Include at least one special character (!@#$%^&*())
                        </li>
                      </ul>
                    </div>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formValues.confirmPassword}
                      onChange={handleChange}
                      className={cn(
                        formValues.confirmPassword &&
                          (passwordsMatch
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-red-500 focus-visible:ring-red-500"),
                      )}
                    />
                    {formValues.confirmPassword && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {formValues.confirmPassword && !passwordsMatch && (
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
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
