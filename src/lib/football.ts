import { Fixture, TeamStats, H2HRecord, Injury, Standing, APIFootballPrediction } from "../types";
import { MOCK_FIXTURES, MOCK_STATS } from "./mockData";

const BASE_URL = "https://api.football-data.org/v4";

export async function getTodayFixtures(): Promise<Fixture[]> {
  if (!process.env.FOOTBALL_API_KEY) {
    return MOCK_FIXTURES;
  }

  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = tomorrow.toISOString().split("T")[0];

    const res = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch fixtures", await res.text());
      return MOCK_FIXTURES;
    }

    const data = await res.json();
    
    if (!data.matches || !Array.isArray(data.matches)) {
        return MOCK_FIXTURES;
    }

    const fixtures = data.matches
      .filter((m: any) => m.status === "SCHEDULED" || m.status === "TIMED")
      .map((m: any) => ({
        id: m.id,
        date: m.utcDate,
        homeTeam: {
          id: m.homeTeam.id,
          name: m.homeTeam.name,
          shortName: m.homeTeam.shortName || m.homeTeam.name,
          crest: m.homeTeam.crest || `https://crests.football-data.org/${m.homeTeam.id}.png`,
        },
        awayTeam: {
          id: m.awayTeam.id,
          name: m.awayTeam.name,
          shortName: m.awayTeam.shortName || m.awayTeam.name,
          crest: m.awayTeam.crest || `https://crests.football-data.org/${m.awayTeam.id}.png`,
        },
        league: {
          id: m.competition.id,
          name: m.competition.name,
          country: m.competition.area?.name || "Unknown",
          emblem: m.competition.emblem || "",
        },
        venue: m.venue || "TBC",
        status: m.status,
      }))
      .slice(0, 12);

    return fixtures.length > 0 ? fixtures : MOCK_FIXTURES;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return MOCK_FIXTURES;
  }
}

export function getTeamStats(teamName: string): TeamStats {
  if (MOCK_STATS[teamName]) {
    return MOCK_STATS[teamName];
  }
  
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const seededRandom = (min: number, max: number) => {
    const x = Math.sin(hash++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const forms = ["WWWDW", "WDLDW", "LLWDL", "LWWWW", "DDLWD", "WLLWW", "DWDDL", "WWLWW", "DDWWW", "LLLLD"];
  return {
    form: forms[Math.abs(hash) % forms.length],
    goalsScored: seededRandom(20, 65),
    goalsConceded: seededRandom(15, 50),
    wins: seededRandom(5, 20),
    draws: seededRandom(3, 10),
    losses: seededRandom(5, 15),
  };
}

export async function getH2H(team1Id: number, team2Id: number): Promise<H2HRecord | null> {
  if (!process.env.FOOTBALL_API_KEY) {
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const matches: any[] = data.matches ?? data.response ?? [];

    if (!Array.isArray(matches) || matches.length === 0) {
      return null;
    }

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    const recentResults: string[] = [];

    for (const m of matches) {
      const homeTeam = m.homeTeam?.name ?? "Home";
      const awayTeam = m.awayTeam?.name ?? "Away";
      const homeScore = m.score?.fullTime?.home ?? m.score?.fullTime?.homeTeam ?? 0;
      const awayScore = m.score?.fullTime?.away ?? m.score?.fullTime?.awayTeam ?? 0;

      recentResults.push(`${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`);

      if (homeScore > awayScore) homeWins++;
      else if (awayScore > homeScore) awayWins++;
      else draws++;
    }

    return { homeWins, awayWins, draws, recentResults };
  } catch {
    return null;
  }
}

export const FD_TO_APIFOOTBALL_ID: Record<number, number> = {
  57: 42,
  58: 66,
  1044: 71,
  402: 55,
  397: 51,
  61: 49,
  354: 52,
  62: 45,
  63: 36,
  349: 61,
  338: 46,
  64: 40,
  65: 50,
  66: 33,
  67: 34,
  351: 65,
  340: 41,
  73: 47,
  56: 48,
  76: 39,
};

export async function getFDFixtures(competitionCode: string): Promise<Fixture[]> {
  if (!process.env.FOOTBALL_DATA_KEY) return [];
  try {
    const res = await fetch(`https://api.football-data.org/v4/competitions/${competitionCode}/matches?status=SCHEDULED`, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_KEY },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.matches || []).map((m: any) => ({
      id: m.id,
      date: m.utcDate,
      homeTeam: {
        id: m.homeTeam.id,
        name: m.homeTeam.name,
        shortName: m.homeTeam.shortName || m.homeTeam.name,
        crest: m.homeTeam.crest || `https://crests.football-data.org/${m.homeTeam.id}.png`,
      },
      awayTeam: {
        id: m.awayTeam.id,
        name: m.awayTeam.name,
        shortName: m.awayTeam.shortName || m.awayTeam.name,
        crest: m.awayTeam.crest || `https://crests.football-data.org/${m.awayTeam.id}.png`,
      },
      league: {
        id: m.competition.id,
        name: m.competition.name,
        country: m.competition.area?.name || "Unknown",
        emblem: m.competition.emblem || "",
      },
      venue: m.venue || "TBC",
      status: m.status,
    }));
  } catch {
    return [];
  }
}

export async function getFDStandings(competitionCode: string): Promise<Standing[]> {
  if (!process.env.FOOTBALL_DATA_KEY) return [];
  try {
    const res = await fetch(`https://api.football-data.org/v4/competitions/${competitionCode}/standings`, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_KEY },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const table = data.standings?.[0]?.table || [];
    return table.map((s: any) => ({
      position: s.position,
      team: { id: s.team.id, name: s.team.name },
      points: s.points,
      won: s.won,
      draw: s.draw,
      lost: s.lost,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      form: s.form || ""
    }));
  } catch {
    return [];
  }
}

export async function getFDTeamInfo(teamId: number): Promise<any> {
  if (!process.env.FOOTBALL_DATA_KEY) return null;
  try {
    const res = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_KEY }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getInjuries(teamId: number, fixtureId: number): Promise<Injury[]> {
  if (!process.env.API_FOOTBALL_KEY) return [];
  try {
    const res = await fetch(`https://v3.football.api-sports.io/injuries?team=${teamId}&fixture=${fixtureId}`, {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.response || !Array.isArray(data.response)) return [];
    return data.response.map((inj: any) => ({
      player: inj.player?.name || "Unknown",
      type: inj.player?.type || "Unknown",
      reason: inj.player?.reason || "Unknown"
    }));
  } catch {
    return [];
  }
}

export async function getAPIFootballPrediction(fixtureId: number): Promise<APIFootballPrediction | null> {
  if (!process.env.API_FOOTBALL_KEY) return null;
  try {
    const res = await fetch(`https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`, {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.response || data.response.length === 0) return null;
    const p = data.response[0];
    return {
      winner: {
        id: p.predictions?.winner?.id || 0,
        name: p.predictions?.winner?.name || "Unknown",
        comment: p.predictions?.winner?.comment || ""
      },
      winOrDraw: p.predictions?.win_or_draw || false,
      underOver: p.predictions?.under_over || "",
      goals: {
        home: p.predictions?.goals?.home || "",
        away: p.predictions?.goals?.away || ""
      },
      advice: p.predictions?.advice || "",
      percent: {
        home: p.predictions?.percent?.home || "",
        draw: p.predictions?.percent?.draw || "",
        away: p.predictions?.percent?.away || ""
      }
    };
  } catch {
    return null;
  }
}
