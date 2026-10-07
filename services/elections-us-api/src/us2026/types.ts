export type UsElectionPhase =
  | "before-election"
  | "election-day"
  | "polls-closing"
  | "counting"
  | "post-election";

export type UsApiStatus =
  | "ready"
  | "waiting-provider"
  | "waiting-results"
  | "voting"
  | "counting"
  | "post-election"
  | "temporarily-unavailable"
  | "invalid-request";

export type TimelineState = {
  phase: UsElectionPhase;
  title: string;
  message: string;
  nextTransitionAt?: string;
  shouldPoll: boolean;
};

export type PartyTrend = {
  party: "Dem" | "GOP" | "Others" | string;
  current: number;
  won: number;
  leading: number;
  holdovers: number;
  winningTrend: number;
  insufficientVote: number;
  netChangeWinners?: number;
  netChangeLeaders?: number;
};

export type BalanceReport = {
  officeCode: "H" | "S" | "G" | string;
  officeName: string;
  timestamp?: string;
  test: boolean;
  parties: PartyTrend[];
};

export type CandidateResult = {
  id: string;
  name: string;
  party?: string;
  incumbent: boolean;
  votes: number;
  percentage: number;
  percentageDisplay: string;
  winner: boolean;
  runoff: boolean;
};

export type RaceResult = {
  raceId: string;
  statePostal: string;
  stateName?: string;
  officeId: string;
  officeName: string;
  seatName?: string;
  seatNumber?: string;
  description?: string;
  eevp: number;
  reportingPercentage: number;
  called: boolean;
  runoff: boolean;
  lastUpdated?: string;
  candidates: CandidateResult[];
};

export type ProviderState = {
  name: "Associated Press Elections API";
  configured: boolean;
  resultsType: "live" | "test";
  demo: boolean;
};

export type SourceInfo = {
  resultsProvider: string;
  certificationAuthority: string;
  note: string;
};

export type UsElectionSummary = {
  version: 1;
  electionDate: string;
  status: UsApiStatus;
  message: string;
  snapshotAt: string;
  timeline: TimelineState;
  provider: ProviderState;
  source: SourceInfo;
  balance: {
    house: BalanceReport | null;
    senate: BalanceReport | null;
    governors: BalanceReport | null;
  };
  houseNationalVote?: RaceResult | null;
  links: {
    apDocumentation: string;
    electionAdministration: string;
    floridaElections: string;
  };
  warnings: string[];
};

export type FloridaResponse = {
  version: 1;
  electionDate: string;
  status: UsApiStatus;
  message: string;
  snapshotAt: string;
  timeline: TimelineState;
  provider: ProviderState;
  source: SourceInfo;
  races: RaceResult[];
  links: {
    floridaElections: string;
    apDocumentation: string;
  };
  warnings: string[];
};
