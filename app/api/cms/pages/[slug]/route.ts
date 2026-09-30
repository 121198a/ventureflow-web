import { adminRoute, publicRoute, readJson } from "@/lib/cms/http";
import { cms, getPublishedPage } from "@/lib/cms/server";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const { slug } = await params;
  return publicRoute(request, () => getPublishedPage(slug));
}
export async function PATCH(request: Request, { params }: Ctx) {
  const { slug } = await params;
  return adminRoute(request, async (actorId) => cms.updatePage(slug, await readJson(request), actorId));
}
export async function DELETE(request: Request, { params }: Ctx) {
  const { slug } = await params;
  return adminRoute(request, (actorId) => cms.deletePage(slug, actorId));
}
