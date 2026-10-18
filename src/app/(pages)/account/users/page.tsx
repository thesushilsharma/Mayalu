import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Heart } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { getAllUsers } from "@/lib/neonDB/user-actions";
import { getVerificationCandidates } from "@/lib/neonDB/admin-actions";
import { AdminModerationConsole } from "@/components/admin-moderation-console";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/mode-toggle";

function AdminConsoleSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border/40 px-6 flex items-center justify-between">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <Skeleton className="h-8 w-36 rounded-xl" />
      </div>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-48 rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

async function AdminUsersContent() {
  const { isAuth, user, role } = await verifySession();

  // Non-Admin Gate: Non-admins should not see this page at all; redirect them directly
  if (!isAuth || !user) {
    redirect("/auth/login");
  }
  if (role !== "admin") {
    redirect("/account/dashboard");
  }

  // Admin Authorized: Load data via DAL
  const [users, candidates] = await Promise.all([
    getAllUsers(),
    getVerificationCandidates(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-pink-950/10 text-foreground">
      {/* Standalone Executive Admin Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/account/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-2 rounded-xl shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
              Mayalu
            </span>
          </Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Admin Moderation
            </span>
            <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25 py-0 font-semibold">
              <ShieldCheck className="size-3 mr-1" /> RBAC
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/account/dashboard">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-xl">
              <ArrowLeft className="size-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main Admin Console */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                Admin Moderation &amp; Safety
              </h1>
              <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25 py-0 font-semibold">
                <ShieldCheck className="size-3 mr-1" /> Verified Admin
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              1-on-1 human selfie review, identity verification, and community standards moderation.
            </p>
          </div>
        </div>

        <AdminModerationConsole
          initialUsers={users}
          initialCandidates={candidates}
          currentAdminEmail={user.email}
        />
      </main>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminConsoleSkeleton />}>
      <AdminUsersContent />
    </Suspense>
  );
}
