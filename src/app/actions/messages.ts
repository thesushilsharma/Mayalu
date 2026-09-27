"use server";

import { neon } from "@neondatabase/serverless";

export async function fetchMessagesAction() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const messages = await sql`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100`;
    
    // Convert to proper types for the client
    return messages.map(msg => ({
      id: msg.id,
      sender: { name: msg.sender_id, image: "", uid: msg.sender_id }, // Normally join with users
      recipient: { name: msg.recipient_id, image: "", uid: msg.recipient_id },
      content: msg.content,
      status: msg.status,
      timestamp: msg.timestamp
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
