"use client";

import { useReducer, useMemo, useEffect } from "react";
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
import { Search, ArrowUpDown, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { subscribeToMessages, type Message, type MessageStatus } from "@/lib/firebase/messages";

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortOrder: "asc" | "desc";
}

type MessagesAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Message[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_SORT_ORDER" }
  | { type: "RESET_FILTERS" };

const initialState: MessagesState = {
  messages: [],
  isLoading: true,
  error: null,
  searchQuery: "",
  sortOrder: "desc",
};

function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, messages: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "TOGGLE_SORT_ORDER":
      return { ...state, sortOrder: state.sortOrder === "asc" ? "desc" : "asc" };
    case "RESET_FILTERS":
      return { ...state, searchQuery: "", sortOrder: "desc" };
    default:
      return state;
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString();
}

interface MessagesTableProps {
  filter?: "all" | "sent" | "received" | "unread";
}

export function MessagesTable({ filter = "all" }: MessagesTableProps) {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });

    // Subscribe to real-time messages from Firebase
    const unsubscribe = subscribeToMessages(
      (messages) => {
        dispatch({ type: "FETCH_SUCCESS", payload: messages });
      },
      (error) => {
        dispatch({ 
          type: "FETCH_ERROR", 
          payload: error.message || "Failed to load messages" 
        });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const sortedMessages = useMemo(() => {
    let filtered = state.messages;

    // Apply filter based on type
    if (filter === "sent") {
      // Filter sent messages (you'd need to add current user context)
      filtered = filtered.filter((message) => message.status !== "pending");
    } else if (filter === "received") {
      // Filter received messages
      filtered = filtered.filter((message) => message.status === "delivered" || message.status === "read");
    } else if (filter === "unread") {
      // Filter unread messages
      filtered = filtered.filter((message) => message.status === "delivered");
    }

    // Apply search query
    filtered = filtered.filter((message) => {
      const query = state.searchQuery.toLowerCase().trim();
      if (!query) return true;
      
      return (
        message.sender.name.toLowerCase().includes(query) ||
        message.recipient.name.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query)
      );
    });

    // Sort by timestamp
    return filtered.sort((a, b) => {
      const timeA = a.timestamp.getTime();
      const timeB = b.timestamp.getTime();
      return state.sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [state.messages, state.searchQuery, state.sortOrder, filter]);

  const getStatusVariant = (status: MessageStatus) => {
    switch (status) {
      case "delivered":
        return "default";
      case "read":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {state.error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
            className="pl-9"
            aria-label="Search messages"
            disabled={state.isLoading}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => dispatch({ type: "TOGGLE_SORT_ORDER" })}
                  aria-label={`Sort by time ${state.sortOrder === "asc" ? "descending" : "ascending"}`}
                  disabled={state.isLoading}
                >
                  Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading messages...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {state.searchQuery ? "No messages found matching your search." : "No messages yet."}
                </TableCell>
              </TableRow>
            ) : (
              sortedMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={message.sender.image} alt={message.sender.name} />
                        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{message.sender.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={message.recipient.image} alt={message.recipient.name} />
                        <AvatarFallback>{message.recipient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{message.recipient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={message.content}>
                    {message.content}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(message.status)}>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getRelativeTime(message.timestamp)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}