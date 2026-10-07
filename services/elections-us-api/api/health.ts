import { jsonResponse, requestGuard } from "../src/http";
import { apConfiguration } from "../src/us2026/constants";

type RuntimeEnvironment = Record<string, string | undefined>;

export function handleHealthRequest(request: Request, environment: RuntimeEnvironment = process.env) {
  const guard = requestGuard(request, environment);
  if (guard) return guard;

  const ap = apConfiguration(environment);
  return jsonResponse(request, {
    status: "ok",
    service: "familiausa1-us-elections-api",
    timestamp: new Date().toISOString(),
    provider: {
      name: "Associated Press Elections API",
      configured: ap.configured,
      resultsType: ap.resultsType === "t" ? "test" : "live"
    }
  }, { cacheControl: "no-store", environment });
}

export default { fetch: handleHealthRequest };
