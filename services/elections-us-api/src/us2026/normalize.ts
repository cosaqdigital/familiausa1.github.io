import type { BalanceReport, CandidateResult, RaceResult } from "./types";

type AnyRecord = Record<string, unknown>;

function record(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as AnyRecord : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function trendValue(party: AnyRecord, name: string) {
  const trends = array(party.trend ?? party.trends);
  const found = trends.find((value) => text(record(value).name).toLowerCase() === name.toLowerCase());
  return number(record(found).value);
}

function netChangeValue(party: AnyRecord, name: string) {
  const net = record(party.NetChange ?? party.netChange);
  const trends = array(net.trend ?? net.trends);
  const found = trends.find((value) => text(record(value).name).toLowerCase() === name.toLowerCase());
  return found ? number(record(found).value) : undefined;
}

export function normalizeTrendReport(data: unknown): BalanceReport | null {
  const rootRecord = record(data);
  const root = record(rootRecord.trendtable ?? rootRecord.trendTable ?? rootRecord);
  const parties = array(root.party ?? root.parties);
  if (!parties.length) return null;

  const officeCode = text(root.OfficeTypeCode ?? root.officeTypeCode ?? root.officeID ?? root.officeId);
  const officeName = text(root.office ?? root.officeName)
    || (officeCode === "H" ? "U.S. House" : officeCode === "S" ? "U.S. Senate" : officeCode === "G" ? "Governors" : "Balance of Power");

  return {
    officeCode,
    officeName,
    timestamp: text(root.timestamp ?? root.lastUpdated) || undefined,
    test: ["1", "true", "t", "test"].includes(text(root.Test ?? root.test ?? root.resultsType).toLowerCase()),
    parties: parties.map((value) => {
      const party = record(value);
      return {
        party: text(party.title ?? party.party ?? party.name),
        current: trendValue(party, "Current"),
        won: trendValue(party, "Won"),
        leading: trendValue(party, "Leading"),
        holdovers: trendValue(party, "Holdovers"),
        winningTrend: trendValue(party, "Winning Trend"),
        insufficientVote: trendValue(party, "InsufficientVote"),
        netChangeWinners: netChangeValue(party, "Winners"),
        netChangeLeaders: netChangeValue(party, "Leaders")
      };
    })
  };
}

function candidateName(candidate: AnyRecord) {
  const first = text(candidate.first ?? candidate.firstName);
  const middle = text(candidate.middle ?? candidate.middleName);
  const last = text(candidate.last ?? candidate.lastName);
  const suffix = text(candidate.suffix);
  return [first, middle, last, suffix].filter(Boolean).join(" ") || text(candidate.name);
}

function candidateResults(values: unknown[]): CandidateResult[] {
  const raw = values.map(record);
  const total = raw.reduce((sum, candidate) => sum + number(candidate.voteCount), 0);
  return raw
    .map((candidate) => {
      const votes = number(candidate.voteCount);
      const winnerFlag = text(candidate.winner).toUpperCase();
      const percentage = total > 0 ? (votes / total) * 100 : 0;
      return {
        id: text(candidate.candidateID ?? candidate.polID ?? candidate.polNum),
        name: candidateName(candidate),
        party: text(candidate.party) || undefined,
        incumbent: candidate.incumbent === true || text(candidate.incumbent).toUpperCase() === "X",
        votes,
        percentage,
        percentageDisplay: `${percentage.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
        winner: winnerFlag === "X",
        runoff: winnerFlag === "R"
      };
    })
    .sort((a, b) => b.votes - a.votes);
}

export function normalizeRaces(data: unknown, stateFilter?: string): RaceResult[] {
  const root = record(data);
  const races = array(root.races);
  const normalized: RaceResult[] = [];

  for (const value of races) {
    const race = record(value);
    const units = array(race.reportingUnits).map(record);
    const desired = units.find((unit) => {
      const state = text(unit.statePostal).toUpperCase();
      const level = text(unit.level ?? unit.reportingunitLevel).toLowerCase();
      return (!stateFilter || state === stateFilter.toUpperCase()) && (level === "state" || level === "national");
    }) || units.find((unit) => !stateFilter || text(unit.statePostal).toUpperCase() === stateFilter.toUpperCase());

    if (!desired) continue;
    const candidates = candidateResults(array(desired.candidates));
    const statePostal = text(desired.statePostal || stateFilter).toUpperCase();

    normalized.push({
      raceId: text(race.raceID ?? race.raceId),
      statePostal,
      stateName: text(desired.stateName) || undefined,
      officeId: text(race.officeID ?? race.officeId),
      officeName: text(race.officeName),
      seatName: text(race.seatName) || undefined,
      seatNumber: text(race.seatNum ?? race.seatNumber) || undefined,
      description: text(race.description) || undefined,
      eevp: number(race.eevp),
      reportingPercentage: number(desired.precinctsReportingPct),
      called: candidates.some((candidate) => candidate.winner),
      runoff: candidates.some((candidate) => candidate.runoff),
      lastUpdated: text(desired.lastUpdated) || undefined,
      candidates
    });
  }

  return normalized;
}

export function normalizeHouseNationalVote(data: unknown) {
  return normalizeRaces(data, "US").find((race) => race.raceId === "999999") ?? normalizeRaces(data, "US")[0] ?? null;
}
