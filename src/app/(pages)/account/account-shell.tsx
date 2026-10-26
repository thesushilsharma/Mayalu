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

function AccountShellBody({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const isStandalone = segment === "onboarding" || segment === "users";

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <section className="font-sans antialiased flex min-h-screen w-full">
      <Suspense
        fallback={
          <div className="hidden lg:block lg:w-64 min-h-screen border-r bg-muted/20" />
        }
      >
        <DashboardUserLayout />
      </Suspense>

      {/* Main Content with Mobile Bottom Nav Clearance */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8 overflow-auto scroll-contain bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10">
        {children}
      </main>
    </section>
  );
}

export function AccountShell({
  children,
  initialUser,
  initialProfile,
  initialRole,
}: AccountShellProps) {
  return (
    <UserProvider
      initialUser={initialUser}
      initialProfile={initialProfile}
      initialRole={initialRole}
    >
      <Suspense
        fallback={
          <section className="font-sans antialiased flex min-h-screen w-full">
            <div className="hidden lg:block lg:w-64 min-h-screen border-r bg-muted/20" />
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8 overflow-auto scroll-contain bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10">
              {children}
            </main>
          </section>
        }
      >
        <AccountShellBody>{children}</AccountShellBody>
      </Suspense>
    </UserProvider>
  );
}
