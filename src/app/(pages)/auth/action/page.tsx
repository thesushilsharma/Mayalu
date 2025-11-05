"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { applyActionCode, checkActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type ActionState = "loading" | "success" | "error" | "invalid"

// Separate component that uses useSearchParams
function AuthActionContent() {
  const [state, setState] = useState<ActionState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [actionType, setActionType] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthAction = async () => {
      const mode = searchParams.get("mode")
      const actionCode = searchParams.get("oobCode")
      const continueUrl = searchParams.get("continueUrl")
      
      console.log("Auth action params:", { mode, actionCode, continueUrl })
      
      if (!mode || !actionCode) {
        setState("invalid")
        setErrorMessage("Invalid action link - missing required parameters")
        return
      }

      setActionType(mode)

      try {
        switch (mode) {
          case "verifyEmail":
            // Verify email address
            await checkActionCode(auth, actionCode)
            await applyActionCode(auth, actionCode)
            
            setState("success")
            toast.success("Email verified successfully!")
            
            // Redirect to login after a short delay
            setTimeout(() => {
              router.push("/auth/login")
            }, 3000)
            break

          case "resetPassword":
            // Handle password reset
            const email = await verifyPasswordResetCode(auth, actionCode)
            // You would typically show a form to enter new password here
            // For now, just redirect to reset password page with the code
            router.push(`/auth/reset-password?oobCode=${actionCode}&email=${encodeURIComponent(email)}`)
            break

          case "recoverEmail":
            // Handle email recovery
            await checkActionCode(auth, actionCode)
            await applyActionCode(auth, actionCode)
            setState("success")
            toast.success("Email recovered successfully!")
            break

          default:
            setState("invalid")
            setErrorMessage(`Unknown action mode: ${mode}`)
        }
      } catch (error: any) {
        console.error("Auth action error:", error)
        setState("error")
        
        switch (error.code) {
          case "auth/expired-action-code":
            setErrorMessage("This link has expired. Please request a new one.")
            break
          case "auth/invalid-action-code":
            setErrorMessage("This link is invalid or has already been used.")
            break
          case "auth/user-disabled":
            setErrorMessage("This account has been disabled.")
            break
          case "auth/user-not-found":
            setErrorMessage("User account not found.")
            break
          case "auth/weak-password":
            setErrorMessage("The new password is too weak.")
            break
          default:
            setErrorMessage(`Action failed: ${error.message || "Unknown error"}`)
        }
      }
    }

    handleAuthAction()
  }, [searchParams, router])

  const getTitle = () => {
    switch (actionType) {
      case "verifyEmail":
        return "Email Verification"
      case "resetPassword":
        return "Password Reset"
      case "recoverEmail":
        return "Email Recovery"
      default:
        return "Authentication Action"
    }
  }

  const getSubtitle = () => {
    switch (actionType) {
      case "verifyEmail":
        return "Confirming your email address"
      case "resetPassword":
        return "Resetting your password"
      case "recoverEmail":
        return "Recovering your email"
      default:
        return "Processing your request"
    }
  }

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">Processing...</CardTitle>
              <CardDescription>Please wait while we process your request</CardDescription>
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
              <CardTitle className="text-2xl font-bold">
                {actionType === "verifyEmail" ? "Email verified!" : "Success!"}
              </CardTitle>
              <CardDescription>
                {actionType === "verifyEmail" 
                  ? "Your email has been successfully verified"
                  : "Your request has been processed successfully"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <p className="text-sm text-green-700 dark:text-green-300 text-center">
                  {actionType === "verifyEmail" 
                    ? "You can now sign in to your account with full access."
                    : "The action has been completed successfully."
                  }
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
              <CardTitle className="text-2xl font-bold">Action failed</CardTitle>
              <CardDescription>We couldn&apos;t process your request</CardDescription>
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
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {renderContent()}
    </AuthLayout>
  )
}

// Loading fallback component
function AuthActionLoading() {
  return (
    <AuthLayout 
      title="Authentication Action"
      subtitle="Processing your request"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          <CardDescription>Please wait while we load your request</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This should only take a moment...
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

// Main page component with Suspense boundary
export default function AuthActionPage() {
  return (
    <Suspense fallback={<AuthActionLoading />}>
      <AuthActionContent />
    </Suspense>
  )
}