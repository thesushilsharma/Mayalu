import { neon } from "@neondatabase/serverless";
import { type User } from "./messages";

const users: User[] = [
  {
    name: "Sarah Johnson",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    uid: "user1",
  },
  {
    name: "Michael Chen",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
    uid: "user2",
  },
  {
    name: "Emily Turner",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    uid: "user3",
  },
  {
    name: "David Kim",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    uid: "user4",
  },
];

export async function seedMessages() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if table exists
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages'`;
    if (tables.length === 0) {
      throw new Error("Messages table does not exist. Please run the database setup.");
    }
    
    const crypto = require("crypto");
    
    const createMessage = async (sender: User, recipient: User, content: string) => {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO messages (id, sender_id, recipient_id, content, status)
        VALUES (${id}, ${sender.uid}, ${recipient.uid}, ${content}, 'delivered')
      `;
    };

    await createMessage(users[0], users[1], "Hey, how are you doing today?");
    await createMessage(users[2], users[3], "Would you like to meet for coffee this weekend?");
    await createMessage(users[1], users[0], "Thanks for the recommendation!");
    
    console.log("✅ Messages seeded successfully to Neon!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error seeding messages:", error);
    return { success: false, error };
  }
}
