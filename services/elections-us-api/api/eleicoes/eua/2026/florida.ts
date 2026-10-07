import { jsonResponse, requestGuard } from "../../../../src/http";
import { cacheControlForPhase } from "../../../../src/us2026/constants";
import { getFlorida } from "../../../../src/us2026/service";

type RuntimeEnvironment = Record<string, string | undefined>;

export async function handleFloridaRequest(request: Request, environment: RuntimeEnvironment = process.env) {
  const guard = requestGuard(request, environment);
  if (guard) return guard;

  const url = new URL(request.url);
  const demo = url.searchParams.get("demo") === "1";
  const body = await getFlorida({ environment, demo });
  return jsonResponse(request, body, {
    cacheControl: demo ? "no-store" : cacheControlForPhase(body.timeline.phase),
    environment
  });
}

export default { fetch: handleFloridaRequest };
