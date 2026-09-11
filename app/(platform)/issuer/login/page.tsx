import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = {
  title: "Founder Login | UBverse",
  description: "Access your fundraising dashboard to manage your deal, track investors, and monitor fundraising progress.",
};

export default function IssuerLogin() {
  return (
    <AuthLayout
      title="Founder Login"
      subtitle="Access your fundraising dashboard to manage your deal, track investors, and monitor fundraising progress."
      belowSubtitle={
        <Link href="/investor/login" className="text-[0.9rem] text-brand underline">
          Switch to Investor Login →
        </Link>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
