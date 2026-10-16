import { Suspense } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { getAllUsers } from "@/lib/neonDB/user-actions";
import { getVerificationCandidates } from "@/lib/neonDB/admin-actions";
import { AdminModerationConsole } from "@/components/admin-moderation-console";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function AdminConsoleSkeleton() {
  return (
    <div className="space-y-6">
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
  );
}

async function AdminUsersContent() {
  const { isAuth, user, role } = await verifySession();

  // Non-Admin Gate: Render Security Access Screen
  if (!isAuth || !user || role !== "admin") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto min-h-[60vh] space-y-4">
        <div className="size-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-md">
          <ShieldAlert className="size-8" />
        </div>
        <div className="space-y-1.5">
          <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/20 py-0 font-semibold">
            Maya Security Clearance Required
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Access Only
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Moderation &amp; Verification console is strictly restricted to Maya administrators and safety moderators. To review submitted verification selfies or manage accounts, sign in with an authorized admin email.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/account/dashboard">
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Admin Authorized: Load data via DAL
  const [users, candidates] = await Promise.all([
    getAllUsers(),
    getVerificationCandidates(),
  ]);

  return (
    <AdminModerationConsole
      initialUsers={users}
      initialCandidates={candidates}
      currentAdminEmail={user.email}
    />
  );
}

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
              Admin Moderation &amp; Safety
            </h1>
            <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25 py-0 font-semibold">
              <ShieldCheck className="size-3 mr-1" /> RBAC Admin
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            1-on-1 human selfie review, identity verification, and community standards moderation.
          </p>
        </div>
      </div>

      {/* Main Console streamed via Suspense boundary for Next.js cacheComponents */}
      <Suspense fallback={<AdminConsoleSkeleton />}>
        <AdminUsersContent />
      </Suspense>
    </div>
  );
}
