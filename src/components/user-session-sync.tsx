import { verifySession } from "@/lib/auth/dal";
import { getFullUserProfile } from "@/lib/neonDB/onboarding-actions";
import { UserContextSyncClient } from "./user-context-sync-client";

/**
 * Server Component streamed under <Suspense fallback={null}> in the account layout.
 * Dynamically queries the session and Postgres profile without blocking the static shell prerender.
 */
export async function UserSessionSync() {
  try {
    const { isAuth, user, role } = await verifySession();
    if (!isAuth || !user) {
      return null;
    }

    const profile = await getFullUserProfile(user.id);

    return (
      <UserContextSyncClient
        user={user}
        profile={profile}
        role={role}
      />
    );
  } catch (error) {
    console.error("Error in UserSessionSync:", error);
    return null;
  }
}
