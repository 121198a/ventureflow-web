import { publicRoute } from "@/lib/cms/http";
import { getCategories } from "@/lib/cms/server";

export async function GET(request: Request) {
  return publicRoute(request, async () =>
    (await getCategories()).map(({ name, slug, description, sortOrder }) => ({ name, slug, description, sortOrder }))
  );
}
