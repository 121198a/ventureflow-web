import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes("your-project.supabase.co") &&
    !key.includes("your-anon-key")
  );
}

function createSupabaseClient(): SupabaseClient<Database> | null {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_URL.includes("your-project.supabase.co") ||
    SUPABASE_PUBLISHABLE_KEY.includes("your-anon-key")
  ) {
    return null;
  }

  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Supabase] Failed to initialize Supabase client:", err);
    }
    return null;
  }
}

let _supabase: SupabaseClient<Database> | null | undefined;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  if (_supabase === undefined) {
    _supabase = createSupabaseClient();
  }
  return _supabase;
}

// Fallback proxy handler for when Supabase is not configured.
// Prevents module evaluation crashes during bundler inspection and runtime calls.
function createFallbackSupabaseClient(): object {
  const fallbackHandler: ProxyHandler<object> = {
    get(_, prop) {
      if (
        typeof prop === "symbol" ||
        prop === "then" ||
        prop === "$$typeof" ||
        prop === "__esModule" ||
        prop === "toJSON" ||
        prop === "default"
      ) {
        return undefined;
      }
      if (prop === "onAuthStateChange") {
        return () => ({
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        });
      }
      if (prop === "getSession" || prop === "getUser") {
        return async () => ({
          data: { session: null, user: null },
          error: null,
        });
      }
      const callable = () => {
        return new Proxy(
          Promise.resolve({
            data: null,
            error: { message: "Supabase is not configured in this environment." },
          }),
          fallbackHandler
        );
      };
      return new Proxy(callable, fallbackHandler);
    },
    apply() {
      return new Proxy(
        Promise.resolve({
          data: null,
          error: { message: "Supabase is not configured in this environment." },
        }),
        fallbackHandler
      );
    },
  };
  return new Proxy({}, fallbackHandler);
}

const _fallbackClient = createFallbackSupabaseClient();

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (
      typeof prop === "symbol" ||
      prop === "then" ||
      prop === "$$typeof" ||
      prop === "__esModule" ||
      prop === "toJSON" ||
      prop === "default"
    ) {
      return undefined;
    }

    const realClient = getSupabaseClient();
    if (realClient) {
      return Reflect.get(realClient, prop, receiver);
    }

    return Reflect.get(_fallbackClient, prop, receiver);
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
    const origin =
      (typeof window !== "undefined" && window.location.origin) ||
      (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
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
