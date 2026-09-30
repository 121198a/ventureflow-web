import { adminRoute, readJson } from "@/lib/cms/http";
import { cms } from "@/lib/cms/server";

// Redirect rules are administrative data: list and create are admin-only.
export async function GET(request: Request) {
  return adminRoute(request, () => cms.listRedirects());
}
export async function POST(request: Request) {
  return adminRoute(request, async (actorId) => cms.createRedirect(await readJson(request), actorId), 201);
}
