import { publicRoute } from "@/lib/cms/http";
import { cms } from "@/lib/cms/server";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return publicRoute(request, () => cms.search(q));
}
