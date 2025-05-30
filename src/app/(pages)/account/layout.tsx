export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </body>
    </html>
  );
}
