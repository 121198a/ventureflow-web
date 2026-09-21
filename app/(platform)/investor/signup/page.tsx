import type { Metadata } from "next";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/site/signup-form";

export const metadata: Metadata = {
  title: "Let's Get Started | UBverse by UnBound X",
  description: "Enter your email and create a secure password to begin. You'll finish setting up your profile in the next steps.",
};

export default function InvestorSignup() {
  return (
    <AuthLayout
      role="investor"
      mode="signup"
      title="Let's Get Started"
      subtitle="We will guide you through a few quick steps to setup your account."
      description="Enter your email and create a secure password to begin. You'll finish setting up your profile in the next steps."
      switchPrompt="Already have an account on UnBound X?"
      switchLinkText="Login here"
      switchLinkHref="/investor/login"
    >
      <SignupForm role="investor" />
    </AuthLayout>
  );
}
