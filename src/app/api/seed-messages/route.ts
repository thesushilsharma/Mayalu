import { NextResponse } from "next/server";
import { seedMessages } from "@/lib/firebase/seed-messages";

export async function POST() {
  try {
    const result = await seedMessages();
    
    if (result.success) {
      return NextResponse.json({ 
        message: "Messages seeded successfully" 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        error: "Failed to seed messages" 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
