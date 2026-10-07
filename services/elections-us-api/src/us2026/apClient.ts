import {
  AP_ELECTIONS_BASE,
  US_GENERAL_ELECTION_DATE,
  apConfiguration,
  type RuntimeEnvironment
} from "./constants";

export class ApFetchError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "ApFetchError";
    this.status = status;
  }
}

const memory = new Map<string, { at: number; value: unknown }>();
const inFlight = new Map<string, Promise<unknown>>();
const TTL_MS = 15_000;

function withFormatJson(urlValue: string) {
  const url = new URL(urlValue);
  url.searchParams.set("format", "json");
  return url.toString();
}

async function fetchJson(urlValue: string, environment: RuntimeEnvironment = process.env) {
  const configuration = apConfiguration(environment);
  if (!configuration.apiKey) throw new ApFetchError("AP Elections API nao configurada.", 503);

  const key = urlValue;
  const now = Date.now();
  const cached = memory.get(key);
  if (cached && now - cached.at < TTL_MS) return cached.value;
  const pending = inFlight.get(key);
  if (pending) return pending;

  const task = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(urlValue, {
        headers: {
          "x-api-key": configuration.apiKey!,
          "Accept": "application/json",
          "Accept-Encoding": "gzip"
        },
        signal: controller.signal
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new ApFetchError(
          `AP Elections respondeu HTTP ${response.status}${text ? `: ${text.slice(0, 180)}` : ""}`,
          response.status >= 500 ? 502 : response.status
        );
      }

      const value = await response.json();
      memory.set(key, { at: Date.now(), value });
      return value;
    } catch (error) {
      if (error instanceof ApFetchError) throw error;
      throw new ApFetchError(error instanceof Error ? error.message : "Falha ao consultar AP Elections.");
    } finally {
      clearTimeout(timeout);
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
}

function contentLink(value: unknown) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  for (const key of ["href", "src", "url"]) {
    if (typeof record[key] === "string") return String(record[key]);
  }
  return undefined;
}

export async function fetchTrendReports(environment: RuntimeEnvironment = process.env) {
  const configuration = apConfiguration(environment);
  const indexUrl = new URL(`${AP_ELECTIONS_BASE}/reports`);
  indexUrl.searchParams.set("subtype", "h,s,g");
  indexUrl.searchParams.set("electionDate", US_GENERAL_ELECTION_DATE);
  indexUrl.searchParams.set("statePostal", "US");
  indexUrl.searchParams.set("resultsType", configuration.resultsType);
  indexUrl.searchParams.set("format", "json");

  const index = await fetchJson(indexUrl.toString(), environment) as Record<string, unknown>;
  const reports = Array.isArray(index.reports) ? index.reports : [];
  const selected = reports.filter((entry) => {
    const item = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    return ["h", "s", "g"].includes(String(item.subtype ?? "").toLowerCase());
  });

  const output: Array<{ subtype: string; metadata: Record<string, unknown>; data: unknown }> = [];
  for (const entry of selected) {
    const item = entry as Record<string, unknown>;
    const direct = contentLink(item.contentLink) || contentLink(item.content) || contentLink(item.link);
    if (!direct) continue;
    const data = await fetchJson(withFormatJson(direct), environment);
    output.push({ subtype: String(item.subtype ?? "").toLowerCase(), metadata: item, data });
  }
  return output;
}

export async function fetchStateRaces(
  statePostal: string,
  offices: string[],
  environment: RuntimeEnvironment = process.env
) {
  const configuration = apConfiguration(environment);
  const url = new URL(`${AP_ELECTIONS_BASE}/elections/${US_GENERAL_ELECTION_DATE}`);
  url.searchParams.set("statepostal", statePostal);
  url.searchParams.set("officeID", offices.join(","));
  url.searchParams.set("resultsType", configuration.resultsType);
  url.searchParams.set("format", "json");
  return fetchJson(url.toString(), environment);
}

export async function fetchHouseNationalVote(environment: RuntimeEnvironment = process.env) {
  const configuration = apConfiguration(environment);
  const url = new URL(`${AP_ELECTIONS_BASE}/elections/${US_GENERAL_ELECTION_DATE}`);
  url.searchParams.set("statepostal", "US");
  url.searchParams.set("resultsType", configuration.resultsType);
  url.searchParams.set("format", "json");
  return fetchJson(url.toString(), environment);
}
