"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = "/auth/login",
  fallback
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        setIsRedirecting(true)
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // Check if user needs email verification
        if (!user.emailVerified) {
          setIsRedirecting(true)
          router.push("/auth/sign-up")
        } else {
          setIsRedirecting(true)
          router.push("/dashboard")
        }
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading spinner while auth state is being determined or redirecting
  if (loading || isRedirecting) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    )
  }

  // For pages that don't require auth (like login), show content if user is not authenticated
  if (!requireAuth && !user) {
    return <>{children}</>
  }

  // For pages that require auth, show content if user is authenticated
  if (requireAuth && user) {
    return <>{children}</>
  }

  // In all other cases (wrong auth state), don't render anything (redirect will happen)
  return null
}