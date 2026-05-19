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

    // Generate Recommended Parlays
    const allValidBets: import("../../../types").ParlayLeg[] = [];
    predictions.forEach(p => {
      p.prediction.additionalBets.forEach(bet => {
        allValidBets.push({
          fixtureId: p.fixture.id,
          match: `${p.fixture.homeTeam.shortName} vs ${p.fixture.awayTeam.shortName}`,
          tip: bet.tip,
          probability: bet.probability,
          odds: bet.odds
        });
      });
    });

    // Sort by safest bets first
    allValidBets.sort((a, b) => b.probability - a.probability);

    const generateParlay = (numLegs: number, typeName: string) => {
      const usedFixtures = new Set();
      const legs = [];
      for (const bet of allValidBets) {
        if (!usedFixtures.has(bet.fixtureId)) {
          legs.push(bet);
          usedFixtures.add(bet.fixtureId);
        }
        if (legs.length === numLegs) break;
      }
      
      if (legs.length < numLegs) return null;

      const totalOddsDec = legs.reduce((acc, leg) => acc * parseFloat(leg.odds), 1);
      return {
        type: typeName,
        legs,
        totalOdds: totalOddsDec.toFixed(2),
        totalPayout: `${totalOddsDec.toFixed(2)}x`
      };
    };

    const recommendedParlays = [
      generateParlay(3, "3-Leg Safe Builder"),
      generateParlay(4, "4-Leg Solid Value"),
      generateParlay(5, "5-Leg Maximizer")
    ].filter(Boolean);

    return NextResponse.json({
      predictions,
      parlays: recommendedParlays,
      generatedAt: new Date().toISOString(),
      total: predictions.length
    });
  } catch (error) {
    console.error("Error generating predictions:", error);
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 });
  }
}
