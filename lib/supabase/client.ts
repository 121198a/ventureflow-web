import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function getSupabaseConfig(): { url: string; key: string } | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) return null;

  const url = rawUrl.trim().replace(/\/+$/, "");
  const key = rawKey.trim();

  if (
    !url ||
    !key ||
    url.includes("your-project.supabase.co") ||
    key.includes("your-anon-key") ||
    key.includes("your-publishable-key")
  ) {
    return null;
  }

  // Ensure scheme is present
  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  return { url: normalizedUrl, key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

// In-memory fallback if localStorage is blocked by browser policies or unavailable
const _memoryStorage = new Map<string, string>();
const _safeFallbackStorage = {
  getItem: (key: string): string | null => _memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    _memoryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    _memoryStorage.delete(key);
  },
};

function getSafeStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const probe = "__sb_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return _safeFallbackStorage;
  }
}

let _lastInitError: string | null = null;

function createSupabaseClient(): SupabaseClient<Database> | null {
  const config = getSupabaseConfig();
  if (!config) {
    _lastInitError =
      "Missing or invalid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Please restart your dev server after updating .env.local, or add them in your hosting provider's dashboard.";
    return null;
  }

  try {
    const isBrowser = typeof window !== "undefined";
    const storage = getSafeStorage();

    const client = createClient<Database>(config.url, config.key, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
        ...(storage ? { storage } : {}),
      },
    });
    _lastInitError = null;
    return client;
  } catch (err) {
    _lastInitError = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Supabase] Failed to initialize Supabase client:", err);
    }
    return null;
  }
}

let _supabase: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    _supabase = null;
    return null;
  }
  if (!_supabase) {
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
 * Initiates a real Supabase OAuth sign-in flow for Google or Facebook.
 * Complies with strict rule: never fakes success or mock credentials.
 * If Supabase or provider credentials are not configured, returns a clear
 * configuration description.
 */
export async function initiateOAuthSignIn(
  provider: "google" | "facebook" | "apple",
  options?: { redirectTo?: string; role?: "investor" | "founder" }
): Promise<OAuthSignInResult> {
  const providerLabel =
    provider === "google" ? "Google" : provider === "facebook" ? "Facebook" : "Apple";

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      configurationRequired: true,
      error: `Supabase environment variables are not configured. To enable ${providerLabel} sign-in, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, then enable the ${providerLabel} provider in your Supabase project under Authentication -> Providers.`,
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
        error: _lastInitError
          ? `Supabase client could not be initialized: ${_lastInitError}`
          : "Supabase client could not be initialized. Please check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are properly configured.",
      };
    }

    const { data, error } = await client.auth.signInWithOAuth({
      provider: provider as "google" | "facebook",
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
          ? `${providerLabel} OAuth provider is not enabled in your Supabase Dashboard. Navigate to Authentication -> Providers -> ${providerLabel} to enable it with client credentials.`
          : error.message || `Failed to initiate ${providerLabel} authentication.`,
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
      error: `No authorization redirect URL received from ${providerLabel} provider. Please verify your Supabase OAuth redirect URL settings.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown OAuth error";
    return {
      success: false,
      error: msg,
    };
  }
}
