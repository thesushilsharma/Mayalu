import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding • Kura-Kani with Maya | Mayalu",
  description:
    "Begin your authentic Nepali matchmaking onboarding journey with Maya on Mayalu.",
};

export default function RootOnboardingPage() {
  redirect("/account/onboarding");
}
