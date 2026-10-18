import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { z } from "zod";
import type {
  userProfiles,
  neonAuthUsers,
  neonAuthSessions,
  messages,
  selectUserProfileSchema,
  insertUserProfileSchema,
  selectNeonAuthUserSchema,
  insertNeonAuthUserSchema,
  selectNeonAuthSessionSchema,
  insertNeonAuthSessionSchema,
  selectMessageSchema,
  insertMessageSchema,
  saveOnboardingProfileInputSchema,
} from "./schema";

/* ==========================================================================
 * 1. DRIZZLE INFERRED MODEL TYPES
 * ========================================================================== */

/** Full select model for public.user_profiles */
export type UserProfile = InferSelectModel<typeof userProfiles>;

/** Insert model for public.user_profiles */
export type NewUserProfile = InferInsertModel<typeof userProfiles>;

/** Full select model for neon_auth."user" */
export type NeonAuthUser = InferSelectModel<typeof neonAuthUsers>;

/** Insert model for neon_auth."user" */
export type NewNeonAuthUser = InferInsertModel<typeof neonAuthUsers>;

/** Full select model for neon_auth."session" */
export type NeonAuthSession = InferSelectModel<typeof neonAuthSessions>;

/** Insert model for neon_auth."session" */
export type NewNeonAuthSession = InferInsertModel<typeof neonAuthSessions>;

/** Full select model for public.messages */
export type Message = InferSelectModel<typeof messages> & {
  sender_id?: string;
  recipient_id?: string;
};

/** Insert model for public.messages */
export type NewMessage = InferInsertModel<typeof messages>;

/* ==========================================================================
 * 2. ZOD INFERRED TYPES
 * ========================================================================== */

export type UserProfileSelect = z.infer<typeof selectUserProfileSchema>;
export type UserProfileInsert = z.infer<typeof insertUserProfileSchema>;

export type NeonAuthUserSelect = z.infer<typeof selectNeonAuthUserSchema>;
export type NeonAuthUserInsert = z.infer<typeof insertNeonAuthUserSchema>;

export type NeonAuthSessionSelect = z.infer<typeof selectNeonAuthSessionSchema>;
export type NeonAuthSessionInsert = z.infer<typeof insertNeonAuthSessionSchema>;

export type MessageSelect = z.infer<typeof selectMessageSchema>;
export type MessageInsert = z.infer<typeof insertMessageSchema>;

export type SaveOnboardingProfileInput = z.infer<typeof saveOnboardingProfileInputSchema>;

/* ==========================================================================
 * 3. COMPOSITE & QUERY PROJECTION TYPES
 * ========================================================================== */

/**
 * Composite profile row when joined with neon_auth."user"
 */
export interface UserProfileWithAuth extends UserProfile {
  email: string | null;
  auth_name: string | null;
  auth_image: string | null;
  auth_role: string | null;
  auth_email_verified: boolean | null;
  auth_banned: boolean | null;
}

/**
 * Profile and Auth user fallback structure
 */
export interface UserProfileOrAuthFallback {
  profile: (UserProfile & { auth_name?: string | null; auth_image?: string | null }) | null;
  authUser: NeonAuthUser | null;
}

/**
 * Verification candidate for admin moderation
 */
export interface VerificationCandidate {
  user_id: string;
  name: string;
  email: string;
  age: number | null;
  location: string | null;
  gender: string | null;
  profile_photo: string | null;
  verification_selfie: string | null;
  verification_status: "pending_review" | "verified" | "rejected" | "unsubmitted" | string;
  additional_photos_count: number;
  bio: string | null;
  updated_at: string | Date | null;
}

/**
 * Message status statistics
 */
export interface MessageAggregates {
  total: number;
  sent: number;
  received: number;
  unread: number;
}

/**
 * Seed message item for batch insertion
 */
export interface SeedMessageItem {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  status?: "delivered" | "read" | "pending";
}

/* ==========================================================================
 * 4. RAW & TRANSACTION QUERY OPTIONS
 * ========================================================================== */

export interface QueryOptions {
  query: string;
  values?: any[];
}

export interface QueryTransactionsOptions {
  queries: string[];
  values?: any[][];
}

export type ConnQueryFunction = <R = any>(options: QueryOptions) => Promise<R[]>;
