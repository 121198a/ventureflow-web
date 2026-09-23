import type { Metadata } from "next";
import { AuthLayout } from "@/components/site/auth-layout";
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export const metadata: Metadata = {
  title: "Create a new password | UBverse by UnBound X",
  description: "Set a password for your account.",
};

export default function FounderForgotPage() {
  return (
    <AuthLayout
      role="founder"
      title="Create a new password"
      subtitle="Set a password for your account"
      description="Create a password with at least 8 characters, using an uppercase, lowercase, number, and symbol."
      switchPrompt="Remember your password?"
      switchLinkText="Back to Login"
      switchLinkHref="/issuer/login"
    >
      <ForgotPasswordForm role="founder" />
    </AuthLayout>
  );
}
