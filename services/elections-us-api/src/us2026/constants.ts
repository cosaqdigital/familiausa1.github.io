export const US_GENERAL_ELECTION_DATE = "2026-11-03";
export const US_ELECTION_DAY_START = "2026-11-03T06:00:00-05:00";
export const US_RESULTS_WINDOW_START = "2026-11-03T18:00:00-05:00";
export const US_POST_ELECTION_START = "2026-11-04T03:00:00-05:00";

export const AP_API_ORIGIN = "https://api.ap.org";
export const AP_API_VERSION = "v3";
export const AP_ELECTIONS_BASE = `${AP_API_ORIGIN}/${AP_API_VERSION}`;
export const AP_DOCS_URL = "https://developer.ap.org/ap-elections-api/";
export const EAC_RESULTS_INFO_URL = "https://www.eac.gov/where-do-i-find-election-results";
export const FLORIDA_ELECTIONS_URL = "https://dos.fl.gov/elections/";

export type RuntimeEnvironment = Record<string, string | undefined>;

export function apConfiguration(environment: RuntimeEnvironment = process.env) {
  const apiKey = environment.AP_ELECTIONS_API_KEY?.trim();
  const resultsType = environment.AP_ELECTIONS_RESULTS_TYPE?.trim().toLowerCase() === "t" ? "t" : "l";
  return {
    configured: Boolean(apiKey),
    apiKey,
    resultsType
  };
}

export function cacheControlForPhase(phase: string) {
  if (phase === "counting" || phase === "polls-closing" || phase === "election-day") {
    return "public, max-age=0, s-maxage=15, stale-while-revalidate=60, stale-if-error=600";
  }
  return "public, max-age=0, s-maxage=300, stale-while-revalidate=900, stale-if-error=3600";
}
