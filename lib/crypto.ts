/**
 * Cryptographic helpers using the standard Web Crypto API (PBKDF2 with SHA-256).
 * Safe, zero-dependency password hashing and verification.
 */
export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string }> {
  const salt = saltHex
    ? Buffer.from(saltHex, "hex")
    : crypto.getRandomValues(new Uint8Array(16));

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashHex = Buffer.from(derivedKey).toString("hex");
  const saltHexResult = Buffer.from(salt).toString("hex");

  return { hash: hashHex, salt: saltHexResult };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}

// SECURITY: session tokens are HMAC-signed with this secret. If it isn't
// set, anyone who can read this (public) source knows the exact key used to
// sign every session cookie and can forge a valid session/role for any user.
// A hardcoded fallback secret is exactly the "looks like it works" failure
// mode this project explicitly rules out elsewhere (see Phase 11's "never
// weaken a check to make login appear to work"), so production now fails
// loudly instead of silently signing with a known string.
const CONFIGURED_SESSION_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
let hasWarnedAuthSecret = false;

function getSessionSecret(): string {
  if (CONFIGURED_SESSION_SECRET) return CONFIGURED_SESSION_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[Auth] AUTH_SECRET (or NEXTAUTH_SECRET) is not set. Refusing to sign session " +
        "tokens with a hardcoded fallback secret in production. Set AUTH_SECRET to a " +
        "long random value in your environment configuration."
    );
  }

  // Local/dev-only convenience fallback. Never used in production (see above).
  if (!hasWarnedAuthSecret && process.env.NODE_ENV !== "test") {
    hasWarnedAuthSecret = true;
    console.warn(
      "[Auth] AUTH_SECRET is not set — using an insecure development-only fallback " +
        "signing key. Set AUTH_SECRET in .env.local before deploying."
    );
  }
  return "dev_only_insecure_fallback_secret_do_not_use_in_production";
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed session token using HMAC-SHA256.
 * Prevents client-side role and session tampering.
 */
export async function signSessionToken<T extends Record<string, unknown>>(
  payload: T
): Promise<string> {
  const enc = new TextEncoder();
  const jsonStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(jsonStr).toString("base64url");

  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadB64)
  );
  const sigB64 = Buffer.from(signatureBuffer).toString("base64url");

  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed session token.
 * Returns null if the signature is invalid or tampered.
 */
export async function verifySessionToken<T extends Record<string, unknown>>(
  token?: string | null
): Promise<T | null> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const key = await getHmacKey();
    const signatureBytes = Buffer.from(sigB64, "base64url");

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const jsonStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}
