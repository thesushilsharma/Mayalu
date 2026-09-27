import { fetchMessagesAction } from "@/app/actions/messages";

export type MessageStatus = "delivered" | "read" | "pending";

export interface User {
  name: string;
  image: string;
  uid?: string;
}

export interface Message {
  id: string;
  sender: User;
  recipient: User;
  content: string;
  status: MessageStatus;
  timestamp: Date;
}

export function subscribeToMessages(
  onUpdate: (messages: Message[]) => void,
  onError: (error: Error) => void
) {
  // Fetch immediately
  fetchMessagesAction()
    .then(data => onUpdate(data as Message[]))
    .catch(err => onError(err));

  // Poll for updates every 5 seconds as a simple replacement for real-time
  const interval = setInterval(() => {
    fetchMessagesAction()
      .then(data => onUpdate(data as Message[]))
      .catch(err => console.error("Poll error:", err));
  }, 5000);

  return () => clearInterval(interval);
}

export async function addMessage(
  sender: User,
  recipient: User,
  content: string
): Promise<string> {
  // Mock add message for client (implement server action if needed)
  return "mock-id";
}

export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Promise<void> {
  // Mock update message status
}
