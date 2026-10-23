import "server-only";

import {
  query,
  queryTransactions,
  withTransaction,
  getSql,
  pool,
  db,
  schema,
  type QueryOptions,
} from "./db";

import {
  saveOnboardingProfileInputSchema,
  selectUserProfileSchema,
  selectNeonAuthUserSchema,
  selectMessageSchema,
} from "./schema";

import type {
  UserProfile,
  UserProfileWithAuth,
  NeonAuthUser,
  VerificationCandidate,
  Message,
  SaveOnboardingProfileInput,
  MessageAggregates,
  UserProfileOrAuthFallback,
  CandidateProfile,
} from "./types";

// Re-export pool, drizzle db, schema, and query primitives
export { query, queryTransactions, withTransaction, getSql, pool, db, schema };

// Re-export Zod validation schemas
export {
  saveOnboardingProfileInputSchema,
  selectUserProfileSchema,
  selectNeonAuthUserSchema,
  selectMessageSchema,
};

/* ==========================================================================
 * TYPES & BACKWARD-COMPATIBLE ALIASES
 * ========================================================================== */

export type UserProfileRow = UserProfile;
export type UserProfileWithAuthRow = UserProfileWithAuth;
export type NeonAuthUserRow = NeonAuthUser;
export type VerificationCandidateRow = VerificationCandidate;
export type MessageRow = Message;
export type { SaveOnboardingProfileInput, MessageAggregates, UserProfileOrAuthFallback };

/* ==========================================================================
 * 1. USER PROFILES & ONBOARDING QUERIES (public.user_profiles)
 * ========================================================================== */

/**
 * Fetch raw user profile from public.user_profiles by user_id.
 */
export async function findUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  const rows = await query<UserProfile>({
    query: `
      SELECT *
      FROM public.user_profiles
      WHERE user_id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });
  return rows[0] || null;
}

/**
 * Fetch complete user profile joined with neon_auth."user" by user_id.
 */
export async function findFullUserProfileWithAuth(
  userId: string
): Promise<UserProfileWithAuth | null> {
  const rows = await query<UserProfileWithAuth>({
    query: `
      SELECT 
        p.*,
        u.email,
        u.name AS auth_name,
        u.image AS auth_image,
        u.role AS auth_role,
        u."emailVerified" AS auth_email_verified,
        u.banned AS auth_banned
      FROM public.user_profiles p
      JOIN neon_auth."user" u ON p.user_id = u.id
      WHERE p.user_id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });
  return rows[0] || null;
}

/**
 * Fetch profile with fallback to auth user if profile doesn't exist yet (used by profile page).
 */
export async function findUserProfileOrAuthFallback(
  userId: string
): Promise<UserProfileOrAuthFallback> {
  const profileRows = await query<UserProfile & { auth_name: string | null; auth_image: string | null }>({
    query: `
      SELECT 
        p.*,
        u.name as auth_name,
        u.image as auth_image
      FROM public.user_profiles p
      LEFT JOIN neon_auth."user" u ON u.id = p.user_id
      WHERE p.user_id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });

  if (profileRows.length > 0) {
    return { profile: profileRows[0], authUser: null };
  }

  // Fallback to neon_auth."user"
  const userRows = await query<NeonAuthUser>({
    query: `
      SELECT id, email, name, image, "emailVerified", role, banned, "createdAt", "updatedAt"
      FROM neon_auth."user"
      WHERE id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });

  return { profile: null, authUser: userRows[0] || null };
}

/**
 * Fetch onboarding completion status and profile summary for user.
 */
export async function findUserOnboardingStatus(
  userId: string
): Promise<UserProfile | null> {
  const rows = await query<UserProfile>({
    query: `
      SELECT 
        user_id,
        onboarding_completed,
        first_name,
        birthdate,
        age,
        gender,
        interested_in,
        location,
        relationship_intent,
        dal_bhat_frequency,
        music_repeat,
        green_flag,
        occupation,
        bio,
        height,
        education,
        interests,
        prompt_answers,
        speed_round,
        private_corner,
        dealbreakers,
        profile_photo,
        additional_photos,
        created_at,
        updated_at
      FROM public.user_profiles
      WHERE user_id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });
  return rows[0] || null;
}

/**
 * Checks whether user has marked onboarding as completed.
 */
export async function isUserOnboarded(userId: string): Promise<boolean> {
  const rows = await query<{ onboarding_completed: boolean }>({
    query: `
      SELECT onboarding_completed
      FROM public.user_profiles
      WHERE user_id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });
  return Boolean(rows[0]?.onboarding_completed);
}

