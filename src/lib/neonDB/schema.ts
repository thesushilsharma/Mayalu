import {
  pgTable,
  pgSchema,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ==========================================================================
 * 1. DRIZZLE ORM SCHEMAS
 * ========================================================================== */

// Schema for Neon Auth managed tables
export const neonAuthSchema = pgSchema("neon_auth");

export const neonAuthUsers = neonAuthSchema.table("user", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  image: text("image"),
  emailVerified: boolean("emailVerified"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const neonAuthSessions = neonAuthSchema.table("session", {
  id: text("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => neonAuthUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt", { withTimezone: true }),
  token: text("token"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
});

// Tables in public schema
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => neonAuthUsers.id, { onDelete: "cascade" }),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  firstName: text("first_name"),
  birthdate: text("birthdate"),
  age: integer("age"),
  gender: text("gender"),
  interestedIn: text("interested_in"),
  location: text("location"),
  relationshipIntent: text("relationship_intent"),
  dalBhatFrequency: text("dal_bhat_frequency"),
  musicRepeat: text("music_repeat"),
  greenFlag: text("green_flag"),
  occupation: text("occupation"),
  bio: text("bio"),
  height: text("height"),
  education: text("education"),
  interests: text("interests").array(),
  promptAnswers: jsonb("prompt_answers").$type<Record<string, string>>(),
  speedRound: jsonb("speed_round").$type<{
    drinking?: string;
    smoking?: string;
    kids?: string;
    [key: string]: string | undefined;
  }>(),
  privateCorner: jsonb("private_corner").$type<{
    caste?: string;
    religion?: string;
    dietary?: string;
    familyNotes?: string;
    chiyaPreference?: string;
    astrologyOpenness?: string;
    familyVibe?: string;
    verificationSelfie?: string;
    verificationStatus?: string;
    genderChangedAt?: string;
    previousGender?: string;
    [key: string]: any;
  }>(),
  dealbreakers: jsonb("dealbreakers").$type<{
    ageRangeMin?: number;
    ageRangeMax?: number;
    distance?: string;
    [key: string]: any;
  }>(),
  profilePhoto: text("profile_photo"),
  additionalPhotos: text("additional_photos").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  senderId: varchar("sender_id", { length: 36 }).notNull(),
  recipientId: varchar("recipient_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

/* ==========================================================================
 * 2. DRIZZLE RELATIONS
 * ========================================================================== */

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(neonAuthUsers, {
    fields: [userProfiles.userId],
    references: [neonAuthUsers.id],
  }),
}));

export const neonAuthUsersRelations = relations(neonAuthUsers, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [neonAuthUsers.id],
    references: [userProfiles.userId],
  }),
  sessions: many(neonAuthSessions),
}));

/* ==========================================================================
 * 3. ZOD VALIDATION SCHEMAS (drizzle-zod + custom Zod)
 * ========================================================================== */

export const selectUserProfileSchema = createSelectSchema(userProfiles);
export const insertUserProfileSchema = createInsertSchema(userProfiles);

export const selectNeonAuthUserSchema = createSelectSchema(neonAuthUsers);
export const insertNeonAuthUserSchema = createInsertSchema(neonAuthUsers);

export const selectNeonAuthSessionSchema = createSelectSchema(neonAuthSessions);
export const insertNeonAuthSessionSchema = createInsertSchema(neonAuthSessions);

export const selectMessageSchema = createSelectSchema(messages);
export const insertMessageSchema = createInsertSchema(messages);

// Custom Onboarding Zod Schema for input validation & mutations
export const saveOnboardingProfileInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  birthdate: z.string().nullable().optional(),
  age: z.number().int().min(18).max(120).nullable().optional(),
  gender: z.string().nullable().optional(),
  interestedIn: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  relationshipIntent: z.string().nullable().optional(),
  dalBhatFrequency: z.string().nullable().optional(),
  musicRepeat: z.string().nullable().optional(),
  greenFlag: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  interests: z.array(z.string()).optional(),
  promptAnswers: z.record(z.string(), z.string()).optional(),
  speedRound: z
    .object({
      drinking: z.string().optional(),
      smoking: z.string().optional(),
      kids: z.string().optional(),
    })
    .catchall(z.string().optional())
    .optional(),
  privateCorner: z
    .object({
      caste: z.string().optional(),
      religion: z.string().optional(),
      dietary: z.string().optional(),
      familyNotes: z.string().optional(),
      chiyaPreference: z.string().optional(),
      astrologyOpenness: z.string().optional(),
      familyVibe: z.string().optional(),
      verificationSelfie: z.string().optional(),
      verificationStatus: z.string().optional(),
      genderChangedAt: z.string().optional(),
      previousGender: z.string().optional(),
    })
    .catchall(z.any())
    .optional(),
  dealbreakers: z
    .object({
      ageRangeMin: z.number().optional(),
      ageRangeMax: z.number().optional(),
      distance: z.string().optional(),
    })
    .catchall(z.any())
    .optional(),
  profilePhoto: z.string().nullable().optional(),
  additionalPhotos: z.array(z.string()).optional(),
});
