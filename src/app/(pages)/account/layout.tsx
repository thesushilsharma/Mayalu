import { memo } from "react";
import DashboardUserLayout from "@/components/dashboardLayout";
import { AuthGuard } from "@/components/auth/auth-guard";

async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuth={true}>
      <section className="font-sans antialiased flex min-h-screen w-full">
        <DashboardUserLayout />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 overflow-auto bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10">
          {children}
        </main>
      </section>
    </AuthGuard>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DashboardLayout);