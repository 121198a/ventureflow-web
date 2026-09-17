import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully." });
  res.cookies.delete("vf_token");
  res.cookies.delete("vf_auth");
  res.cookies.delete("vf_role");
  res.cookies.delete("vf_user");
  res.cookies.delete("sb_access_token");
  res.cookies.delete("sb_refresh_token");
  return res;
}

export async function GET() {
  return POST();
}
