"use server"

import { getSessionUser, requireAuth } from "@/lib/neonDB/auth-server";

export async function updateProfileAction(prevState: any, formData: FormData) {
  return { success: true };
}
