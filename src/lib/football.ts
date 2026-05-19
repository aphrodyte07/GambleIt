import { Fixture, TeamStats } from "../types";
import { MOCK_FIXTURES, MOCK_STATS } from "./mockData";

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
  return {
    form: "WDWDW",
    goalsScored: 30,
    goalsConceded: 28,
    wins: 10,
    draws: 5,
    losses: 8,
  };
}
