import { adminRoute, publicRoute, readJson } from "@/lib/cms/http";
import { cms, listPublished } from "@/lib/cms/server";

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const sort = sp.get("sort");
  return publicRoute(request, () =>
    listPublished(
      sp.get("category") || undefined,
      sp.get("q") || undefined,
      Number(sp.get("page")) || 1,
      Number(sp.get("pageSize")) || 20,
      sort === "updated" || sort === "published" ? sort : "title"
    )
  );
}

export async function POST(request: Request) {
  return adminRoute(request, async (actorId) => cms.createPage(await readJson(request), actorId), 201);
}
