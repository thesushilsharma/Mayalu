"use client"

import type React from "react"
import { useActionState, useOptimistic, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2, Loader2, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { forgotPasswordAction } from "@/lib/firebase/auth-actions"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null)
  const [optimisticState, addOptimistic] = useOptimistic(
    { isSubmitting: false, success: false },
    (state, newState: { isSubmitting?: boolean; success?: boolean }) => ({
      ...state,
      ...newState,
    })
  )

  // Handle successful password reset
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Password reset email sent!")
    }
  }, [state?.success, state?.message])

  // Handle form errors
  useEffect(() => {
    if (state?.error?.form) {
      state.error.form.forEach((error) => {
        toast.error(error)
      })
    }
  }, [state?.error?.form])

  const handleSubmit = async (formData: FormData) => {
    addOptimistic({ isSubmitting: true })
    await formAction(formData)
    addOptimistic({ isSubmitting: false, success: true })
  }

  const emailErrors = state?.error?.email
  const formError = state?.error?.form

  if (state?.success || optimisticState.success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We&apos;ve sent password reset instructions to your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-medium">Email sent successfully!</p>
              </div>
              <p className="mt-2 text-sm text-green-600 dark:text-green-300">
                If an account with that email exists, you&apos;ll receive password reset instructions.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
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
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    autoComplete="email"
                    aria-invalid={!!emailErrors}
                    className={cn(emailErrors && "border-destructive focus-visible:ring-destructive")}
                  />
                  <FieldError errors={emailErrors?.map(error => ({ message: error }))} />
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
                    Sending reset email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send reset email
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
