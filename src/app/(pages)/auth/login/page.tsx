import { LoginForm } from "@/components/auth"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout 
        title="Welcome back"
        subtitle="Sign in to your account to continue"
      >
        <LoginForm />
      </AuthLayout>
    </AuthGuard>
  )
}