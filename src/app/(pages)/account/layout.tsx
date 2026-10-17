import { Suspense } from "react";
import { AccountShell } from "./account-shell";
import { UserSessionSync } from "@/components/user-session-sync";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AccountShell>
      {/* Dynamic session & profile data streams in safely via Suspense without blocking route prerendering */}
      <Suspense fallback={null}>
        <UserSessionSync />
      </Suspense>
      {children}
    </AccountShell>
  );
}
