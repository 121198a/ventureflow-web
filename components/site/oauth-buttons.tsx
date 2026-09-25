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
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "facebook") => {
    setLocalError(null);
    setLoadingProvider(provider);

    try {
      const result = await initiateOAuthSignIn(provider, { role });
      if (!result.success && result.error) {
        setLocalError(result.error);
        if (onError) onError(result.error);
      }
    } catch {
      const fallbackMsg = `Unable to connect to ${provider === "google" ? "Google" : "Facebook"} sign-in. Please try again or use email.`;
      setLocalError(fallbackMsg);
      if (onError) onError(fallbackMsg);
    } finally {
      setLoadingProvider(null);
    }
  };

  const socialBtn =
    "inline-flex h-[clamp(2.75rem,5.75vh,3.4rem)] min-w-[11.5rem] flex-1 items-center justify-center gap-[clamp(0.5rem,0.75vw,0.75rem)] rounded-full border border-slate-200 bg-white px-4 text-[length:clamp(0.875rem,1.05vw,1.1rem)] font-medium text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60";
  const iconSize = "size-[clamp(1.1rem,1.3vw,1.4rem)] shrink-0";

  return (
    <div className={`space-y-3 ${className}`}>
      {localError && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-left"
        >
          {localError}
        </div>
      )}

      <div className="flex flex-wrap gap-[clamp(0.6rem,0.85vw,0.9rem)]">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={loadingProvider !== null}
          aria-label="Continue with Google"
          className={socialBtn}
        >
          {loadingProvider === "google" ? (
            <Loader2 className={`${iconSize} animate-spin text-brand`} />
          ) : (
            <svg viewBox="0 0 48 48" className={iconSize} aria-hidden>
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
          onClick={() => handleOAuth("facebook")}
          disabled={loadingProvider !== null}
          aria-label="Continue with Facebook"
          className={socialBtn}
        >
          {loadingProvider === "facebook" ? (
            <Loader2 className={`${iconSize} animate-spin text-brand`} />
          ) : (
            <svg viewBox="0 0 24 24" className="size-[clamp(1.2rem,1.5vw,1.6rem)] shrink-0" fill="#1877F2" aria-hidden>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>Continue with Facebook</span>
        </button>
      </div>
    </div>
  );
}
