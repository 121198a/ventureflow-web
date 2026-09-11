import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = {
  title: "Investor Login | UBverse",
  description: "Your gateway to exclusive investment opportunities.",
};

export default function InvestorLogin() {
  return (
    <AuthLayout
      title="Investor Login"
      subtitle="Your gateway to exclusive investment opportunities."
      belowSubtitle={
        <Link href="/issuer/login" className="text-[0.9rem] text-brand underline">
          Switch to Founder Login →
        </Link>
      }
    >
      <LoginForm role="investor" />
    </AuthLayout>
  );
}
