"use client";

import * as React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  Search,
  Lock,
  Ghost,
  Camera,
  MoreVertical,
  Trash2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { User } from "@/lib/neonDB/user-actions";
import {
  type VerificationCandidate,
  approveVerification,
  rejectVerification,
  updateUserRole,
  toggleUserBan,
} from "@/lib/neonDB/admin-actions";
import { deleteUser } from "@/lib/neonDB/user-actions";

interface AdminModerationConsoleProps {
  initialUsers: User[];
  initialCandidates: VerificationCandidate[];
  currentAdminEmail: string;
}

export function AdminModerationConsole({
  initialUsers,
  initialCandidates,
  currentAdminEmail,
}: AdminModerationConsoleProps) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [candidates, setCandidates] = React.useState<VerificationCandidate[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [actionInProgressId, setActionInProgressId] = React.useState<string | null>(null);

  // Sync state if props refresh
  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  React.useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

  // Handle Selfie Approval
  const handleApprove = (candidate: VerificationCandidate) => {
    setActionInProgressId(candidate.userId);
    startTransition(async () => {
      try {
        const res = await approveVerification(candidate.userId);
        if (res.success) {
          toast.success(`Approved verification for ${candidate.name}! 🛡️`, {
            description: "User profile has been lifted out of Ghost Spectator mode.",
          });
          setCandidates((prev) =>
            prev.map((c) =>
              c.userId === candidate.userId ? { ...c, verificationStatus: "verified" } : c,
            ),
          );
        } else {
          toast.error(res.error || "Failed to approve verification");
        }
      } finally {
        setActionInProgressId(null);
      }
    });
  };

  // Handle Selfie Rejection
  const handleReject = (candidate: VerificationCandidate) => {
    setActionInProgressId(candidate.userId);
    startTransition(async () => {
      try {
        const res = await rejectVerification(candidate.userId);
        if (res.success) {
          toast.info(`Requested selfie retake for ${candidate.name}`, {
            description: "User will be prompted to submit a clearer selfie.",
          });
          setCandidates((prev) =>
            prev.map((c) =>
              c.userId === candidate.userId ? { ...c, verificationStatus: "rejected", verificationSelfie: null } : c,
            ),
          );
        } else {
          toast.error(res.error || "Failed to reject verification");
        }
      } finally {
        setActionInProgressId(null);
      }
    });
  };

  // Handle Role Change
  const handleRoleChange = (user: User, newRole: "admin" | "moderator" | "user") => {
    setActionInProgressId(user.uid);
    startTransition(async () => {
      try {
        const res = await updateUserRole(user.uid, newRole);
        if (res.success) {
          toast.success(`Updated ${user.displayName || user.email} to ${newRole}`);
          setUsers((prev) =>
            prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole } : u)),
          );
        } else {
          toast.error(res.error || "Failed to update role");
        }
      } finally {
        setActionInProgressId(null);
      }
    });
  };

  // Handle User Ban / Unban
  const handleToggleBan = (user: User) => {
    const nextBanned = !user.disabled;
    setActionInProgressId(user.uid);
    startTransition(async () => {
      try {
        const res = await toggleUserBan(user.uid, nextBanned);
        if (res.success) {
          toast.success(`User ${nextBanned ? "banned & logged out" : "unbanned"} successfully`);
          setUsers((prev) =>
            prev.map((u) => (u.uid === user.uid ? { ...u, disabled: nextBanned } : u)),
          );
        } else {
          toast.error(res.error || "Failed to update ban status");
        }
      } finally {
        setActionInProgressId(null);
      }
    });
  };

  // Handle User Deletion
  const handleDelete = (user: User) => {
    if (!confirm(`Are you sure you want to permanently delete ${user.displayName || user.email}?`)) return;

    setActionInProgressId(user.uid);
    startTransition(async () => {
      try {
        const res = await deleteUser(user.uid);
        if (res.success) {
          toast.success(`User deleted permanently`);
          setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        } else {
          toast.error(res.error || "Failed to delete user");
        }
      } finally {
        setActionInProgressId(null);
      }
    });
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName?.toLowerCase() || "").includes(q) ||
      (u.email?.toLowerCase() || "").includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const pendingCount = candidates.filter((c) => c.verificationStatus === "pending_review").length;
  const verifiedCount = candidates.filter((c) => c.verificationStatus === "verified").length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Maya Admin Clearance Confirmation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-rose-500/10 border border-violet-500/25">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">Maya Matchmaker Moderator Desk</h2>
              <Badge className="bg-emerald-500 text-white text-[10px] py-0 px-1.5 border-0">
                Admin Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Logged in as <strong className="text-foreground">{currentAdminEmail}</strong> • Neon RBAC Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="bg-background/80 text-violet-600 dark:text-violet-400 border-violet-500/30">
            {pendingCount} Awaiting Selfie Review
          </Badge>
          <Badge variant="outline" className="bg-background/80 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            {verifiedCount} Verified Chinos
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList className="bg-muted/80 dark:bg-muted/50 p-1 rounded-2xl h-11 border border-border/70 shadow-xs grid grid-cols-2 max-w-md">
          <TabsTrigger
            value="verification"
            className="rounded-xl text-xs font-medium gap-1.5 data-active:bg-background data-active:text-violet-600 dark:data-active:text-violet-400 data-active:font-bold data-active:shadow-sm"
          >
            <Camera className="size-3.5" />
            <span>Selfie Verification ({candidates.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-xl text-xs font-medium gap-1.5 data-active:bg-background data-active:text-rose-600 dark:data-active:text-rose-400 data-active:font-bold data-active:shadow-sm"
          >
            <ShieldCheck className="size-3.5" />
            <span>Account Moderation ({users.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SELFIE VERIFICATION QUEUE */}
        <TabsContent value="verification" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold tracking-tight">1-on-1 Human Selfie Review</h3>
              <p className="text-xs text-muted-foreground">
                Maya checks each selfie privately to eliminate catfish and bots. Approving lifts candidate from Ghost Mode.
              </p>
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border/60 bg-muted/20">
              <Camera className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">No candidate selfies submitted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand) => {
                const isWorking = actionInProgressId === cand.userId;
                return (
                  <div
                    key={cand.userId}
                    className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xs flex flex-col justify-between gap-4"
                  >
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{cand.name}</span>
                          {cand.age && <span className="text-rose-500 font-semibold text-xs">{cand.age}</span>}
                          {cand.verificationStatus === "verified" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] py-0">
                              Verified 🛡️
                            </Badge>
                          ) : cand.verificationStatus === "pending_review" ? (
                            <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[10px] py-0 font-semibold animate-pulse">
                              Pending Review ⚡
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-500/15 text-purple-600 border border-purple-500/30 text-[10px] py-0">
                              <Ghost className="size-2.5 mr-0.5" /> Ghost Mode 👻
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cand.location || "Location not set"} • {cand.email}
                        </p>
                      </div>

                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {cand.additionalPhotosCount} Showcase Photos
                      </Badge>
                    </div>

                    {/* Image Comparison: Public Avatar vs Private Admin Selfie */}
                    <div className="grid grid-cols-2 gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                      {/* Public Profile Photo */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          Public Chino Face
                        </span>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/60">
                          <Image
                            src={cand.profilePhoto || "/placeholder.svg"}
                            alt="Public Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Private Verification Selfie */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider block flex items-center gap-1">
                          <Lock className="size-2.5" /> Admin Selfie (Private)
                        </span>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-violet-500/40">
                          {cand.verificationSelfie ? (
                            <Image
                              src={cand.verificationSelfie}
                              alt="Verification Selfie"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                              <Ghost className="size-6 text-purple-400 mb-1" />
                              <span className="text-[10px]">No selfie uploaded</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    {cand.bio && (
                      <p className="text-xs text-muted-foreground italic bg-background/60 p-2 rounded-lg border border-border/40">
                        &quot;{cand.bio}&quot;
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                      <Button
                        size="sm"
                        disabled={isWorking || !cand.verificationSelfie || cand.verificationStatus === "verified"}
                        onClick={() => handleApprove(cand)}
                        className="flex-1 text-xs h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold gap-1.5 shadow-sm active:scale-97"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>{cand.verificationStatus === "verified" ? "Verified" : "Approve & Lift Ghost Mode 🛡️"}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isWorking || !cand.verificationSelfie}
                        onClick={() => handleReject(cand)}
                        className="text-xs h-8 rounded-xl border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1 active:scale-97"
                      >
                        <XCircle className="size-3.5" />
                        <span>Retake</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: ACCOUNT MODERATION & RBAC */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} accounts
            </span>
          </div>

          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card/60 backdrop-blur-md shadow-xs">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="text-xs">
                  <TableHead>User / Chino</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const isCurrentAdmin = user.email?.toLowerCase() === currentAdminEmail.toLowerCase();
                  return (
                    <TableRow key={user.uid} className="text-xs">
                      {/* Name & Avatar */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="size-8 rounded-xl border border-border/60 shrink-0">
                            <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                            <AvatarFallback className="text-[10px] bg-rose-500/10 text-rose-500 font-bold">
                              {(user.displayName || user.email || "U")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold block truncate" title={user.displayName || undefined}>
                              {user.displayName || "Anonymous"}
                            </span>
                            {isCurrentAdmin && (
                              <span className="text-[9px] text-violet-600 font-bold">You (Admin)</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Email with Overflow Defense */}
                      <TableCell className="text-muted-foreground max-w-[180px] sm:max-w-[240px] truncate" title={user.email || undefined}>
                        {user.email || "—"}
                      </TableCell>

                      {/* Role Pill with Selector */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={isCurrentAdmin}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              user.role === "admin"
                                ? "bg-violet-500/15 text-violet-600 border-violet-500/30"
                                : user.role === "moderator"
                                ? "bg-blue-500/15 text-blue-600 border-blue-500/30"
                                : "bg-muted text-muted-foreground border-border/60"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="text-xs">
                            <DropdownMenuItem onClick={() => handleRoleChange(user, "admin")}>
                              Promote to Admin 🛡️
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user, "moderator")}>
                              Set as Moderator ⚖️
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user, "user")}>
                              Demote to Standard User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {user.disabled ? (
                          <Badge className="bg-destructive/15 text-destructive border border-destructive/30 text-[10px] py-0">
                            Banned / Frozen
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[10px] py-0">
                            Active
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="size-8 rounded-lg inline-flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                            <MoreVertical className="size-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            {!isCurrentAdmin && (
                              <DropdownMenuItem
                                onClick={() => handleToggleBan(user)}
                                className={user.disabled ? "text-emerald-600" : "text-amber-600"}
                              >
                                {user.disabled ? (
                                  <>
                                    <UserCheck className="size-3.5 mr-1.5" />
                                    <span>Unban Account</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="size-3.5 mr-1.5" />
                                    <span>Ban & Invalidate Sessions</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}

                            {!isCurrentAdmin && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(user)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-3.5 mr-1.5" />
                                <span>Delete Account Permanently</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
