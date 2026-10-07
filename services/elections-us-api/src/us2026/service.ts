import {
  AP_DOCS_URL,
  EAC_RESULTS_INFO_URL,
  FLORIDA_ELECTIONS_URL,
  US_GENERAL_ELECTION_DATE,
  apConfiguration,
  type RuntimeEnvironment
} from "./constants";
import { fetchHouseNationalVote, fetchStateRaces, fetchTrendReports, ApFetchError } from "./apClient";
import { demoFlorida, demoSummary } from "./mock";
import { normalizeHouseNationalVote, normalizeRaces, normalizeTrendReport } from "./normalize";
import { usElectionTimeline } from "./timeline";
import type { FloridaResponse, UsElectionSummary } from "./types";

function provider(environment: RuntimeEnvironment, demo = false) {
  const configuration = apConfiguration(environment);
  return {
    name: "Associated Press Elections API" as const,
    configured: configuration.configured,
    resultsType: configuration.resultsType === "t" ? "test" as const : "live" as const,
    demo
  };
}

function source() {
  return {
    resultsProvider: "Associated Press Elections API (quando habilitada)",
    certificationAuthority: "Autoridades eleitorais estaduais e locais",
    note: "Resultados da noite eleitoral sao preliminares ate a certificacao oficial."
  };
}

function links() {
  return {
    apDocumentation: AP_DOCS_URL,
    electionAdministration: EAC_RESULTS_INFO_URL,
    floridaElections: FLORIDA_ELECTIONS_URL
  };
}

function publicStatus(now: Date, configured: boolean) {
  const timeline = usElectionTimeline(now);
  if (timeline.phase === "before-election") {
    return {
      status: "ready" as const,
      message: "A pagina esta preparada. Os resultados aparecerao quando a apuracao de 3 de novembro de 2026 comecar."
    };
  }
  if (!configured) {
    return {
      status: "waiting-provider" as const,
      message: "A fonte de dados de apuracao ainda nao esta habilitada. A pagina continuara tentando automaticamente."
    };
  }
  if (timeline.phase === "election-day") return { status: "voting" as const, message: timeline.message };
  return { status: "counting" as const, message: timeline.message };
}

export async function getSummary(options: {
  environment?: RuntimeEnvironment;
  now?: Date;
  demo?: boolean;
} = {}): Promise<UsElectionSummary> {
  const environment = options.environment ?? process.env;
  const now = options.now ?? new Date();
  const configuration = apConfiguration(environment);
  const timeline = usElectionTimeline(now);

  if (options.demo && environment.VERCEL_ENV !== "production") return demoSummary();

  const state = publicStatus(now, configuration.configured);
  const base: UsElectionSummary = {
    version: 1,
    electionDate: US_GENERAL_ELECTION_DATE,
    status: state.status,
    message: state.message,
    snapshotAt: now.toISOString(),
    timeline,
    provider: provider(environment),
    source: source(),
    balance: { house: null, senate: null, governors: null },
    houseNationalVote: null,
    links: links(),
    warnings: []
  };

  if (!configuration.configured || timeline.phase === "before-election") return base;

  try {
    const [trendReports, nationalVote] = await Promise.all([
      fetchTrendReports(environment),
      fetchHouseNationalVote(environment)
    ]);

    for (const report of trendReports) {
      const normalized = normalizeTrendReport(report.data);
      if (!normalized) continue;
      if (report.subtype === "h" || normalized.officeCode === "H") base.balance.house = normalized;
      if (report.subtype === "s" || normalized.officeCode === "S") base.balance.senate = normalized;
      if (report.subtype === "g" || normalized.officeCode === "G") base.balance.governors = normalized;
    }

    base.houseNationalVote = normalizeHouseNationalVote(nationalVote);
    const hasResults = Boolean(base.balance.house || base.balance.senate || base.balance.governors || base.houseNationalVote);
    base.status = hasResults ? "counting" : "waiting-results";
    base.message = hasResults
      ? "Resultados preliminares em atualizacao. Chamadas de corrida da AP sao diferentes da certificacao oficial."
      : "A fonte esta conectada, mas ainda nao ha resultados para exibir.";
    return base;
  } catch (error) {
    base.status = "temporarily-unavailable";
    base.message = "A consulta aos resultados esta temporariamente indisponivel. Tente novamente em instantes.";
    base.warnings.push(error instanceof ApFetchError ? error.message : "Falha inesperada ao consultar a fonte.");
    return base;
  }
}

export async function getFlorida(options: {
  environment?: RuntimeEnvironment;
  now?: Date;
  demo?: boolean;
} = {}): Promise<FloridaResponse> {
  const environment = options.environment ?? process.env;
  const now = options.now ?? new Date();
  const configuration = apConfiguration(environment);
  const timeline = usElectionTimeline(now);

  if (options.demo && environment.VERCEL_ENV !== "production") return demoFlorida();

  const state = publicStatus(now, configuration.configured);
  const base: FloridaResponse = {
    version: 1,
    electionDate: US_GENERAL_ELECTION_DATE,
    status: state.status,
    message: state.message,
    snapshotAt: now.toISOString(),
    timeline,
    provider: provider(environment),
    source: source(),
    races: [],
    links: {
      floridaElections: FLORIDA_ELECTIONS_URL,
      apDocumentation: AP_DOCS_URL
    },
    warnings: []
  };

  if (!configuration.configured || timeline.phase === "before-election") return base;

  try {
    const raw = await fetchStateRaces("FL", ["G", "S", "H"], environment);
    base.races = normalizeRaces(raw, "FL");
    base.status = base.races.length ? "counting" : "waiting-results";
    base.message = base.races.length
      ? "Resultados preliminares da Florida em atualizacao."
      : "A fonte esta conectada, mas ainda nao ha resultados da Florida para exibir.";
    return base;
  } catch (error) {
    base.status = "temporarily-unavailable";
    base.message = "A consulta aos resultados da Florida esta temporariamente indisponivel.";
    base.warnings.push(error instanceof ApFetchError ? error.message : "Falha inesperada ao consultar a fonte.");
    return base;
  }
}

export async function getRaces(options: {
  statePostal: string;
  offices: string[];
  environment?: RuntimeEnvironment;
}) {
  const environment = options.environment ?? process.env;
  if (!apConfiguration(environment).configured) {
    return { status: "waiting-provider" as const, races: [], message: "Fonte de apuracao nao configurada." };
  }
  const raw = await fetchStateRaces(options.statePostal, options.offices, environment);
  return {
    status: "counting" as const,
    races: normalizeRaces(raw, options.statePostal),
    message: "Resultados preliminares."
  };
}
