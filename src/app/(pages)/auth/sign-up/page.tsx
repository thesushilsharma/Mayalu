import { SignUpForm } from "@/components/auth/"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function Page() {
  return (
    <AuthLayout 
      title="Create your account"
      subtitle="Join us today and get started"
    >
      <SignUpForm />
    </AuthLayout>
  )
}
