"use client";

import { ArrowUpDown, Loader2, MoreVertical, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/lib/neonDB/user-actions";
import {
  deleteUser,
  setUserClaims,
  updateUserStatus,
} from "@/lib/neonDB/user-actions";

interface UsersDataTableProps {
  users: User[];
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"metadata.creationTime" | "email">(
    "metadata.creationTime",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isPending, startTransition] = useTransition();
  const [pendingUid, setPendingUid] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "metadata.creationTime") {
      const dateA = new Date(a.metadata.creationTime || 0);
      const dateB = new Date(b.metadata.creationTime || 0);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    const emailA = a.email || "";
    const emailB = b.email || "";
    return sortOrder === "asc"
      ? emailA.localeCompare(emailB)
      : emailB.localeCompare(emailA);
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleToggleStatus = (uid: string, currentStatus: boolean) => {
    setPendingUid(uid);
    startTransition(async () => {
      try {
        const result = await updateUserStatus(uid, !currentStatus);
        if (result.success) {
          toast.success(
            `User ${!currentStatus ? "disabled" : "enabled"} successfully`,
          );
        } else {
          toast.error(result.error || "Failed to update user status");
        }
      } finally {
        setPendingUid(null);
      }
    });
  };

  const handleDeleteUser = (uid: string, email: string | undefined) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    setPendingUid(uid);
    startTransition(async () => {
      try {
        const result = await deleteUser(uid);
        if (result.success) {
          toast.success("User deleted successfully");
        } else {
          toast.error(result.error || "Failed to delete user");
        }
      } finally {
        setPendingUid(null);
      }
    });
  };

  const handleSetRole = (uid: string, role: string) => {
    setPendingUid(uid);
    startTransition(async () => {
      try {
        const result = await setUserClaims(uid, { role });
        if (result.success) {
          toast.success(`User role updated to ${role}`);
        } else {
          toast.error(result.error || "Failed to update user role");
        }
      } finally {
        setPendingUid(null);
      }
    });
  };

  const getUserInitials = (user: User) => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  const getUserRole = (user: User): string => {
    return (user.customClaims?.role as string) || "user";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedUsers.length} {sortedUsers.length === 1 ? "user" : "users"}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email Verified</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("metadata.creationTime")}
                  className="h-8 px-2"
                >
                  Joined
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => {
                const isRowPending = isPending && pendingUid === user.uid;

                return (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.photoURL}
                            alt={user.displayName || user.email}
                          />
                          <AvatarFallback>
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.displayName || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.disabled ? "destructive" : "default"}
                      >
                        {user.disabled ? "Disabled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getUserRole(user) === "admin" ? "default" : "outline"
                        }
                      >
                        {getUserRole(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.emailVerified ? "default" : "secondary"}
                      >
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.metadata.creationTime
                        ? new Date(
                            user.metadata.creationTime,
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.metadata.lastSignInTime
                        ? new Date(
                            user.metadata.lastSignInTime,
                          ).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                          })}
                          disabled={isPending}
                        >
                          {isRowPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(user.uid, user.disabled)
                            }
                          >
                            {user.disabled ? "Enable User" : "Disable User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSetRole(user.uid, "admin")}
                          >
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSetRole(user.uid, "user")}
                          >
                            Set as User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteUser(user.uid, user.email)
                            }
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
