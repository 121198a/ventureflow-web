import type { Metadata } from "next";
import { AuthLayout } from "@/components/site/auth-layout";
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password? | UBverse by UnBound X",
  description:
    "We'll send you a 4-digit verification code to confirm your identity and help you set a new password.",
};

export default function InvestorForgotPage() {
  return (
    <AuthLayout
      role="investor"
      title="Forgot Password?"
      subtitle="We'll send you a 4-digit verification code to confirm your identity and help you set a new password."
      switchPrompt="Remember your password?"
      switchLinkText="Back to Login"
      switchLinkHref="/investor/login"
    >
      <ForgotPasswordForm role="investor" />
    </AuthLayout>
  );
}
