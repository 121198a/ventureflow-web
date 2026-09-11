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
