"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { initiateOAuthSignIn } from "@/lib/supabase/client";

interface OAuthButtonsProps {
  role?: "investor" | "founder";
  onError?: (message: string) => void;
  className?: string;
}

export function OAuthButtons({
  role = "investor",
  onError,
  className = "",
}: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "apple") => {
    setLocalError(null);
    setLoadingProvider(provider);

    try {
      const result = await initiateOAuthSignIn(provider, { role });
      if (!result.success && result.error) {
        setLocalError(result.error);
        if (onError) onError(result.error);
      }
    } catch {
      const fallbackMsg = `Unable to connect to ${provider === "google" ? "Google" : "Apple"} sign-in. Please try again or use email.`;
      setLocalError(fallbackMsg);
      if (onError) onError(fallbackMsg);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {localError && (
        <div
          role="alert"
          className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-[0.8rem] leading-relaxed text-amber-700 dark:text-amber-300"
        >
          <p className="font-semibold mb-0.5">Configuration Notice</p>
          <p>{localError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={loadingProvider !== null}
          aria-label="Continue with Google"
          className="btn-pill-secondary rounded-lg py-2.5 text-xs sm:text-sm shadow-2xs disabled:opacity-60"
          style={{ fontWeight: 600 }}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="size-4 animate-spin text-brand" />
          ) : (
            <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z"
              />
              <path
                fill="#FF3D00"
                d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7Z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.5 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.9 39.6 16.4 44 24 44Z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.6l6.5 5.5C41.4 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5Z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          disabled={loadingProvider !== null}
          aria-label="Continue with Apple"
          className="btn-pill-secondary rounded-lg py-2.5 text-xs sm:text-sm shadow-2xs disabled:opacity-60"
          style={{ fontWeight: 600 }}
        >
          {loadingProvider === "apple" ? (
            <Loader2 className="size-4 animate-spin text-brand" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d="M17.05 12.04c-.03-2.7 2.2-4 2.3-4.06-1.26-1.84-3.22-2.1-3.92-2.13-1.67-.17-3.26.98-4.1.98-.85 0-2.15-.96-3.54-.93-1.82.03-3.5 1.06-4.44 2.68-1.9 3.29-.49 8.15 1.36 10.82.9 1.31 1.98 2.78 3.39 2.73 1.36-.05 1.87-.88 3.52-.88 1.63 0 2.11.88 3.55.85 1.47-.02 2.4-1.33 3.29-2.65 1.04-1.52 1.47-3 1.49-3.07-.03-.02-2.85-1.1-2.88-4.34ZM14.4 4.02c.75-.9 1.25-2.16 1.11-3.42-1.08.04-2.38.72-3.16 1.61-.7.79-1.31 2.07-1.15 3.29 1.19.09 2.42-.6 3.2-1.48Z" />
            </svg>
          )}
          <span>Continue with Apple</span>
        </button>
      </div>
    </div>
  );
}
