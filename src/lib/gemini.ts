import { Fixture, Prediction, TeamStats } from "../types";

export async function getPrediction(fixture: Fixture, homeStats: TeamStats, awayStats: TeamStats): Promise<Prediction> {
  const fallback = () => {
    const homeStrength = homeStats.wins * 3 + homeStats.draws + homeStats.goalsScored - homeStats.goalsConceded;
    const awayStrength = awayStats.wins * 3 + awayStats.draws + awayStats.goalsScored - awayStats.goalsConceded;
    
    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    
    const homeWinPct = clamp(40 + homeStrength - awayStrength, 20, 70);
    const awayWinPct = clamp(30 + awayStrength - homeStrength, 15, 65);
    let drawPct = 100 - homeWinPct - awayWinPct;
    if (drawPct < 10) {
      drawPct = 10;
      // adjust home/away if draw was clamped
    }
    
    // Recalculate correctly to ensure sum is 100
    const diff = (homeWinPct + awayWinPct + drawPct) - 100;
    let finalHomePct = homeWinPct;
    if (diff > 0) finalHomePct -= diff;

    const maxPct = Math.max(finalHomePct, drawPct, awayWinPct);
    let outcome: "Home Win" | "Draw" | "Away Win" = "Draw";
    if (maxPct === finalHomePct) outcome = "Home Win";
    else if (maxPct === awayWinPct) outcome = "Away Win";

    const confidence = clamp(maxPct, 52, 85);
    const homeGoals = Math.round(homeStats.goalsScored / (homeStats.wins + homeStats.draws + homeStats.losses || 1));
    const awayGoals = Math.round(awayStats.goalsScored / (awayStats.wins + awayStats.draws + awayStats.losses || 1));
    const scoreline = `${homeGoals}-${awayGoals}`;
    
    const totalAvg = homeGoals + awayGoals;
    let bettingTip = "Both Teams to Score";
    if (totalAvg > 3) bettingTip = "Over 2.5 Goals";
    else if (totalAvg < 2) bettingTip = "Under 2.5 Goals";
    else if (homeStats.goalsConceded <= 20) bettingTip = "Clean Sheet Home";
    else if (homeWinPct > 45 && drawPct < 30) bettingTip = "Draw No Bet";
    
    return {
      fixtureId: fixture.id,
      homeTeam: fixture.homeTeam.name,
      awayTeam: fixture.awayTeam.name,
      outcome,
      confidence,
      scoreline,
      bettingTip,
      insight: `${fixture.homeTeam.name} take on ${fixture.awayTeam.name} in a crucial ${fixture.league.name} fixture where recent form and home advantage are key factors.`,
      homeWinPct: finalHomePct,
      drawPct,
      awayWinPct,
      detailedAnalysis: `This is a highly anticipated clash between ${fixture.homeTeam.name} and ${fixture.awayTeam.name}. Looking at the recent form, ${fixture.homeTeam.name} comes into this match with a form of ${homeStats.form}, having scored ${homeStats.goalsScored} goals this season. On the other hand, ${fixture.awayTeam.name} has a form of ${awayStats.form} and has conceded ${awayStats.goalsConceded} goals.\n\nTactically, this game will likely be decided in the midfield. ${fixture.homeTeam.name}'s ability to control the tempo at home could be the deciding factor against a potentially stubborn ${fixture.awayTeam.name} defense. Given the stats, we expect a closely contested match with few clear-cut opportunities.`,
      additionalBets: [
        { tip: totalAvg > 2.5 ? "Over 1.5 Goals" : "Under 3.5 Goals", probability: clamp(65 + Math.floor(totalAvg * 3), 60, 85) },
        { tip: homeStrength > awayStrength ? "Home Team to Score First" : "Away Team to Score First", probability: clamp(55 + Math.abs(homeStrength - awayStrength) * 2, 50, 80) },
        { tip: "Most Goals in 2nd Half", probability: clamp(50 + Math.floor((homeStats.goalsScored + awayStats.goalsScored) / 4), 45, 75) }
      ]
    };
  };

  if (!process.env.GEMINI_API_KEY) {
    return fallback();
  }

  try {
    const prompt = `You are an expert football analyst and data scientist. Analyze the following match data and return a prediction as a single raw JSON object. Return ONLY the JSON. No markdown, no backticks, no explanation, no preamble. Just the JSON object.

Match: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}
League: ${fixture.league.name}, ${fixture.league.country}
Venue: ${fixture.venue}

${fixture.homeTeam.name} Statistics:
- Recent form (last 5 games, most recent last): ${homeStats.form}
- Goals scored this season: ${homeStats.goalsScored}
- Goals conceded this season: ${homeStats.goalsConceded}
- Season record: ${homeStats.wins} wins, ${homeStats.draws} draws, ${homeStats.losses} losses

${fixture.awayTeam.name} Statistics:
- Recent form (last 5 games, most recent last): ${awayStats.form}
- Goals scored this season: ${awayStats.goalsScored}
- Goals conceded this season: ${awayStats.goalsConceded}
- Season record: ${awayStats.wins} wins, ${awayStats.draws} draws, ${awayStats.losses} losses

Return this exact JSON structure with no other text:
{
  "outcome": "Home Win" or "Draw" or "Away Win",
  "confidence": a number between 52 and 88,
  "scoreline": predicted score as "X-Y" e.g. "2-1",
  "bettingTip": one of exactly these strings: "Over 2.5 Goals" or "Under 2.5 Goals" or "Both Teams to Score" or "Draw No Bet" or "Clean Sheet Home" or "Clean Sheet Away",
  "insight": one compelling sentence explaining the key reason for this prediction,
  "homeWinPct": integer,
  "drawPct": integer,
  "awayWinPct": integer,
  "detailedAnalysis": "A detailed 2-3 paragraph analysis of the match explaining the tactical matchup, recent form, and why the predicted outcome and betting tips are likely.",
  "additionalBets": [
    { "tip": "A specific realistic betting tip", "probability": integer between 50 and 95 },
    { "tip": "Another distinct betting tip", "probability": integer between 50 and 95 },
    { "tip": "A third distinct betting tip", "probability": integer between 50 and 95 }
  ]
}
CRITICAL INSTRUCTIONS:
- Ensure homeWinPct + drawPct + awayWinPct = exactly 100.
- Analyze defensive and offensive records carefully. If defenses are strong or scoring is low, choose "Under 2.5 Goals", "Clean Sheet Home", or "Clean Sheet Away". Do NOT default to "Over 2.5 Goals" unless both teams score heavily.
- Provide exactly 3 additionalBets. Ensure they are varied, highly specific to the matchup (e.g., "Home Team to Score First", "Under 1.5 Goals 1st Half", "Away Team Over 0.5 Goals"), and have distinct, realistic probabilities. Do not repeat the same tips or probabilities across different matches.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch from Gemini");
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      fixtureId: fixture.id,
      homeTeam: fixture.homeTeam.name,
      awayTeam: fixture.awayTeam.name
    };
  } catch (error) {
    console.error("Gemini API Error or Parse Error:", error);
    return fallback();
  }
}
