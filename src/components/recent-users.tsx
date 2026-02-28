"use client";

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

const recentUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    joinedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    joinedAt: "5 hours ago",
  },
  {
    id: "3",
    name: "Emily Turner",
    email: "emily.t@example.com",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "pending",
    joinedAt: "1 day ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@example.com",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "active",
    joinedAt: "2 days ago",
  },
];

export function RecentUsers() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentUsers.map((user) => (
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
            <TableCell className="text-muted-foreground">
              {user.joinedAt}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}