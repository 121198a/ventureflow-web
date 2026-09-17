import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env["NEXT_PUBLIC_SUPABASE_URL"] &&
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
  );
}

function createSupabaseClient() {
  const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const SUPABASE_PUBLISHABLE_KEY =
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!_supabase) _supabase = createSupabaseClient();
  return _supabase;
}

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

export interface OAuthSignInResult {
  success: boolean;
  url?: string;
  error?: string;
  configurationRequired?: boolean;
}

/**
 * Initiates a real Supabase OAuth sign-in flow for Google or Apple.
 * Complies with strict rule: never fakes success or mock credentials.
 * If Supabase or provider credentials are not configured, returns a clear
 * configuration description.
 */
export async function initiateOAuthSignIn(
  provider: "google" | "apple",
  options?: { redirectTo?: string; role?: "investor" | "founder" }
): Promise<OAuthSignInResult> {
  if (!isSupabaseConfigured()) {
    const providerName = provider === "google" ? "Google" : "Apple";
    return {
      success: false,
      configurationRequired: true,
      error: `Supabase environment variables are not configured. To enable ${providerName} sign-in, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, then enable the ${providerName} provider in your Supabase project under Authentication -> Providers.`,
    };
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const targetRole = options?.role || "investor";
    const redirectTo =
      options?.redirectTo ||
      `${origin}/auth/callback?role=${encodeURIComponent(targetRole)}`;

    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        configurationRequired: true,
        error: "Supabase client could not be initialized.",
      };
    }

    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      const isProviderDisabled =
        error.message?.toLowerCase().includes("not enabled") ||
        error.message?.toLowerCase().includes("unsupported provider") ||
        error.message?.toLowerCase().includes("disabled");

      return {
        success: false,
        configurationRequired: isProviderDisabled,
        error: isProviderDisabled
          ? `${provider === "google" ? "Google" : "Apple"} OAuth provider is not enabled in your Supabase Dashboard. Navigate to Authentication -> Providers -> ${provider === "google" ? "Google" : "Apple"} to enable it with client credentials.`
          : error.message || `Failed to initiate ${provider} authentication.`,
      };
    }

    if (data?.url) {
      if (typeof window !== "undefined") {
        window.location.assign(data.url);
      }
      return { success: true, url: data.url };
    }

    return {
      success: false,
      error: `No authorization redirect URL received from ${provider} provider. Please verify your Supabase OAuth redirect URL settings.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown OAuth error";
    return {
      success: false,
      error: msg,
    };
  }
}