/**
 * Save / Upsert onboarding profile in public.user_profiles and synchronize
 * first_name and profile_photo into neon_auth."user" within an atomic transaction.
 * Validates input against saveOnboardingProfileInputSchema.
 */
export async function saveOnboardingProfileTx(
  userId: string,
  inputData: SaveOnboardingProfileInput
): Promise<UserProfile> {
  // Validate input via Zod schema
  const data = saveOnboardingProfileInputSchema.parse(inputData);

  return withTransaction(async (connQuery) => {
    // 1. Check existing profile for gender change verification trigger
    const existing = await connQuery<{ gender: string | null; private_corner: any }>({
      query: `
        SELECT gender, private_corner
        FROM public.user_profiles
        WHERE user_id = $1::uuid
        LIMIT 1
      `,
      values: [userId],
    });

    const oldGender = existing[0]?.gender;
    const newGender = data.gender;
    const isGenderChange = Boolean(
      oldGender &&
      newGender &&
      oldGender.trim().toLowerCase() !== newGender.trim().toLowerCase()
    );

    if (isGenderChange) {
      const newSelfie = data.privateCorner?.verificationSelfie?.trim();
      if (!newSelfie) {
        throw new Error(
          "Gender change detected: You must upload a fresh verification selfie so Maya can verify your identity."
        );
      }
      if (!data.privateCorner) {
        data.privateCorner = {};
      }
      data.privateCorner.verificationStatus = "pending_review";
      data.privateCorner.genderChangedAt = new Date().toISOString();
      data.privateCorner.previousGender = oldGender || undefined;
    }

    const interestsVal = Array.isArray(data.interests) ? data.interests : [];
    const promptAnswersVal = JSON.stringify(data.promptAnswers || {});
    const speedRoundVal = JSON.stringify(data.speedRound || {});
    const privateCornerVal = JSON.stringify(data.privateCorner || {});
    const dealbreakersVal = JSON.stringify(data.dealbreakers || {});
    const additionalPhotosVal = Array.isArray(data.additionalPhotos)
      ? data.additionalPhotos
      : [];

    // 2. Perform the upsert into public.user_profiles
    const upsertRows = await connQuery<UserProfile>({
      query: `
        INSERT INTO public.user_profiles (
          user_id,
          onboarding_completed,
          first_name,
          birthdate,
          age,
          gender,
          interested_in,
          location,
          relationship_intent,
          dal_bhat_frequency,
          music_repeat,
          green_flag,
          occupation,
          bio,
          height,
          education,
          interests,
          prompt_answers,
          speed_round,
          private_corner,
          dealbreakers,
          profile_photo,
          additional_photos,
          updated_at
        ) VALUES (
          $1::uuid,
          true,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17::jsonb,
          $18::jsonb,
          $19::jsonb,
          $20::jsonb,
          $21,
          $22,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          onboarding_completed = true,
          first_name = EXCLUDED.first_name,
          birthdate = EXCLUDED.birthdate,
          age = EXCLUDED.age,
          gender = EXCLUDED.gender,
          interested_in = EXCLUDED.interested_in,
          location = EXCLUDED.location,
          relationship_intent = EXCLUDED.relationship_intent,
          dal_bhat_frequency = EXCLUDED.dal_bhat_frequency,
          music_repeat = EXCLUDED.music_repeat,
          green_flag = EXCLUDED.green_flag,
          occupation = EXCLUDED.occupation,
          bio = EXCLUDED.bio,
          height = EXCLUDED.height,
          education = EXCLUDED.education,
          interests = EXCLUDED.interests,
          prompt_answers = EXCLUDED.prompt_answers,
          speed_round = EXCLUDED.speed_round,
          private_corner = EXCLUDED.private_corner,
          dealbreakers = EXCLUDED.dealbreakers,
          profile_photo = EXCLUDED.profile_photo,
          additional_photos = EXCLUDED.additional_photos,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `,
      values: [
        userId,
        data.firstName || null,
        data.birthdate || null,
        data.age ?? null,
        data.gender || null,
        data.interestedIn || null,
        data.location || null,
        data.relationshipIntent || null,
        data.dalBhatFrequency || null,
        data.musicRepeat || null,
        data.greenFlag || null,
        data.occupation || null,
        data.bio || null,
        data.height || null,
        data.education || null,
        interestsVal,
        promptAnswersVal,
        speedRoundVal,
        privateCornerVal,
        dealbreakersVal,
        data.profilePhoto || null,
        additionalPhotosVal,
      ],
    });

    const savedProfile = upsertRows[0];

    // 3. Sync name and image into neon_auth."user"
    if (data.firstName || data.profilePhoto) {
      await connQuery({
        query: `
          UPDATE neon_auth."user"
          SET 
            name = COALESCE($1, name),
            image = COALESCE($2, image),
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $3::uuid
        `,
        values: [data.firstName || null, data.profilePhoto || null, userId],
      });
    }

    return savedProfile;
  });
}

