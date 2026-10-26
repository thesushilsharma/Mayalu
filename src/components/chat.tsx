"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  Video,
  Send,
  Image,
  Smile,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserLevel } from "@/contexts/userContext";

// Mock conversation data
const mockConversation = {
  id: "1",
  user: {
    id: "123",
    name: "Jessica Lee",
    image: "https://api.dicebear.com/10.x/initial-face/svg?seed=JessicaLee",
    online: true,
    lastActive: "Just now",
  },
  messages: [
    {
      id: "msg1",
      sender: "them",
      content:
        "Hey there! I saw that we both like hiking. Have you been to any good trails lately?",
      timestamp: "10:30 AM",
    },
    {
      id: "msg2",
      sender: "me",
      content:
        "Hi Jessica! Yes, I went to Eagle Creek last weekend. The views were amazing!",
      timestamp: "10:35 AM",
    },
    {
      id: "msg3",
      sender: "them",
      content:
        "That sounds great! I've been wanting to check that one out. Would you recommend it for beginners?",
      timestamp: "10:38 AM",
    },
    {
      id: "msg4",
      sender: "me",
      content:
        "Definitely! There are some steeper sections but overall it's quite manageable. The waterfall at the end makes it all worth it.",
      timestamp: "10:42 AM",
    },
    {
      id: "msg5",
      sender: "them",
      content:
        "Perfect! Maybe we could go hiking together sometime? I'm free next weekend if you're interested.",
      timestamp: "10:45 AM",
    },
  ],
};

export default function MessagePage() {
  const params = useParams();
  const router = useRouter();
  const { userLevel, addXp } = useUserLevel();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(mockConversation);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  // In a real app, fetch the conversation based on the ID
  const _conversationId = params.id;

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `msg${conversation.messages.length + 1}`,
      sender: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMsg],
    });

    setNewMessage("");

    // Add XP for sending a message (only for the first message in this session)
    if (conversation.messages.filter((m) => m.sender === "me").length === 0) {
      addXp(5);
      toast({
        title: "First message sent!",
        description: "+5 XP earned",
      });
    }
  };

  const handleCallAttempt = () => {
    if (userLevel.level < 10) {
      toast({
        variant: "destructive",
        title: "Feature locked",
        description:
          "Calling is unlocked at level 10. Keep engaging to level up!",
      });
    } else {
      toast({
        title: "Initiating call",
        description: "Connecting with Jessica...",
      });
      // In a real app, implement call functionality here
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] min-h-[100dvh] bg-background overscroll-none">
      <header className="bg-card border-b px-4 py-3 sm:py-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] flex items-center shrink-0 shadow-2xs">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2 active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3 shrink-0 ring-1 ring-border">
          <AvatarImage src={conversation.user.image} />
          <AvatarFallback>
            {conversation.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <h2 className="font-semibold text-sm sm:text-base truncate">
              {conversation.user.name}
            </h2>
            {conversation.user.online && (
              <Badge
                variant="outline"
                className="bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] py-0 px-1.5 shrink-0"
              >
                Online
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {conversation.user.online
              ? "Active now"
              : conversation.user.lastActive}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCallAttempt}
            className="active:scale-95 transition-transform"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCallAttempt}
            className="active:scale-95 transition-transform"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="active:scale-95 transition-transform"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
        {conversation.messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "them" && (
              <Avatar className="h-8 w-8 mr-2 mt-1 shrink-0 ring-1 ring-border/50">
                <AvatarImage src={conversation.user.image} />
                <AvatarFallback>
                  {conversation.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-[85%] sm:max-w-[75%] flex flex-col min-w-0">
              <Card
                className={`p-3 rounded-2xl shadow-2xs break-words [overflow-wrap:anywhere] ${
                  message.sender === "me"
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-xs"
                    : "bg-muted/70 text-foreground rounded-bl-xs"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </Card>
              <span
                className={`text-[10px] text-muted-foreground mt-1 px-1 tabular-nums ${message.sender === "me" ? "text-right" : "text-left"}`}
              >
                {message.timestamp}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t bg-card shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 active:scale-95 transition-transform"
            title="Attach media"
          >
            <Image className="h-5 w-5" />
          </Button>
          <Textarea
            placeholder="Type a message..."
            className="min-h-10 max-h-32 resize-none text-base sm:text-sm rounded-xl py-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 active:scale-95 transition-transform"
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="shrink-0 rounded-xl bg-rose-500 hover:bg-rose-600 text-white active:scale-95 transition-[background-color,transform,opacity] duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            title="Send Message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
