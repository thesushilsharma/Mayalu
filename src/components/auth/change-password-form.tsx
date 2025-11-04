"use client"

import type React from "react"
import { useActionState, useOptimistic } from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { validatePasswordStrength, doPasswordsMatch } from "@/lib/validations/authHelper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { CheckCircle2, XCircle } from "lucide-react"
import { changePasswordAction } from "@/lib/firebase/auth-actions"

export function ChangePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null)
  const [optimisticState, addOptimistic] = useOptimistic(
    { isSubmitting: false, success: false },
    (state, newState: { isSubmitting?: boolean; success?: boolean }) => ({
      ...state,
      ...newState,
    })
  )
  
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

  const handleSubmit = async (formData: FormData) => {
    addOptimistic({ isSubmitting: true })
    await formAction(formData)
    addOptimistic({ isSubmitting: false, success: true })
  }

  const currentPasswordErrors = state?.error?.currentPassword
  const newPasswordErrors = state?.error?.newPassword
  const confirmPasswordErrors = state?.error?.confirmPassword
  const formError = state?.error?.form
  const success = state?.success || optimisticState.success
  const isFormValid = passwordValidation.isValid && passwordsMatch && formValues.currentPassword.length > 0

  if (success) {
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
          <form action={handleSubmit}>
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
                    aria-invalid={!!currentPasswordErrors}
                  />
                  <FieldError errors={currentPasswordErrors?.map(error => ({ message: error }))} />
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
                    aria-invalid={!!newPasswordErrors}
                  />

                  {formValues.newPassword && (
                    <FieldDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Password must:</p>
                        <ul className="space-y-1 pl-2">
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
                    </FieldDescription>
                  )}

                  <FieldError errors={newPasswordErrors?.map(error => ({ message: error }))} />
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
                      aria-invalid={!!confirmPasswordErrors}
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
                    <FieldDescription className="text-red-500">
                      Passwords need to match
                    </FieldDescription>
                  )}
                  
                  <FieldError errors={confirmPasswordErrors?.map(error => ({ message: error }))} />
                </FieldContent>
              </Field>

              {formError && (
                <FieldError>
                  {formError}
                </FieldError>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || optimisticState.isSubmitting || !isFormValid}
              >
                {isPending || optimisticState.isSubmitting ? "Updating password..." : "Update password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
