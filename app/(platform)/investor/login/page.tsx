import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = {
  title: "Investor Login | UBverse by UnBound X",
  description: "Your gateway to exclusive investment opportunities.",
};

export default function InvestorLogin() {
  return (
    <AuthLayout
      role="investor"
      mode="login"
      title="Investor Login"
      subtitle="Your gateway to exclusive investment opportunities."
      belowSubtitle={
        <Link
          href="/issuer/login"
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
