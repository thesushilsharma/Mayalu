"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showDivider?: boolean
  className?: string
}

export function AuthLayout({ 
  children, 
  title = "Welcome",
  subtitle = "Sign in to your account to continue",
  showDivider = false,
  className 
}: AuthLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20",
      className
    )}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {showDivider && <Separator />}

        {/* Auth Form */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}