import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "@/components/sections/Login";
import { LoginFlowReader } from "./LoginFlowReader";

export const metadata: Metadata = {
  title: "Log In or Sign Up",
  description:
    "Access your verified track record or create your account to formulate and track market theses on UnBound X.",
};

export default function LoginRoute() {
  return (
    <Suspense fallback={<LoginPage />}>
      <LoginFlowReader />
    </Suspense>
  );
}
