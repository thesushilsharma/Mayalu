import { Suspense } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"

function VerifyEmailSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verification Code
        </CardTitle>
        <CardDescription className="text-sm">
          Loading verification details...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout 
      title="Verify Your Email"
      subtitle="Complete email verification to secure your account"
    >
      <Suspense fallback={<VerifyEmailSkeleton />}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  )
}