import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = {
  title: "Founder Login | UBverse by UnBound X",
  description: "Access your fundraising dashboard to manage your deal, track investors, and monitor fundraising progress.",
};

export default function FounderLoginPage() {
  return (
    <AuthLayout
      role="founder"
      mode="login"
      title="Founder Login"
      subtitle="Access your fundraising dashboard to manage your deal, track investors, and monitor fundraising progress."
      belowSubtitle={
        <Link
          href="/investor/login"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Switch to Investor Login &rarr;
        </Link>
      }
    >
      <LoginForm role="founder" />
    </AuthLayout>
  );
}
