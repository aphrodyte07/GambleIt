import { NextResponse } from "next/server";
import { getTodayFixtures, getTeamStats } from "../../../lib/football";
import { getPrediction } from "../../../lib/gemini";
import { buildParlayRecommendation } from "../../../lib/parlay";
import { MatchData } from "../../../types";

export const revalidate = 3600;

export async function GET() {
  try {
    const fixtures = await getTodayFixtures();

    const predictions = await Promise.all(
      fixtures.map(async (fixture) => {
        const homeStats = getTeamStats(fixture.homeTeam.name);
        const awayStats = getTeamStats(fixture.awayTeam.name);
        const prediction = await getPrediction(fixture, homeStats, awayStats);
        return { fixture, prediction } as MatchData;
      })
    );

    const parlay = buildParlayRecommendation(predictions);

    return NextResponse.json(parlay);
  } catch (error) {
    console.error("Error building parlay:", error);
    return NextResponse.json({ error: "Failed to build parlay" }, { status: 500 });
  }
}
