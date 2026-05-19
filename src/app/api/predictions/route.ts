import { NextResponse } from "next/server";
import { getTodayFixtures, getTeamStats } from "../../../lib/football";
import { getPrediction } from "../../../lib/gemini";
import { MatchData } from "../../../types";

export const revalidate = 3600;

export async function GET() {
  try {
    const fixtures = await getTodayFixtures();
    
    const predictionsPromises = fixtures.map(async (fixture) => {
      const homeStats = getTeamStats(fixture.homeTeam.name);
      const awayStats = getTeamStats(fixture.awayTeam.name);
      const prediction = await getPrediction(fixture, homeStats, awayStats);
      
      return {
        fixture,
        prediction
      } as MatchData;
    });

    const predictions = await Promise.all(predictionsPromises);

    return NextResponse.json({
      predictions,
      generatedAt: new Date().toISOString(),
      total: predictions.length
    });
  } catch (error) {
    console.error("Error generating predictions:", error);
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 });
  }
}
