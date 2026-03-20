"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, ArrowUpDown } from "lucide-react";

const users = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    role: "user",
    joinedAt: "2024-03-15",
    matches: 12,
    messages: 45,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    role: "user",
    joinedAt: "2024-03-14",
    matches: 8,
    messages: 32,
  },
  {
    id: "3",
    name: "Emily Turner",
    email: "emily.t@example.com",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "inactive",
    role: "user",
    joinedAt: "2024-03-13",
    matches: 15,
    messages: 67,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@example.com",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    role: "premium",
    joinedAt: "2024-03-12",
    matches: 20,
    messages: 89,
  },
];

export function DataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof typeof users[0]>("joinedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "joinedAt") {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    return sortOrder === "asc"
      ? a[sortField] > b[sortField]
        ? 1
        : -1
      : b[sortField] > a[sortField]
      ? 1
      : -1;
  });

  const handleSort = (field: keyof typeof users[0]) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("matches")}
              >
                Matches
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("messages")}
              >
                Messages
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("joinedAt")}
              >
                Joined
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "premium" ? "default" : "outline"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.matches}</TableCell>
              <TableCell>{user.messages}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.joinedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}