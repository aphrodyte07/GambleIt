export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Fixture {
  id: number;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  league: {
    id: number;
    name: string;
    country: string;
    emblem: string;
  };
  venue: string;
  status: string;
}

export interface TeamStats {
  form: string;
  goalsScored: number;
  goalsConceded: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface AdditionalBet {
  tip: string;
  probability: number;
  odds: string;
}

export interface Prediction {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  outcome: "Home Win" | "Draw" | "Away Win";
  confidence: number;
  scoreline: string;
  bettingTip: string;
  insight: string;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  detailedAnalysis: string;
  additionalBets: AdditionalBet[];
}

export interface ParlayLeg {
  fixtureId: number;
  match: string;
  tip: string;
  probability: number;
  odds: string;
}

export interface Parlay {
  type: string; // e.g. "3-Leg Safe Parlay"
  legs: ParlayLeg[];
  totalOdds: string;
  totalPayout: string; // e.g. "3.2x"
}

export interface MatchData {
  fixture: Fixture;
  prediction: Prediction;
}