/* ==========================================================================
 * 2. ADMIN & VERIFICATION QUERIES (public.user_profiles & neon_auth."user")
 * ========================================================================== */

/**
 * Fetch candidates for admin selfie verification review.
 */
export async function findVerificationCandidates(
  limit = 100
): Promise<VerificationCandidate[]> {
  return query<VerificationCandidate>({
    query: `
      SELECT 
        u.id AS user_id,
        COALESCE(p.first_name, u.name, 'Candidate') AS name,
        COALESCE(u.email, 'unknown@mayalu.app') AS email,
        p.age,
        p.location,
        p.gender,
        p.profile_photo,
        p.private_corner->>'verificationSelfie' AS verification_selfie,
        COALESCE(p.private_corner->>'verificationStatus', 'unsubmitted') AS verification_status,
        COALESCE(array_length(p.additional_photos, 1), 0) AS additional_photos_count,
        p.bio,
        p.updated_at
      FROM public.user_profiles p
      JOIN neon_auth."user" u ON p.user_id = u.id
      ORDER BY 
        CASE 
          WHEN p.private_corner->>'verificationStatus' = 'pending_review' THEN 1
          WHEN p.private_corner->>'verificationSelfie' IS NOT NULL THEN 2
          ELSE 3
        END,
        p.updated_at DESC
      LIMIT $1
    `,
    values: [limit],
  });
}

/**
 * Admin action: Approve verification selfie.
 */
export async function approveVerificationSelfieQuery(userId: string): Promise<void> {
  await query({
    query: `
      UPDATE public.user_profiles
      SET 
        private_corner = jsonb_set(
          COALESCE(private_corner, '{}'::jsonb), 
          '{verificationStatus}', 
          '"verified"'
        ),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1::uuid
    `,
    values: [userId],
  });
}

/**
 * Admin action: Reject verification selfie and clear image.
 */
export async function rejectVerificationSelfieQuery(userId: string): Promise<void> {
  await query({
    query: `
      UPDATE public.user_profiles
      SET 
        private_corner = jsonb_set(
          jsonb_set(
            COALESCE(private_corner, '{}'::jsonb), 
            '{verificationStatus}', 
            '"rejected"'
          ),
          '{verificationSelfie}',
          '""'
        ),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1::uuid
    `,
    values: [userId],
  });
}

/**
 * Admin action: Update user role in neon_auth."user".
 */
export async function updateAuthUserRoleQuery(
  userId: string,
  newRole: string
): Promise<void> {
  await query({
    query: `
      UPDATE neon_auth."user"
      SET role = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $2::uuid
    `,
    values: [newRole, userId],
  });
}

/**
 * Admin action: Atomically toggle user ban status and immediately revoke
 * active sessions from neon_auth."session" when banned.
 */
export async function toggleUserBanAndRevokeSessionsTx(
  userId: string,
  banned: boolean,
  banReason?: string | null
): Promise<void> {
  await withTransaction(async (connQuery) => {
    await connQuery({
      query: `
        UPDATE neon_auth."user"
        SET 
          banned = $1,
          "banReason" = $2,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $3::uuid
      `,
      values: [
        banned,
        banReason || (banned ? "Violation of community standards" : null),
        userId,
      ],
    });

    if (banned) {
      await connQuery({
        query: `DELETE FROM neon_auth."session" WHERE "userId" = $1::uuid`,
        values: [userId],
      });
    }
  });
}

