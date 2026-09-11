import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/site/signup-form";

export const metadata: Metadata = {
  title: "Let's Get Started | UBverse",
  description: "Enter your email and create a secure password to begin.",
};

export default function InvestorSignup() {
  return (
    <AuthLayout
      title="Let's Get Started"
      subtitle="We will guide you through a few quick steps to setup your account."
      belowSubtitle={
        <p className="text-[0.9rem] text-ink/70">
          Enter your email and create a secure password to begin. You&apos;ll finish setting up your
          profile in the next steps.
          <br />
          <br />
          Already have an account on UnBound X?{" "}
          <Link href="/investor/login" className="text-brand underline">
            Login here
          </Link>
        </p>
      }
    >
      <SignupForm role="investor" />
    </AuthLayout>
  );
}
