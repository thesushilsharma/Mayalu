import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  type Timestamp,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

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

interface FirestoreMessage {
  sender: User;
  recipient: User;
  content: string;
  status: MessageStatus;
  timestamp: Timestamp;
}

// Convert Firestore document to Message type
function convertFirestoreMessage(id: string, data: DocumentData): Message {
  return {
    id,
    sender: data.sender,
    recipient: data.recipient,
    content: data.content,
    status: data.status,
    timestamp: data.timestamp?.toDate() || new Date(),
  };
}

// Subscribe to real-time messages
export function subscribeToMessages(
  onUpdate: (messages: Message[]) => void,
  onError: (error: Error) => void
) {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot) => {
      const messages = snapshot.docs.map((doc) =>
        convertFirestoreMessage(doc.id, doc.data())
      );
      onUpdate(messages);
    },
    (error) => {
      console.error("Error fetching messages:", error);
      onError(error as Error);
    }
  );

  return unsubscribe;
}

// Add a new message
export async function addMessage(
  sender: User,
  recipient: User,
  content: string
): Promise<string> {
  const messagesRef = collection(db, "messages");
  const newMessage = {
    sender,
    recipient,
    content,
    status: "pending" as MessageStatus,
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(messagesRef, newMessage);
  return docRef.id;
}

// Update message status
export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Promise<void> {
  const messageRef = doc(db, "messages", messageId);
  await updateDoc(messageRef, { status });
}