/* ==========================================================================
 * 3. NEON AUTH & USER MANAGEMENT (neon_auth."user" & neon_auth."session")
 * ========================================================================== */

/**
 * Fetch all users from neon_auth."user" table.
 */
export async function findAllAuthUsers(
  limit = 1000
): Promise<NeonAuthUser[]> {
  return query<NeonAuthUser>({
    query: `
      SELECT 
        id, 
        email, 
        name, 
        image, 
        "emailVerified",
        role,
        banned,
        "createdAt",
        "updatedAt"
      FROM neon_auth."user"
      ORDER BY "createdAt" DESC
      LIMIT $1
    `,
    values: [limit],
  });
}

/**
 * Fetch a single user by ID from neon_auth."user".
 */
export async function findAuthUserById(
  userId: string
): Promise<NeonAuthUser | null> {
  const rows = await query<NeonAuthUser>({
    query: `
      SELECT id, email, name, image, "emailVerified", role, banned, "createdAt", "updatedAt"
      FROM neon_auth."user"
      WHERE id = $1::uuid
      LIMIT 1
    `,
    values: [userId],
  });
  return rows[0] || null;
}

/**
 * Permanently delete a user from neon_auth."user".
 */
export async function deleteAuthUserById(userId: string): Promise<void> {
  await query({
    query: `DELETE FROM neon_auth."user" WHERE id = $1::uuid`,
    values: [userId],
  });
}

/**
 * Auto-promote user to admin in neon_auth."user".
 */
export async function promoteAuthUserToAdmin(userId: string): Promise<void> {
  await query({
    query: `
      UPDATE neon_auth."user"
      SET role = 'admin', "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $1::uuid
    `,
    values: [userId],
  });
}

/**
 * Sync user profile name and image to neon_auth."user".
 */
export async function syncAuthUserInfo(
  userId: string,
  name?: string | null,
  image?: string | null
): Promise<void> {
  await query({
    query: `
      UPDATE neon_auth."user"
      SET 
        name = COALESCE($1, name),
        image = COALESCE($2, image),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $3::uuid
    `,
    values: [name || null, image || null, userId],
  });
}

/* ==========================================================================
 * 4. MESSAGES QUERIES (public.messages)
 * ========================================================================== */

/**
 * Fetch messaging counts and statistics.
 */
export async function getMessageAggregates(): Promise<MessageAggregates> {
  const rows = await query<{
    total: string | number;
    sent: string | number;
    received: string | number;
    unread: string | number;
  }>({
    query: `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'delivered') as sent,
        COUNT(*) FILTER (WHERE status = 'read') as received,
        COUNT(*) FILTER (WHERE status = 'pending') as unread
      FROM messages
    `,
    values: [],
  });

  const stats = rows[0];
  return {
    total: Number(stats?.total) || 0,
    sent: Number(stats?.sent) || 0,
    received: Number(stats?.received) || 0,
    unread: Number(stats?.unread) || 0,
  };
}

/**
 * Fetch recent messages ordered by timestamp descending.
 */
export async function findRecentMessages(limit = 100): Promise<Message[]> {
  return query<Message>({
    query: `
      SELECT id, sender_id, recipient_id, content, status, timestamp
      FROM messages
      ORDER BY timestamp DESC
      LIMIT $1
    `,
    values: [limit],
  });
}

/**
 * Checks if the public messages table exists.
 */
