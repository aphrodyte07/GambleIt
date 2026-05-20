import { NextResponse } from "next/server";
import { getTodayFixtures, getTeamStats, getH2H, getFDFixtures, getFDStandings, getInjuries, getAPIFootballPrediction, FD_TO_APIFOOTBALL_ID } from "../../../lib/football";
import { getPrediction } from "../../../lib/gemini";
import { MatchData } from "../../../types";

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionCode = searchParams.get("competition") || "PL";
    const leagueIdStr = searchParams.get("leagueId");

    const fixtures = await getFDFixtures(competitionCode);
    const standings = await getFDStandings(competitionCode);

    const predictionsPromises = fixtures.map(async (fixture) => {
      const homeFDId = fixture.homeTeam.id;
      const awayFDId = fixture.awayTeam.id;

      const homeAPIId = FD_TO_APIFOOTBALL_ID[homeFDId];
      const awayAPIId = FD_TO_APIFOOTBALL_ID[awayFDId];

      if (!homeAPIId || !awayAPIId) {
        console.warn(`Missing API-Football ID mapping for ${fixture.homeTeam.name} (${homeFDId}) or ${fixture.awayTeam.name} (${awayFDId})`);
      }

      let homeStats, awayStats, h2h, homeInjuries, awayInjuries, apiPrediction;

      if (homeAPIId && awayAPIId) {
        const leagueId = leagueIdStr ? parseInt(leagueIdStr) : 39;
        const season = searchParams.get("season") ? parseInt(searchParams.get("season")!) : new Date().getFullYear();

        [homeStats, awayStats, h2h, homeInjuries, awayInjuries, apiPrediction] = await Promise.all([
          Promise.resolve(getTeamStats(homeAPIId as any)),
          Promise.resolve(getTeamStats(awayAPIId as any)),
          getH2H(homeAPIId, awayAPIId),
          getInjuries(homeAPIId, fixture.id),
          getInjuries(awayAPIId, fixture.id),
          getAPIFootballPrediction(fixture.id)
        ]);
      } else {
        homeStats = getTeamStats(fixture.homeTeam.name);
        awayStats = getTeamStats(fixture.awayTeam.name);
      }

      const homeStanding = standings.find(s => s.team.id === homeFDId);
      const awayStanding = standings.find(s => s.team.id === awayFDId);

      const prediction = await getPrediction(
        fixture,
        homeStats,
        awayStats,
        h2h ?? undefined,
        homeInjuries,
        awayInjuries,
        apiPrediction ?? undefined,
        homeStanding,
        awayStanding
      );

      return { fixture, prediction } as MatchData;
    });

    const predictions = await Promise.all(predictionsPromises);

    return NextResponse.json({
      predictions,
      generatedAt: new Date().toISOString(),
      total: predictions.length,
    });
  } catch (error) {
    console.error("Error generating predictions:", error);
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 });
  }
}

