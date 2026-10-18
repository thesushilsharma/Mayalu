import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingItem } from "@/components/settings/setting-item";
import { SettingsSection } from "@/components/settings/settings-section";

async function AdminSettingsSection() {
  const { isAuth, role } = await verifySession();
  if (!isAuth || role !== "admin") return null;

  return (
    <SettingsSection
      title="Admin & Safety"
      description="Exclusive controls for Maya platform administrators and moderators"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-50/50 to-purple-50/30 dark:from-violet-950/20 dark:to-purple-950/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">
              Moderation &amp; Verification Console
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Review submitted 1-on-1 identity selfies, moderate user profiles, and manage community safety.
          </p>
        </div>
        <Link href="/account/users">
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 rounded-xl gap-1.5 shadow-sm">
            <ShieldCheck className="size-4" />
            <span>Open Console</span>
          </Button>
        </Link>
      </div>
    </SettingsSection>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences and system configuration
        </p>
      </div>
      <Separator />
      <div className="grid gap-6 max-w-4xl">
        <Suspense fallback={null}>
          <AdminSettingsSection />
        </Suspense>

        <SettingsSection
          title="Notifications"
          description="Configure how you receive notifications about platform activity"
        >
          <SettingItem
            id="new-users"
            title="New User Notifications"
            description="Receive alerts when new users register on the platform"
          />
          <SettingItem
            id="reports"
            title="User Reports"
            description="Get notified when users submit reports or feedback"
          />
          <SettingItem
            id="matches"
            title="Match Notifications"
            description="Stay updated on successful matches between users"
          />
        </SettingsSection>

        <SettingsSection
          title="System"
          description="Advanced system settings and maintenance options"
        >
          <SettingItem
            id="maintenance"
            title="Maintenance Mode"
            description="Temporarily disable access for system maintenance"
          />
          <SettingItem
            id="debug"
            title="Debug Mode"
            description="Enable detailed logging for troubleshooting"
          />
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-base font-medium">Cache Management</h4>
              <p className="text-sm text-muted-foreground">
                Clear application cache to resolve performance issues
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Cache
            </Button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}