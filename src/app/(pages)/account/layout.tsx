import { Suspense } from "react";
import { AccountShell } from "./account-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <section className="font-sans antialiased flex min-h-screen w-full">
          <div className="hidden lg:block lg:w-64 min-h-screen border-r bg-muted/20" />
          <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 overflow-auto bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10">
            {children}
          </main>
        </section>
      }
    >
      <AccountShell>{children}</AccountShell>
    </Suspense>
  );
}
