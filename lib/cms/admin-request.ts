import { getSupabaseConfig } from "../supabase/client";
import { extractBearer, isAdminUser, type VerifiedUser } from "./admin-auth";
import { CmsError } from "./service";

/**
 * Verifies the caller with Supabase Auth itself (never trusts cookies or body fields).
 * Bearer tokens only: cookie-authenticated mutations would be exposed to CSRF.
 */
export async function requireAdmin(request: Request): Promise<{ actorId: string }> {
  const token = extractBearer(request.headers.get("authorization"));
  if (!token) throw new CmsError("UNAUTHENTICATED", "Authentication required.");
  const config = getSupabaseConfig();
  if (!config) throw new CmsError("UNAUTHENTICATED", "Authentication required.");

  let user: VerifiedUser = null;
  try {
    const res = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) user = (await res.json()) as VerifiedUser;
  } catch {
    user = null; // fail closed
  }
  if (!user) throw new CmsError("UNAUTHENTICATED", "Authentication required.");
  if (!isAdminUser(user)) throw new CmsError("FORBIDDEN", "You do not have permission to do this.");
  return { actorId: user!.id as string };
}
