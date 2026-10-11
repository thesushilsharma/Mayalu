import type { Metadata } from "next";
import OnboardingComponent from "@/components/onboarding";

export const metadata: Metadata = {
  title: "Kura-Kani Onboarding | Mayalu Matchmaking",
  description:
    "Craft your authentic Nepali Chino with Maya, your personal matchmaker.",
};

export default function OnboardingPage() {
  return <OnboardingComponent />;
}
