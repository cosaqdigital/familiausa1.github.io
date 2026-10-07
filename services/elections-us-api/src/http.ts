const PRODUCTION_ORIGINS = new Set([
  "https://familiausa1.com",
  "https://www.familiausa1.com",
  "https://cosaqdigital.github.io"
]);

type RuntimeEnvironment = Record<string, string | undefined>;

function isDevelopment(environment: RuntimeEnvironment) {
  return environment.VERCEL_ENV !== "production" && environment.NODE_ENV !== "production";
}

function isLocalOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (url.protocol === "http:" || url.protocol === "https:")
      && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

export function allowedCorsOrigin(request: Request, environment: RuntimeEnvironment = process.env) {
  const origin = request.headers.get("origin");
  if (!origin) return undefined;
  if (PRODUCTION_ORIGINS.has(origin)) return origin;
  if (isDevelopment(environment) && isLocalOrigin(origin)) return origin;
  return null;
}

function corsHeaders(request: Request, environment: RuntimeEnvironment) {
  const origin = allowedCorsOrigin(request, environment);
  const headers = new Headers({
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Cache-Control, Content-Type, Pragma",
    "Access-Control-Max-Age": "86400"
  });
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

export function jsonResponse(
  request: Request,
  body: unknown,
  options: {
    status?: number;
    cacheControl?: string;
    environment?: RuntimeEnvironment;
    extraHeaders?: Record<string, string>;
  } = {}
) {
  const environment = options.environment ?? process.env;
  const headers = corsHeaders(request, environment);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set(
    "Cache-Control",
    options.cacheControl ?? "public, max-age=0, s-maxage=30, stale-while-revalidate=120, stale-if-error=600"
  );
  headers.set("CDN-Cache-Control", headers.get("Cache-Control") || "public, s-maxage=30");
  for (const [key, value] of Object.entries(options.extraHeaders ?? {})) headers.set(key, value);
  return new Response(JSON.stringify(body), { status: options.status ?? 200, headers });
}

export function preflightResponse(request: Request, environment: RuntimeEnvironment = process.env) {
  return new Response(null, { status: 204, headers: corsHeaders(request, environment) });
}

export function rejectedCorsResponse(request: Request, environment: RuntimeEnvironment = process.env) {
  return jsonResponse(request, { status: "forbidden", message: "Origem nao permitida." }, {
    status: 403,
    cacheControl: "no-store",
    environment
  });
}

export function requestGuard(request: Request, environment: RuntimeEnvironment = process.env) {
  if (request.method === "OPTIONS") return preflightResponse(request, environment);
  if (request.method !== "GET") {
    return jsonResponse(request, { status: "method-not-allowed", message: "Metodo nao permitido." }, {
      status: 405,
      cacheControl: "no-store",
      environment,
      extraHeaders: { Allow: "GET, OPTIONS" }
    });
  }
  if (allowedCorsOrigin(request, environment) === null) return rejectedCorsResponse(request, environment);
  return null;
}
