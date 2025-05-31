import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <section className={`font-sans antialiased flex flex-col min-h-screen`}>
        <LogoutButton/>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </section>
  );
}
