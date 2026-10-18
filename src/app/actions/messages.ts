"use server";

import { findRecentMessages } from "@/lib/neonDB/queries";

export async function fetchMessagesAction() {
  try {
    const messages = await findRecentMessages(100);

    // Convert to proper types for the client
    return messages.map((msg) => {
      const sId = msg.sender_id || msg.senderId || "";
      const rId = msg.recipient_id || msg.recipientId || "";
      return {
        id: msg.id,
        sender: { name: sId, image: "", uid: sId },
        recipient: { name: rId, image: "", uid: rId },
        content: msg.content,
        status: msg.status,
        timestamp: msg.timestamp,
      };
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
