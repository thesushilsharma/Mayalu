import { randomUUID } from "crypto";
import { type User } from "./messages";
import {
  checkMessagesTableExists,
  seedMessagesTx,
} from "@/lib/neonDB/queries";

const users: User[] = [
  {
    name: "Sarah Johnson",
    image: "https://api.dicebear.com/10.x/initial-face/svg?seed=SarahJohnson",
    uid: "user1",
  },
  {
    name: "Michael Chen",
    image: "https://api.dicebear.com/10.x/initial-face/svg?seed=MichaelChen",
    uid: "user2",
  },
  {
    name: "Emily Turner",
    image: "https://api.dicebear.com/10.x/initial-face/svg?seed=EmilyTurner",
    uid: "user3",
  },
  {
    name: "David Kim",
    image: "https://api.dicebear.com/10.x/initial-face/svg?seed=DavidKim",
    uid: "user4",
  },
];

export async function seedMessages() {
  try {
    const exists = await checkMessagesTableExists();
    if (!exists) {
      throw new Error(
        "Messages table does not exist. Please run the database setup."
      );
    }

    const messagesToSeed = [
      {
        id: randomUUID(),
        senderId: users[0].uid || "user1",
        recipientId: users[1].uid || "user2",
        content: "Hey, how are you doing today?",
      },
      {
        id: randomUUID(),
        senderId: users[2].uid || "user3",
        recipientId: users[3].uid || "user4",
        content: "Would you like to meet for coffee this weekend?",
      },
      {
        id: randomUUID(),
        senderId: users[1].uid || "user2",
        recipientId: users[0].uid || "user1",
        content: "Thanks for the recommendation!",
      },
    ];

    const success = await seedMessagesTx(messagesToSeed);
    if (!success) {
      throw new Error("Transaction failed to seed messages");
    }

    console.log("✅ Messages seeded successfully to Neon using transaction!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error seeding messages:", error);
    return { success: false, error };
  }
}
