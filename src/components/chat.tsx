"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Video, Send, Image, Smile, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {useUserLevel} from "@/contexts/userContext";

// Mock conversation data
const mockConversation = {
  id: "1",
  user: {
    id: "123",
    name: "Jessica Lee",
    image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=600",
    online: true,
    lastActive: "Just now",
  },
  messages: [
    {
      id: "msg1",
      sender: "them",
      content: "Hey there! I saw that we both like hiking. Have you been to any good trails lately?",
      timestamp: "10:30 AM",
    },
    {
      id: "msg2",
      sender: "me",
      content: "Hi Jessica! Yes, I went to Eagle Creek last weekend. The views were amazing!",
      timestamp: "10:35 AM",
    },
    {
      id: "msg3",
      sender: "them",
      content: "That sounds great! I've been wanting to check that one out. Would you recommend it for beginners?",
      timestamp: "10:38 AM",
    },
    {
      id: "msg4",
      sender: "me",
      content: "Definitely! There are some steeper sections but overall it's quite manageable. The waterfall at the end makes it all worth it.",
      timestamp: "10:42 AM",
    },
    {
      id: "msg5",
      sender: "them",
      content: "Perfect! Maybe we could go hiking together sometime? I'm free next weekend if you're interested.",
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

  // In a real app, fetch the conversation based on the ID
  const conversationId = params.id;

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `msg${conversation.messages.length + 1}`,
      sender: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMsg],
    });

    setNewMessage("");
    
    // Add XP for sending a message (only for the first message in this session)
    if (conversation.messages.filter(m => m.sender === "me").length === 0) {
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
        description: "Calling is unlocked at level 10. Keep engaging to level up!",
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
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={conversation.user.image} />
          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <h2 className="font-medium">{conversation.user.name}</h2>
            {conversation.user.online && (
              <Badge variant="outline" className="ml-2 bg-green-500 border-green-500 text-white text-xs py-0">
                Online
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {conversation.user.online ? "Active now" : conversation.user.lastActive}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleCallAttempt}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCallAttempt}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "them" && (
              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                <AvatarImage src={conversation.user.image} />
                <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-[75%] flex flex-col">
              <Card
                className={`p-3 ${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                <p>{message.content}</p>
              </Card>
              <span className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-card">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Image className="h-5 w-5" />
          </Button>
          <Textarea
            placeholder="Type a message..."
            className="min-h-10 resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Button size="icon" className="flex-shrink-0" onClick={sendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}