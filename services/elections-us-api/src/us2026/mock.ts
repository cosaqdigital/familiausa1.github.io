import { US_GENERAL_ELECTION_DATE } from "./constants";
import { usElectionTimeline } from "./timeline";
import type { FloridaResponse, UsElectionSummary } from "./types";

const now = new Date("2026-11-03T22:15:00-05:00");

export function demoSummary(): UsElectionSummary {
  return {
    version: 1,
    electionDate: US_GENERAL_ELECTION_DATE,
    status: "counting",
    message: "DEMO de validacao visual. Estes numeros nao sao resultados reais.",
    snapshotAt: now.toISOString(),
    timeline: { ...usElectionTimeline(now), title: "DEMO — apuracao simulada" },
    provider: { name: "Associated Press Elections API", configured: false, resultsType: "test", demo: true },
    source: {
      resultsProvider: "Dados simulados para teste",
      certificationAuthority: "Autoridades eleitorais estaduais e locais",
      note: "Apenas para validacao da interface."
    },
    balance: {
      house: {
        officeCode: "H",
        officeName: "U.S. House",
        test: true,
        parties: [
          { party: "Dem", current: 212, won: 146, leading: 63, holdovers: 0, winningTrend: 209, insufficientVote: 5 },
          { party: "GOP", current: 220, won: 151, leading: 67, holdovers: 0, winningTrend: 218, insufficientVote: 3 },
          { party: "Others", current: 3, won: 2, leading: 1, holdovers: 0, winningTrend: 3, insufficientVote: 0 }
        ]
      },
      senate: {
        officeCode: "S",
        officeName: "U.S. Senate",
        test: true,
        parties: [
          { party: "Dem", current: 47, won: 12, leading: 7, holdovers: 28, winningTrend: 47, insufficientVote: 1 },
          { party: "GOP", current: 51, won: 14, leading: 8, holdovers: 29, winningTrend: 51, insufficientVote: 1 },
          { party: "Others", current: 2, won: 0, leading: 0, holdovers: 2, winningTrend: 2, insufficientVote: 0 }
        ]
      },
      governors: {
        officeCode: "G",
        officeName: "Governors",
        test: true,
        parties: [
          { party: "Dem", current: 23, won: 8, leading: 5, holdovers: 10, winningTrend: 23, insufficientVote: 1 },
          { party: "GOP", current: 27, won: 9, leading: 6, holdovers: 12, winningTrend: 27, insufficientVote: 1 }
        ]
      }
    },
    houseNationalVote: null,
    links: {
      apDocumentation: "https://developer.ap.org/ap-elections-api/",
      electionAdministration: "https://www.eac.gov/where-do-i-find-election-results",
      floridaElections: "https://dos.fl.gov/elections/"
    },
    warnings: ["DEMO: dados simulados, nao publicar como resultado real."]
  };
}

export function demoFlorida(): FloridaResponse {
  return {
    version: 1,
    electionDate: US_GENERAL_ELECTION_DATE,
    status: "counting",
    message: "DEMO de validacao visual da Florida.",
    snapshotAt: now.toISOString(),
    timeline: { ...usElectionTimeline(now), title: "DEMO — Florida" },
    provider: { name: "Associated Press Elections API", configured: false, resultsType: "test", demo: true },
    source: {
      resultsProvider: "Dados simulados para teste",
      certificationAuthority: "Florida Division of Elections e autoridades locais",
      note: "Apenas para validacao da interface."
    },
    races: [
      {
        raceId: "demo-governor",
        statePostal: "FL",
        stateName: "Florida",
        officeId: "G",
        officeName: "Governor",
        eevp: 62,
        reportingPercentage: 58.4,
        called: false,
        runoff: false,
        lastUpdated: now.toISOString(),
        candidates: [
          { id: "demo-1", name: "Candidate A", party: "GOP", incumbent: false, votes: 3120450, percentage: 51.4, percentageDisplay: "51,40%", winner: false, runoff: false },
          { id: "demo-2", name: "Candidate B", party: "Dem", incumbent: false, votes: 2948400, percentage: 48.6, percentageDisplay: "48,60%", winner: false, runoff: false }
        ]
      },
      {
        raceId: "demo-senate",
        statePostal: "FL",
        stateName: "Florida",
        officeId: "S",
        officeName: "U.S. Senate",
        eevp: 61,
        reportingPercentage: 57.9,
        called: false,
        runoff: false,
        lastUpdated: now.toISOString(),
        candidates: [
          { id: "demo-3", name: "Candidate C", party: "GOP", incumbent: false, votes: 3052200, percentage: 50.7, percentageDisplay: "50,70%", winner: false, runoff: false },
          { id: "demo-4", name: "Candidate D", party: "Dem", incumbent: false, votes: 2967800, percentage: 49.3, percentageDisplay: "49,30%", winner: false, runoff: false }
        ]
      }
    ],
    links: {
      floridaElections: "https://dos.fl.gov/elections/",
      apDocumentation: "https://developer.ap.org/ap-elections-api/"
    },
    warnings: ["DEMO: dados simulados, nao publicar como resultado real."]
  };
}
