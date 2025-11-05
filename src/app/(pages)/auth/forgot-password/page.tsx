import { ForgotPasswordForm } from "@/components/auth/"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function Page() {
  return (
    <AuthLayout 
      title="Forgot your password?"
      subtitle="No worries, we'll help you reset it"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
