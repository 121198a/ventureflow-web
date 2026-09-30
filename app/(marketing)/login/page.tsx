import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginFlowReader } from "./LoginFlowReader";

export const metadata: Metadata = {
  title: "Log In or Sign Up | VentureFlow by Veyron X",
  description:
    "Access your verified track record or create your account to formulate and track market theses on VentureFlow by Veyron X.",
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
        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center text-xs text-slate-400">
          Loading VentureFlow authentication...
        </div>
      }
    >
      <LoginFlowReader />
    </Suspense>
  );
}
