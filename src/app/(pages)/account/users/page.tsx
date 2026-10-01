import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersDataTable } from "@/components/users-data-table";
import { requireAuth } from "@/lib/neonDB/auth-server";
import { getAllUsers } from "@/lib/neonDB/user-actions";

async function UsersTableWrapper() {
  await requireAuth();
  const users = await getAllUsers();

  return <UsersDataTable users={users} />;
}

function UsersTableSkeleton() {
  const skeletonItems = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        {skeletonItems.map((id) => (
          <Skeleton key={id} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage and monitor all registered users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersTableWrapper />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
