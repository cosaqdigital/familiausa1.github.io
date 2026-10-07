import {
  US_ELECTION_DAY_START,
  US_POST_ELECTION_START,
  US_RESULTS_WINDOW_START
} from "./constants";
import type { TimelineState } from "./types";

const DAY_START = Date.parse(US_ELECTION_DAY_START);
const RESULTS_START = Date.parse(US_RESULTS_WINDOW_START);
const POST_START = Date.parse(US_POST_ELECTION_START);

export function usElectionTimeline(now = new Date()): TimelineState {
  const timestamp = now.getTime();

  if (timestamp < DAY_START) {
    return {
      phase: "before-election",
      title: "Midterms confirmadas para 3 de novembro de 2026",
      message: "A pagina esta preparada para acompanhar Camara, Senado, governadores e os principais resultados da Florida.",
      nextTransitionAt: US_ELECTION_DAY_START,
      shouldPoll: false
    };
  }

  if (timestamp < RESULTS_START) {
    return {
      phase: "election-day",
      title: "Election Day em andamento",
      message: "Os horarios de votacao variam por estado. Resultados preliminares comecam a aparecer conforme as urnas fecham.",
      nextTransitionAt: US_RESULTS_WINDOW_START,
      shouldPoll: true
    };
  }

  if (timestamp < POST_START) {
    return {
      phase: "polls-closing",
      title: "Urnas fechando e apuracao comecando",
      message: "Os estados divulgam resultados preliminares em horarios diferentes. A pagina atualiza automaticamente.",
      nextTransitionAt: US_POST_ELECTION_START,
      shouldPoll: true
    };
  }

  return {
    phase: "counting",
    title: "Apuracao em andamento nos Estados Unidos",
    message: "A contagem pode continuar por horas ou dias em alguns estados. Resultados da noite eleitoral permanecem preliminares ate a certificacao.",
    shouldPoll: true
  };
}
