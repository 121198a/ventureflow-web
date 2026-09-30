import type { Metadata } from "next";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/site/signup-form";

export const metadata: Metadata = {
  title: "Apply as a Founder | VentureFlow by Veyron X",
  description: "Complete your founder application to access investors and launch your raise.",
};

export default function FounderSignupPage() {
  return (
    <AuthLayout
      role="founder"
      mode="signup"
      title="Apply as a Founder"
      subtitle="Complete your founder application to access investors and launch your raise."
      switchPrompt="Already have an account on VentureFlow?"
      switchLinkText="Login here"
      switchLinkHref="/issuer/login"
    >
      <SignupForm role="founder" />
    </AuthLayout>
  );
}
