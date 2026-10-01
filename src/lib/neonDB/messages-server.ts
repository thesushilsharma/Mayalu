"use server";

import { neon } from "@neondatabase/serverless";

export async function getMessageStats() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // In a real app you would filter by the current user's ID
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'delivered') as sent,
        COUNT(*) FILTER (WHERE status = 'read') as received,
        COUNT(*) FILTER (WHERE status = 'pending') as unread
      FROM messages
    `;

    return {
      total: Number(stats[0].total) || 0,
      sent: Number(stats[0].sent) || 0,
      received: Number(stats[0].received) || 0,
      unread: Number(stats[0].unread) || 0,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest?: string }).digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw error;
    }
    console.error("Error fetching message stats:", error);
    return {
      total: 0,
      sent: 0,
      received: 0,
      unread: 0,
    };
  }
}
