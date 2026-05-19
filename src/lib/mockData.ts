import { Fixture, TeamStats } from "../types";

export const MOCK_FIXTURES: Fixture[] = [
  {
    id: 1,
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    homeTeam: { id: 66, name: "Manchester United FC", shortName: "Man United", crest: "https://crests.football-data.org/66.png" },
    awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool", crest: "https://crests.football-data.org/64.png" },
    league: { id: 2021, name: "Premier League", country: "England", emblem: "https://crests.football-data.org/PL.png" },
    venue: "Old Trafford",
    status: "SCHEDULED"
  },
  {
    id: 2,
    date: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    homeTeam: { id: 57, name: "Arsenal FC", shortName: "Arsenal", crest: "https://crests.football-data.org/57.png" },
    awayTeam: { id: 65, name: "Manchester City FC", shortName: "Man City", crest: "https://crests.football-data.org/65.png" },
    league: { id: 2021, name: "Premier League", country: "England", emblem: "https://crests.football-data.org/PL.png" },
    venue: "Emirates Stadium",
    status: "SCHEDULED"
  },
  {
    id: 3,
    date: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    homeTeam: { id: 86, name: "Real Madrid CF", shortName: "Real Madrid", crest: "https://crests.football-data.org/86.png" },
    awayTeam: { id: 81, name: "FC Barcelona", shortName: "Barcelona", crest: "https://crests.football-data.org/81.png" },
    league: { id: 2014, name: "La Liga", country: "Spain", emblem: "https://crests.football-data.org/PD.png" },
    venue: "Santiago Bernabéu",
    status: "SCHEDULED"
  },
  {
    id: 4,
    date: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    homeTeam: { id: 5, name: "FC Bayern München", shortName: "Bayern Munich", crest: "https://crests.football-data.org/5.png" },
    awayTeam: { id: 4, name: "Borussia Dortmund", shortName: "Dortmund", crest: "https://crests.football-data.org/4.png" },
    league: { id: 2002, name: "Bundesliga", country: "Germany", emblem: "https://crests.football-data.org/BL1.png" },
    venue: "Allianz Arena",
    status: "SCHEDULED"
  },
  {
    id: 5,
    date: new Date(new Date().setHours(19, 45, 0, 0)).toISOString(),
    homeTeam: { id: 98, name: "AC Milan", shortName: "AC Milan", crest: "https://crests.football-data.org/98.png" },
    awayTeam: { id: 108, name: "FC Internazionale Milano", shortName: "Inter Milan", crest: "https://crests.football-data.org/108.png" },
    league: { id: 2019, name: "Serie A", country: "Italy", emblem: "https://crests.football-data.org/SA.png" },
    venue: "San Siro",
    status: "SCHEDULED"
  },
  {
    id: 6,
    date: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    homeTeam: { id: 524, name: "Paris Saint-Germain FC", shortName: "PSG", crest: "https://crests.football-data.org/524.png" },
    awayTeam: { id: 523, name: "Olympique Lyonnais", shortName: "Lyon", crest: "https://crests.football-data.org/523.png" },
    league: { id: 2015, name: "Ligue 1", country: "France", emblem: "https://crests.football-data.org/FL1.png" },
    venue: "Parc des Princes",
    status: "SCHEDULED"
  },
  {
    id: 7,
    date: new Date(new Date().setHours(15, 15, 0, 0)).toISOString(),
    homeTeam: { id: 81, name: "FC Barcelona", shortName: "Barcelona", crest: "https://crests.football-data.org/81.png" },
    awayTeam: { id: 78, name: "Club Atlético de Madrid", shortName: "Atletico Madrid", crest: "https://crests.football-data.org/78.png" },
    league: { id: 2014, name: "La Liga", country: "Spain", emblem: "https://crests.football-data.org/PD.png" },
    venue: "Camp Nou",
    status: "SCHEDULED"
  },
  {
    id: 8,
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea", crest: "https://crests.football-data.org/61.png" },
    awayTeam: { id: 73, name: "Tottenham Hotspur FC", shortName: "Tottenham", crest: "https://crests.football-data.org/73.png" },
    league: { id: 2021, name: "Premier League", country: "England", emblem: "https://crests.football-data.org/PL.png" },
    venue: "Stamford Bridge",
    status: "SCHEDULED"
  },
  {
    id: 9,
    date: new Date(new Date().setHours(19, 45, 0, 0)).toISOString(),
    homeTeam: { id: 109, name: "Juventus FC", shortName: "Juventus", crest: "https://crests.football-data.org/109.png" },
    awayTeam: { id: 108, name: "FC Internazionale Milano", shortName: "Inter Milan", crest: "https://crests.football-data.org/108.png" },
    league: { id: 2019, name: "Serie A", country: "Italy", emblem: "https://crests.football-data.org/SA.png" },
    venue: "Allianz Stadium",
    status: "SCHEDULED"
  },
  {
    id: 10,
    date: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    homeTeam: { id: 516, name: "Olympique de Marseille", shortName: "Marseille", crest: "https://crests.football-data.org/516.png" },
    awayTeam: { id: 524, name: "Paris Saint-Germain FC", shortName: "PSG", crest: "https://crests.football-data.org/524.png" },
    league: { id: 2015, name: "Ligue 1", country: "France", emblem: "https://crests.football-data.org/FL1.png" },
    venue: "Orange Vélodrome",
    status: "SCHEDULED"
  },
  {
    id: 11,
    date: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    homeTeam: { id: 4, name: "Borussia Dortmund", shortName: "Dortmund", crest: "https://crests.football-data.org/4.png" },
    awayTeam: { id: 721, name: "RB Leipzig", shortName: "Leipzig", crest: "https://crests.football-data.org/721.png" },
    league: { id: 2002, name: "Bundesliga", country: "Germany", emblem: "https://crests.football-data.org/BL1.png" },
    venue: "Signal Iduna Park",
    status: "SCHEDULED"
  },
  {
    id: 12,
    date: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    homeTeam: { id: 57, name: "Arsenal FC", shortName: "Arsenal", crest: "https://crests.football-data.org/57.png" },
    awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea", crest: "https://crests.football-data.org/61.png" },
    league: { id: 2021, name: "Premier League", country: "England", emblem: "https://crests.football-data.org/PL.png" },
    venue: "Emirates Stadium",
    status: "SCHEDULED"
  }
];

