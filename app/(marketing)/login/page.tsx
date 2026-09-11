import { Suspense } from "react";
import LoginPage from "@/components/sections/Login";
import { LoginFlowReader } from "./LoginFlowReader";

export default function LoginRoute() {
  return (
    <Suspense fallback={<LoginPage />}>
      <LoginFlowReader />
    </Suspense>
  );
}
