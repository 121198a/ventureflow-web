import { adminRoute } from "@/lib/cms/http";
import { cms } from "@/lib/cms/server";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Ctx) {
  const { slug } = await params;
  return adminRoute(request, (actorId) => cms.publishPage(slug, actorId));
}
export async function DELETE(request: Request, { params }: Ctx) {
  const { slug } = await params;
  return adminRoute(request, (actorId) => cms.unpublishPage(slug, actorId));
}
