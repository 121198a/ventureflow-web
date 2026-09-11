import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/site/signup-form";

export const metadata: Metadata = {
  title: "Apply as a Founder | UBverse",
  description: "Complete your founder application to access investors and launch your raise.",
};

export default function Signup() {
  return (
    <AuthLayout
      title="Apply as a Founder"
      subtitle="Complete your founder application to access investors and launch your raise."
      belowSubtitle={
        <p className="text-[0.9rem] text-ink/70">
          Already have an account on UnBound X?{" "}
          <Link href="/issuer/login" className="text-brand underline">
            Login here
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
