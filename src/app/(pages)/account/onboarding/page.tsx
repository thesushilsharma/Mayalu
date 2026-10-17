import type { Metadata } from "next";
import { Suspense } from "react";
import OnboardingComponent from "@/components/onboarding";

export const metadata: Metadata = {
  title: "Kura-Kani Onboarding | Mayalu Matchmaking",
  description:
    "Craft your authentic Nepali Chino with Maya, your personal matchmaker.",
};

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[100dvh] w-full flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Opening Kura-Kani with Maya...</p>
          </div>
        </div>
      }
    >
      <OnboardingComponent />
    </Suspense>
  );
}
