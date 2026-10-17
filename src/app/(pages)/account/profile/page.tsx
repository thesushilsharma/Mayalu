import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { getFullUserProfile } from "@/lib/neonDB/onboarding-actions";
import { ProfileChinoView } from "@/components/profile-chino-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function ProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
      <Skeleton className="h-28 w-full rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-5 h-[500px] rounded-3xl" />
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

async function ProfileContent() {
  const { isAuth, user, role } = await verifySession();
  if (!isAuth || !user) {
    redirect("/auth/login");
  }

  const profile = await getFullUserProfile(user.id);

  if (!profile || !profile.onboarding_completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[520px] text-center p-6 sm:p-10 max-w-lg mx-auto space-y-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-rose-500/20 shadow-xl shadow-rose-500/5 my-8">
        <div className="relative">
          <div className="size-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-md">
            <Sparkles className="size-10" />
          </div>
          <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
            Weave Your Authentic Chino
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Namaste{user.name ? ` ${user.name}` : ""}! 🙏 You haven't woven your authentic Nepali Chino with Maya yet. Complete onboarding to create your profile and unlock Mayalu matching.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 w-full text-xs text-muted-foreground pt-1">
          <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 text-center space-y-1">
            <span className="text-lg block">🪪</span>
            <span className="font-semibold block text-foreground">1. Chino Card</span>
            <span className="text-[10px] text-muted-foreground">Identity &amp; vibe</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 text-center space-y-1">
            <span className="text-lg block">🔒</span>
            <span className="font-semibold block text-foreground">2. Dhukuti</span>
            <span className="text-[10px] text-muted-foreground">3 photo vault</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 text-center space-y-1">
            <span className="text-lg block">🛡️</span>
            <span className="font-semibold block text-foreground">3. Verified</span>
            <span className="text-[10px] text-muted-foreground">Maya verification</span>
          </div>
        </div>

        <Link href="/account/onboarding" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold gap-2 text-sm shadow-lg shadow-rose-500/25 px-8 h-11 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span>Start Onboarding with Maya</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProfileChinoView
      profile={profile}
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role,
      }}
    />
  );
}

export default function ProfilePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 max-w-7xl mx-auto">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