export async function checkMessagesTableExists(): Promise<boolean> {
  const rows = await query<{ table_name: string }>({
    query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'messages'
    `,
    values: [],
  });
  return rows.length > 0;
}

/**
 * Insert a single message into messages table.
 */
export async function insertMessage(
  id: string,
  senderId: string,
  recipientId: string,
  content: string,
  status: "delivered" | "read" | "pending" = "delivered"
): Promise<void> {
  await query({
    query: `
      INSERT INTO messages (id, sender_id, recipient_id, content, status)
      VALUES ($1, $2, $3, $4, $5)
    `,
    values: [id, senderId, recipientId, content, status],
  });
}

/**
 * Seed multiple messages atomically using queryTransactions.
 */
export async function seedMessagesTx(
  messagesList: Array<{
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    status?: "delivered" | "read" | "pending";
  }>
): Promise<boolean> {
  const queries = messagesList.map(
    () => `
      INSERT INTO messages (id, sender_id, recipient_id, content, status)
      VALUES ($1, $2, $3, $4, $5)
    `
  );
  const values = messagesList.map((m) => [
    m.id,
    m.senderId,
    m.recipientId,
    m.content,
    m.status || "delivered",
  ]);

  return queryTransactions({ queries, values });
}

/**
 * Fetch candidate profiles for the Hallway swipe deck.
 * Queries public.user_profiles joined with neon_auth."user".
 * Formats images (profile_photo + additional_photos), Chino attributes, and prompts.
 */
export async function findHallwayCandidateProfiles(
  excludeUserId?: string,
  genderFilter?: string | null,
  limit: number = 50
): Promise<CandidateProfile[]> {
  const rows = await query<{
    user_id: string;
    first_name: string | null;
    auth_name: string | null;
    email: string | null;
    age: number | null;
    gender: string | null;
    location: string | null;
    bio: string | null;
    profile_photo: string | null;
    additional_photos: string[] | null;
    interests: string[] | null;
    occupation: string | null;
    education: string | null;
    dal_bhat_frequency: string | null;
    music_repeat: string | null;
    relationship_intent: string | null;
    private_corner: any;
    prompt_answers: any;
    emailVerified: boolean | null;
  }>({
    query: `
      SELECT 
        p.user_id,
        p.first_name,
        u.name AS auth_name,
        u.email,
        p.age,
        p.gender,
        p.location,
        p.bio,
        p.profile_photo,
        p.additional_photos,
        p.interests,
        p.occupation,
        p.education,
        p.dal_bhat_frequency,
        p.music_repeat,
        p.relationship_intent,
        p.private_corner,
        p.prompt_answers,
        u."emailVerified"
      FROM public.user_profiles p
      JOIN neon_auth."user" u ON p.user_id = u.id
      WHERE p.onboarding_completed = true
        AND (u.banned IS NOT TRUE)
        AND ($1::uuid IS NULL OR p.user_id <> $1::uuid)
        AND (
          $2::text IS NULL 
          OR $2 = 'All' 
          OR LOWER(p.gender) = LOWER($2)
          OR ($2 = 'Female' AND LOWER(p.gender) LIKE '%female%')
          OR ($2 = 'Male' AND LOWER(p.gender) LIKE '%male%' AND LOWER(p.gender) NOT LIKE '%female%')
        )
      ORDER BY p.updated_at DESC
      LIMIT $3
    `,
    values: [excludeUserId || null, genderFilter || null, limit],
  });

  return rows.map((r, idx) => {
    const privateCorner =
      (typeof r.private_corner === "string"
        ? JSON.parse(r.private_corner)
        : r.private_corner) || {};
    const promptAnswers =
      (typeof r.prompt_answers === "string"
        ? JSON.parse(r.prompt_answers)
        : r.prompt_answers) || {};
    const promptEntries = Object.entries(promptAnswers);

    // Dhukuti showcase photos + main profile photo
    const additional = Array.isArray(r.additional_photos)
      ? r.additional_photos
      : [];
    const images: string[] = [r.profile_photo, ...additional].filter(
      (img): img is string => typeof img === "string" && img.length > 0
    );

    // Fallback if no images found
    if (images.length === 0) {
      images.push(
        `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
          r.first_name || r.auth_name || "Mayalu"
        )}`
      );
    }

    return {
      id: r.user_id,
      name: r.first_name || r.auth_name || "Mayalu Member",
      age: r.age || 25,
      gender: r.gender || undefined,
      location: r.location || "Nepal",
      bio: r.bio || "",
      images,
      interests: Array.isArray(r.interests) ? r.interests : [],
      occupation: r.occupation || undefined,
      education: r.education || undefined,
      distance: (idx % 12) + 3,
      verified: Boolean(
        r.emailVerified || privateCorner.verificationStatus === "verified"
      ),
      dalBhatFrequency: r.dal_bhat_frequency || undefined,
      musicRepeat: r.music_repeat || undefined,
      gotra: privateCorner.gotra || undefined,
      caste: privateCorner.caste || undefined,
      relationshipIntent: r.relationship_intent || undefined,
      dietary: privateCorner.dietary || undefined,
      promptQuestion: promptEntries[0]?.[0] as string | undefined,
      promptAnswer: promptEntries[0]?.[1] as string | undefined,
    };
  });
}

