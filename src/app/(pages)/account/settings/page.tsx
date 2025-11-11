import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-users">New User Notifications</Label>
              <Switch id="new-users" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reports">User Reports</Label>
              <Switch id="reports" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="matches">Match Notifications</Label>
              <Switch id="matches" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <Switch id="maintenance" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="debug">Debug Mode</Label>
              <Switch id="debug" />
            </div>
            <div className="mt-6">
              <Button variant="destructive">Clear Cache</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}