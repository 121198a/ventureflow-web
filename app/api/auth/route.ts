import { NextResponse } from "next/server";
import { POST as loginHandler } from "./login/route";
import { POST as signupHandler } from "./signup/route";
import { POST as recoverHandler } from "./recover/route";
import { POST as resetHandler } from "./reset/route";
import { POST as supportHandler } from "./support/route";
import { GET as sessionGetHandler, DELETE as sessionDeleteHandler } from "./session/route";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const flowParam = url.searchParams.get("flow")?.toLowerCase();

  // If flow is present in query parameters, dispatch accordingly
  if (flowParam === "login") {
    return loginHandler(request);
  }
  if (flowParam === "signup") {
    return signupHandler(request);
  }
  if (flowParam === "recover") {
    return recoverHandler(request);
  }
  if (flowParam === "reset") {
    return resetHandler(request);
  }
  if (flowParam === "support") {
    return supportHandler(request);
  }

  // If no flow in query string, inspect body safely
  try {
    const clone = request.clone();
    const body = await clone.json();
    const bodyFlow = typeof body?.flow === "string" ? body.flow.toLowerCase() : null;

    if (bodyFlow === "login") return loginHandler(request);
    if (bodyFlow === "signup") return signupHandler(request);
    if (bodyFlow === "recover") return recoverHandler(request);
    if (bodyFlow === "reset") return resetHandler(request);
    if (bodyFlow === "support") return supportHandler(request);
  } catch {
    // Body is not JSON
  }

  return NextResponse.json(
    {
      success: false,
      error: "Invalid or missing auth flow parameter. Supported flows: login, signup, recover, reset, support.",
    },
    { status: 400 }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const flowParam = url.searchParams.get("flow")?.toLowerCase();

  if (flowParam === "session" || !flowParam) {
    return sessionGetHandler(request);
  }

  return NextResponse.json(
    { success: false, error: "Unsupported GET operation." },
    { status: 400 }
  );
}

export async function DELETE() {
  return sessionDeleteHandler();
}
