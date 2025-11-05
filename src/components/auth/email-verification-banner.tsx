"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { resendEmailVerificationAction } from "@/lib/firebase/auth-actions"

interface EmailVerificationBannerProps {
  show: boolean
  onClose?: () => void
}

export function EmailVerificationBanner({ show, onClose }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)

  if (!show) return null

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      const result = await resendEmailVerificationAction()
      if (result.success) {
        toast.success(result.message || "Verification email sent!")
      } else if (result.error?.form) {
        result.error.form.forEach((error) => {
          toast.error(error)
        })
      }
    } catch (error) {
      toast.error("Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Email verification required
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Please check your email and click the verification link to continue.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResendVerification}
            disabled={isResending}
            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-800"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-1 h-3 w-3" />
                Resend
              </>
            )}
          </Button>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-800"
            >
              ×
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}