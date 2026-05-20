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

export interface H2HRecord {
  homeWins: number;
  awayWins: number;
  draws: number;
  recentResults: string[];
}

export interface AdditionalBet {
  tip: string;
  probability: number;
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

export interface MatchData {
  fixture: Fixture;
  prediction: Prediction;
}

export interface ParlayLeg {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  bet: string;
  probability: number;
  decimalOdds: number;
}

export interface ParlaySlip {
  legs: number;
  label: string;
  targetPayoutRange: string;
  totalOdds: number;
  impliedProbability: number;
  picks: ParlayLeg[];
  aiReasoning: string;
}

export interface ParlayRecommendation {
  slips: ParlaySlip[];
  generatedAt: string;
}

export interface Injury {
  player: string;
  type: string;
  reason: string;
}

export interface Standing {
  position: number;
  team: { id: number; name: string };
  points: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string;
}

export interface APIFootballPrediction {
  winner: { id: number; name: string; comment: string };
  winOrDraw: boolean;
  underOver: string;
  goals: { home: string; away: string };
  advice: string;
  percent: { home: string; draw: string; away: string };
}