export const MOCK_STATS: Record<string, TeamStats> = {
  "Manchester United FC": { form: "DWLWW", goalsScored: 35, goalsConceded: 25, wins: 12, draws: 4, losses: 6 },
  "Liverpool FC": { form: "WWWWD", goalsScored: 55, goalsConceded: 18, wins: 16, draws: 5, losses: 1 },
  "Arsenal FC": { form: "WWDWW", goalsScored: 52, goalsConceded: 16, wins: 15, draws: 4, losses: 3 },
  "Manchester City FC": { form: "WWWDW", goalsScored: 58, goalsConceded: 20, wins: 16, draws: 4, losses: 2 },
  "Chelsea FC": { form: "LWDLW", goalsScored: 38, goalsConceded: 32, wins: 9, draws: 5, losses: 8 },
  "Tottenham Hotspur FC": { form: "WLDWW", goalsScored: 42, goalsConceded: 30, wins: 11, draws: 4, losses: 7 },
  "Real Madrid CF": { form: "WWWWD", goalsScored: 50, goalsConceded: 15, wins: 18, draws: 4, losses: 1 },
  "FC Barcelona": { form: "WWDWW", goalsScored: 48, goalsConceded: 19, wins: 16, draws: 5, losses: 2 },
  "Club Atlético de Madrid": { form: "DWWLW", goalsScored: 38, goalsConceded: 22, wins: 13, draws: 3, losses: 6 },
  "FC Bayern München": { form: "WWLWW", goalsScored: 60, goalsConceded: 22, wins: 16, draws: 2, losses: 4 },
  "Borussia Dortmund": { form: "DWWLD", goalsScored: 45, goalsConceded: 28, wins: 11, draws: 6, losses: 5 },
  "RB Leipzig": { form: "LWWWD", goalsScored: 40, goalsConceded: 25, wins: 12, draws: 4, losses: 6 },
  "AC Milan": { form: "WWDWL", goalsScored: 42, goalsConceded: 24, wins: 14, draws: 4, losses: 5 },
  "FC Internazionale Milano": { form: "WWWWW", goalsScored: 55, goalsConceded: 12, wins: 19, draws: 3, losses: 1 },
  "Juventus FC": { form: "DWDWW", goalsScored: 36, goalsConceded: 15, wins: 15, draws: 6, losses: 2 },
  "Paris Saint-Germain FC": { form: "WWDWW", goalsScored: 56, goalsConceded: 18, wins: 17, draws: 5, losses: 1 },
  "Olympique Lyonnais": { form: "LWWLW", goalsScored: 32, goalsConceded: 35, wins: 9, draws: 4, losses: 10 },
  "Olympique de Marseille": { form: "DDWLD", goalsScored: 34, goalsConceded: 26, wins: 8, draws: 9, losses: 6 },
};
