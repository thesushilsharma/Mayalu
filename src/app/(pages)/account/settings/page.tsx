import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications about platform activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-users" className="text-base font-medium">
                  New User Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when new users register on the platform
                </p>
              </div>
              <Switch id="new-users" />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="reports" className="text-base font-medium">
                  User Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when users submit reports or feedback
                </p>
              </div>
              <Switch id="reports" />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="matches" className="text-base font-medium">
                  Match Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Stay updated on successful matches between users
                </p>
              </div>
              <Switch id="matches" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
            <CardDescription>
              Advanced system settings and maintenance options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="maintenance" className="text-base font-medium">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access for system maintenance
                </p>
              </div>
              <Switch id="maintenance" />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="debug" className="text-base font-medium">
                  Debug Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed logging for troubleshooting
                </p>
              </div>
              <Switch id="debug" />
            </div>
            <Separator />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}