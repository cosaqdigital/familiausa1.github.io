import { jsonResponse, requestGuard } from "../../../../src/http";
import { getRaces } from "../../../../src/us2026/service";

type RuntimeEnvironment = Record<string, string | undefined>;

export async function handleRacesRequest(request: Request, environment: RuntimeEnvironment = process.env) {
  const guard = requestGuard(request, environment);
  if (guard) return guard;

  const url = new URL(request.url);
  const state = (url.searchParams.get("state") || "").trim().toUpperCase();
  const offices = (url.searchParams.get("office") || "S,H,G")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  if (!/^[A-Z]{2}$/.test(state)) {
    return jsonResponse(request, {
      status: "invalid-request",
      message: "Informe state com a sigla de duas letras, por exemplo FL."
    }, { status: 400, cacheControl: "no-store", environment });
  }

  try {
    const body = await getRaces({ statePostal: state, offices, environment });
    return jsonResponse(request, body, { environment });
  } catch {
    return jsonResponse(request, {
      status: "temporarily-unavailable",
      message: "Nao foi possivel consultar as corridas agora.",
      races: []
    }, { status: 503, cacheControl: "no-store", environment });
  }
}

export default { fetch: handleRacesRequest };
