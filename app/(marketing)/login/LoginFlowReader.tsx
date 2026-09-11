"use client";

import { useSearchParams } from "next/navigation";
import LoginPage from "@/components/sections/Login";

export function LoginFlowReader() {
  const params = useSearchParams();
  const flow = params.get("flow") === "login" ? "login" : "signup";
  return <LoginPage initialFlow={flow} />;
}
