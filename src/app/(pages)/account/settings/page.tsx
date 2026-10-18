import { Suspense } from "react";
import { verifySession } from "@/lib/auth/dal";
import { SettingsConsole } from "@/components/settings/settings-console";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsSkeleton() {
  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto pb-16">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>
      <Skeleton className="h-28 w-full rounded-3xl" />
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-3xl" />
    </div>
  );
}

async function SettingsContent() {
  const { user, role } = await verifySession();

  return (
    <SettingsConsole
      initialRole={role}
      adminEmail={user?.email}
    />
  );
}

export default function SettingsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}