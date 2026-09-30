"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import {
  MailCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Edit2,
  Check,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { authClient } from "@/lib/auth/client"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""

  const [email, setEmail] = useState(emailParam)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editedEmail, setEditedEmail] = useState(emailParam)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync email from search params if updated
  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam)
      setEditedEmail(emailParam)
    }
  }, [emailParam, email])

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    if (!code || code.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      // Call Better Auth email OTP verification endpoint
      const { data, error: verifyError } = await (authClient as any).emailOtp.verifyEmail({
        email: email.trim(),
        otp: code.trim(),
      })

      if (verifyError) {
        setError(verifyError.message || "Invalid or expired verification code")
        toast.error(verifyError.message || "Invalid code. Please try again.")
        setIsVerifying(false)
        return
      }

      toast.success("Email verified successfully!")
      setIsVerified(true)
      setIsVerifying(false)

      // Redirect after showing celebration
      setTimeout(() => {
        router.push("/account/dashboard")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Verification failed. Please check the code and try again.")
      toast.error(err.message || "Failed to verify code")
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error("Please provide an email address")
      return
    }
    if (resendCooldown > 0 || isResending) return

    setIsResending(true)
    setError(null)

    try {
      const { error: resendError } = await (authClient as any).emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: "email-verification",
      })

      if (resendError) {
        toast.error(resendError.message || "Failed to send verification code")
        setError(resendError.message)
      } else {
        toast.success("New verification code sent to your email!")
        setResendCooldown(60)
        setOtp("")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  const handleSaveEmail = () => {
    if (!editedEmail || !editedEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }
    setEmail(editedEmail.trim())
    setIsEditingEmail(false)
    setOtp("")
    setError(null)
    toast.info("Email updated. You can request a code for this address.")
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-green-200 dark:border-green-900/40">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Your account is now fully verified. Redirecting you to your dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Loader2 className="h-6 w-6 animate-spin text-green-600 dark:text-green-400" />
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <Button
            onClick={() => router.push("/account/dashboard")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Enter Verification Code
        </CardTitle>
        <CardDescription className="text-sm">
          We sent a 6-digit verification code to
        </CardDescription>

        {/* Email display and edit option */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {isEditingEmail ? (
            <div className="flex items-center gap-1.5 w-full max-w-xs">
              <Input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-8 text-xs"
                autoFocus
              />
              <Button
                size="sm"
                variant="default"
                className="h-8 px-2.5"
                onClick={handleSaveEmail}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 text-xs font-medium text-foreground">
              <span className="truncate max-w-[200px]">{email || "your email"}</span>
              <button
                type="button"
                onClick={() => {
                  setEditedEmail(email)
                  setIsEditingEmail(true)
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Change email"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* OTP Input Form */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => {
              setOtp(val)
              setError(null)
              if (val.length === 6) {
                handleVerify(val)
              }
            }}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in-50">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            className="w-full font-semibold"
            disabled={otp.length !== 6 || isVerifying}
            onClick={() => handleVerify()}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying code...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={resendCooldown > 0 || isResending}
              onClick={handleResend}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Sending new code...
                </>
              ) : resendCooldown > 0 ? (
                <span>Resend code in {resendCooldown}s</span>
              ) : (
                <>
                  <MailCheck className="mr-1.5 h-3.5 w-3.5" />
                  Didn&apos;t receive code? Resend
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t py-4 text-xs text-muted-foreground">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
