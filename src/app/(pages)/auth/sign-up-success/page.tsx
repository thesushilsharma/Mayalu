"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Mail, CheckCircle2, RefreshCw, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"

export default function SignUpSuccessPage() {
  const [isResending, setIsResending] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [authState, setAuthState] = useState<string>("checking")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    // Listen to auth state changes for debugging
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", {
        user: currentUser?.email,
        verified: currentUser?.emailVerified,
        uid: currentUser?.uid
      })
      
      if (currentUser) {
        setAuthState("authenticated")
        setUserEmail(currentUser.email || "")
        setShowEmailInput(false) // Hide email input when authenticated
      } else {
        setAuthState("not-authenticated")
        setShowEmailInput(true) // Always show email input when not authenticated
        
        // Try to get email from session storage
        const storedEmail = sessionStorage.getItem('pendingVerificationEmail')
        if (storedEmail) {
          setUserEmail(storedEmail)
        } else {
          setUserEmail("") // Clear email if no stored email
        }
      }
    })

    return () => unsubscribe()
  }, [])

  // Also update from context
  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email)
      setAuthState("authenticated")
      setShowEmailInput(false)
    } else if (!loading) {
      // If no user and not loading, show email input
      setAuthState("not-authenticated")
      setShowEmailInput(true)
    }
  }, [user, loading])

  const handleResendVerification = async () => {
    setIsResending(true)
    console.log("Starting resend process...", {
      authCurrentUser: auth.currentUser?.email,
      contextUser: user?.email,
      authState,
      userEmail
    })

    try {
      // Method 1: Try with current authenticated user
      if (auth.currentUser) {
        await auth.currentUser.reload()
        const currentUser = auth.currentUser
        
        console.log("Using authenticated user:", {
          email: currentUser.email,
          verified: currentUser.emailVerified,
          uid: currentUser.uid
        })

        if (currentUser.emailVerified) {
          toast.success("Your email is already verified!")
          return
        }

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL
        
        await sendEmailVerification(currentUser, {
          url: `${baseUrl}/auth/action`,
          handleCodeInApp: false,
        })
        
        toast.success("Verification email sent successfully! Check your inbox.")
        return
      }

      // Method 2: If no authenticated user, try using server action
      if (userEmail) {
        console.log("No authenticated user, trying server action with email:", userEmail)
        
        // Use the server action for resending
        const formData = new FormData()
        formData.append('email', userEmail)
        
        const { resendEmailVerificationByEmailAction } = await import('@/lib/firebase/auth-actions')
        const result = await resendEmailVerificationByEmailAction(null, formData)
        
        if (result.success) {
          toast.success(result.message || "Verification email sent!")
        } else if (result.error?.form) {
          result.error.form.forEach((error) => {
            toast.error(error)
          })
        }
        return
      }

      // Method 3: No user and no email - ask user to sign in
      toast.error("Please sign in again to resend verification email")
      
    } catch (error: any) {
      console.error("Resend verification error:", error)
      
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait a few minutes before trying again.")
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up again.")
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your connection and try again.")
      } else {
        toast.error(`Failed to resend verification email: ${error.message || "Unknown error"}`)
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value)
  }

  return (
    <AuthLayout 
      title="Check your email"
      subtitle="We've sent you a verification link"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Account created successfully!
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
            </div>
          </div>

          {/* Email input for non-authenticated users */}
          {showEmailInput && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Not signed in - Enter your email to resend verification
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Email address:
                </label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Didn&apos;t receive the email? Check your spam folder or request a new one.
              </p>
              
              <Button 
                onClick={handleResendVerification}
                disabled={isResending || (showEmailInput && !userEmail.trim())}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
              
              {(showEmailInput && !userEmail.trim()) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Please enter your email address to resend verification
                </p>
              )}
              
              {(!showEmailInput && authState === "authenticated") && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ Signed in as {userEmail}
                </p>
              )}
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Already verified your email?
              </p>
              <Button asChild variant="default" className="w-full">
                <Link href="/auth/login">
                  Continue to sign in
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
