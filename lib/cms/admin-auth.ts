/**
 * Admin authorisation for CMS mutations.
 *
 * Only Supabase `app_metadata.role === "admin"` is trusted. `app_metadata` can be changed
 * only with the service-role key, whereas `user_metadata` is user-editable and must never
 * grant admin rights. Client-supplied role/admin/user-id values are ignored entirely.
 */
export type VerifiedUser = { id?: string; app_metadata?: { role?: unknown } | null } | null | undefined;

export function isAdminUser(user: VerifiedUser): boolean {
  const role = user?.app_metadata?.role;
  return typeof role === "string" && role.toLowerCase() === "admin" && typeof user?.id === "string" && user.id.length > 0;
}

export function extractBearer(header: string | null): string | null {
  const m = header?.match(/^Bearer\s+([A-Za-z0-9._~+/=-]{20,4096})$/i);
  return m ? m[1] : null;
}
