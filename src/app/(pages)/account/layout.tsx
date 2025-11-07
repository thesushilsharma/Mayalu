import { memo } from "react";
import DashboardUserLayout from "@/components/dashboardLayout";
import { AuthGuard } from "@/components/auth/auth-guard";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard requireAuth={true}>
      <section className="font-sans antialiased flex min-h-screen w-full">
        {/*  */}
        <DashboardUserLayout />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
          {children}
        </main>
      </section>
    </AuthGuard>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DashboardLayout);