import { adminRoute } from "@/lib/cms/http";
import { cms } from "@/lib/cms/server";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return adminRoute(request, (actorId) => cms.archivePage(slug, actorId));
}
