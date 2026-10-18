"use server";

import { getMessageAggregates } from "@/lib/neonDB/queries";

export async function getMessageStats() {
  try {
    return await getMessageAggregates();
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
