import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingItem } from "@/components/settings/setting-item";
import { SettingsSection } from "@/components/settings/settings-section";

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