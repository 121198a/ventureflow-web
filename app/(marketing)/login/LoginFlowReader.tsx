"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/site/signup-form";
import { LoginForm } from "@/components/site/login-form";

export function LoginFlowReader() {
  const params = useSearchParams();
  const flow = params.get("flow") === "login" ? "login" : "signup";
  const role = params.get("role") === "investor" ? "investor" : "founder";

  if (flow === "signup") {
    return role === "founder" ? (
      <AuthLayout
        role="founder"
        mode="signup"
        title="Apply as a Founder"
        subtitle="Complete your founder application to access investors and launch your raise."
        switchPrompt="Already have an account on UnBound X?"
        switchLinkText="Login here"
        switchLinkHref="/issuer/login"
      >
        <SignupForm role="founder" />
      </AuthLayout>
    ) : (
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

  return role === "founder" ? (
    <AuthLayout
      role="founder"
      mode="login"
      title="Founder Login"
      subtitle="Access your fundraising dashboard to manage your deal, track investors, and monitor fundraising progress."
      belowSubtitle={
        <Link
          href="/login?flow=login&role=investor"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Switch to Investor Login &rarr;
        </Link>
      }
    >
      <LoginForm role="founder" />
    </AuthLayout>
  ) : (
    <AuthLayout
      role="investor"
      mode="login"
      title="Investor Login"
      subtitle="Your gateway to exclusive investment opportunities."
      belowSubtitle={
        <Link
          href="/login?flow=login&role=founder"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Switch to Founder Login &rarr;
        </Link>
      }
    >
      <LoginForm role="investor" />
    </AuthLayout>
  );
}
