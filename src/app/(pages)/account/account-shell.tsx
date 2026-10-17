"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Suspense } from "react";
import DashboardUserLayout from "@/components/dashboardLayout";
import { UserProvider } from "@/contexts/userContext";

interface AccountShellProps {
  children: React.ReactNode;
  initialUser?: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role?: string;
  } | null;
  initialProfile?: Record<string, unknown> | null;
  initialRole?: string;
}

export function AccountShell({
  children,
  initialUser,
  initialProfile,
  initialRole,
}: AccountShellProps) {
  const segment = useSelectedLayoutSegment();
  const isOnboarding = segment === "onboarding";

  return (
    <UserProvider
      initialUser={initialUser}
      initialProfile={initialProfile}
      initialRole={initialRole}
    >
      {isOnboarding ? (
        children
      ) : (
        <section className="font-sans antialiased flex min-h-screen w-full">
          <Suspense
            fallback={
              <div className="hidden lg:block lg:w-64 min-h-screen border-r bg-muted/20" />
            }
          >
            <DashboardUserLayout />
          </Suspense>

          {/* Main Content */}
          <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 overflow-auto bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10">
            {children}
          </main>
        </section>
      )}
    </UserProvider>
  );
}
