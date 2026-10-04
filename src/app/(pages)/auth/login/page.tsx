import { LoginForm } from "@/components/auth";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to Mayalu"
      subtitle="Welcome back to Cloud Nine. Enter your credentials to continue."
    >
      <LoginForm />
    </AuthLayout>
  );
}
