import { adminRoute, publicRoute, readJson } from "@/lib/cms/http";
import { cms, getNavigation } from "@/lib/cms/server";

export async function GET(request: Request) {
  return publicRoute(request, () => getNavigation());
}
export async function PUT(request: Request) {
  return adminRoute(request, async (actorId) => cms.updateNavigation(await readJson(request), actorId));
}
