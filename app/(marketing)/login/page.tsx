import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "@/components/sections/Login";

export const metadata: Metadata = {
  title: "Log In or Sign Up | UnBound X",
  description:
    "Access your verified track record or create your account to formulate and track market theses on UnBound X.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faff] flex items-center justify-center text-xs text-slate-400">
          Loading UnBound X authentication...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
