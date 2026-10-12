import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { getUserOnboardingStatus } from "@/lib/neonDB/onboarding-actions";

async function AuthGate() {
  try {
    const { data: session } = await auth.getSession();
    if (session?.user) {
      const status = await getUserOnboardingStatus(session.user.id);
      if (status.isOnboarded) {
        redirect("/account/dashboard");
      } else {
        redirect("/account/onboarding");
      }
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
  }

  return null;
}

export default function AuthLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AuthGate />
      </Suspense>
      {children}
    </>
  );
}
