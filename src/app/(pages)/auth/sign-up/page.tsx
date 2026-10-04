import { SignUpForm } from "@/components/auth";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Begin your graph-connected love story on Cloud Nine."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
