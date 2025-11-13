// Run this script once to seed your Firestore with test messages
// You can call this from a page or API route

import { addMessage, type User } from "./messages";

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
    await addMessage(users[0], users[1], "Hey, how are you doing today?");
    await addMessage(users[2], users[3], "Would you like to meet for coffee this weekend?");
    await addMessage(users[1], users[0], "Thanks for the recommendation!");
    
    console.log("✅ Messages seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error seeding messages:", error);
    return { success: false, error };
  }
}
