"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { applyActionCode, checkActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type VerificationState = "loading" | "success" | "error" | "invalid"

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      // Get parameters from URL
      const actionCode = searchParams.get("oobCode")
      const mode = searchParams.get("mode")
      const apiKey = searchParams.get("apiKey")
      
      console.log("Verification params:", { actionCode, mode, apiKey })
      
      if (!actionCode) {
        setState("invalid")
        setErrorMessage("Invalid verification link - missing verification code")
        return
      }

      if (mode !== "verifyEmail") {
        setState("invalid")
        setErrorMessage("Invalid verification link - wrong action mode")
        return
      }

      try {
        // Verify the action code is valid first
        const info = await checkActionCode(auth, actionCode)
        console.log("Action code info:", info)
        
        // Apply the email verification
        await applyActionCode(auth, actionCode)
        
        setState("success")
        toast.success("Email verified successfully!")
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
        
      } catch (error: any) {
        console.error("Email verification error:", error)
        setState("error")
        
        switch (error.code) {
          case "auth/expired-action-code":
            setErrorMessage("This verification link has expired. Please request a new one.")
            break
          case "auth/invalid-action-code":
            setErrorMessage("This verification link is invalid or has already been used.")
            break
          case "auth/user-disabled":
            setErrorMessage("This account has been disabled.")
            break
          case "auth/user-not-found":
            setErrorMessage("User account not found. Please sign up again.")
            break
          default:
            setErrorMessage(`Failed to verify email: ${error.message || "Unknown error"}`)
        }
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                This should only take a moment...
              </p>
            </CardContent>
          </Card>
        )

      case "success":
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">Email verified!</CardTitle>
              <CardDescription>Your email has been successfully verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <p className="text-sm text-green-700 dark:text-green-300 text-center">
                  You can now sign in to your account with full access.
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting you to sign in...
                </p>
                <Button asChild>
                  <Link href="/auth/login">
                    Continue to sign in
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case "error":
      case "invalid":
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold">Verification failed</CardTitle>
              <CardDescription>We couldn&apos;t verify your email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-700 dark:text-red-300 text-center">
                  {errorMessage}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button asChild variant="default">
                  <Link href="/auth/sign-up-success">
                    Request new verification email
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/login">
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <AuthLayout 
      title="Email Verification"
      subtitle="Confirming your email address"
    >
      {renderContent()}
    </AuthLayout>
  )
}