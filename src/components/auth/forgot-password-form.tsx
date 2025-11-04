"use client"

import type React from "react"
import { useActionState, useOptimistic } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
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
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <p>Password reset email sent successfully!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                If you registered using your email and password, you will receive a password reset email.
              </p>
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
          <CardDescription>Type in your email and we&apos;ll send you a link to reset your password</CardDescription>
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
                    placeholder="m@example.com"
                    required
                    aria-invalid={!!emailErrors}
                  />
                  <FieldError errors={emailErrors?.map(error => ({ message: error }))} />
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
                disabled={isPending || optimisticState.isSubmitting}
              >
                {isPending || optimisticState.isSubmitting ? "Sending..." : "Send reset email"}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
