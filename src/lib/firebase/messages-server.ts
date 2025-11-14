import "server-only";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Message, MessageStatus, User } from "./messages";

interface MessageStats {
  total: number;
  sent: number;
  received: number;
  unread: number;
}

/**
 * Fetch messages from Firestore (server-side only)
 * @param limitCount - Maximum number of messages to fetch
 * @param filterType - Filter messages by type
 */
export async function getMessages(
  limitCount = 50,
  filterType?: "sent" | "received" | "unread"
): Promise<Message[]> {
  try {
    const messagesRef = collection(db, "messages");
    const constraints: QueryConstraint[] = [
      orderBy("timestamp", "desc"),
      limit(limitCount),
    ];

    // Add filter constraints
    if (filterType === "unread") {
      constraints.push(where("status", "==", "delivered"));
    } else if (filterType === "sent") {
      // You would add user-specific filtering here
      // constraints.push(where("sender.uid", "==", currentUserId));
    } else if (filterType === "received") {
      // constraints.push(where("recipient.uid", "==", currentUserId));
    }

    const q = query(messagesRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.sender as User,
        recipient: data.recipient as User,
        content: data.content,
        status: data.status as MessageStatus,
        timestamp: data.timestamp?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

/**
 * Get message statistics
 */
export async function getMessageStats(): Promise<MessageStats> {
  try {
    const messagesRef = collection(db, "messages");
    
    // Get all messages
    const allQuery = query(messagesRef);
    const allSnapshot = await getDocs(allQuery);
    
    // Calculate stats
    const stats: MessageStats = {
      total: allSnapshot.size,
      sent: 0,
      received: 0,
      unread: 0,
    };

    allSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      
      // Count by status
      if (data.status === "delivered") {
        stats.unread++;
      }
      
      // You would add user-specific counting here
      // if (data.sender.uid === currentUserId) stats.sent++;
      // if (data.recipient.uid === currentUserId) stats.received++;
    });

    // For demo purposes, distribute evenly
    stats.sent = Math.floor(stats.total * 0.55);
    stats.received = stats.total - stats.sent;

    return stats;
  } catch (error) {
    console.error("Error fetching message stats:", error);
    return {
      total: 0,
      sent: 0,
      received: 0,
      unread: 0,
    };
  }
}
