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
    let homeGoals = Math.round(homeStats.goalsScored / (homeStats.wins + homeStats.draws + homeStats.losses || 1));
    let awayGoals = Math.round(awayStats.goalsScored / (awayStats.wins + awayStats.draws + awayStats.losses || 1));
    
    // Force scoreline to match the predicted outcome
    if (outcome === "Home Win") {
      if (homeGoals <= awayGoals) homeGoals = awayGoals + 1;
    } else if (outcome === "Away Win") {
      if (awayGoals <= homeGoals) awayGoals = homeGoals + 1;
    } else { // Draw
      const avg = Math.round((homeGoals + awayGoals) / 2);
      homeGoals = avg;
      awayGoals = avg;
    }

    const scoreline = `${homeGoals}-${awayGoals}`;
    const totalGoals = homeGoals + awayGoals;
    
    const additionalBets = [
      { tip: "Double Chance: 1X (Home or Draw)", probability: clamp(homeWinPct + drawPct, 10, 95) },
      { tip: "Double Chance: X2 (Away or Draw)", probability: clamp(awayWinPct + drawPct, 10, 95) },
      { tip: "Double Chance: 12 (Home or Away)", probability: clamp(homeWinPct + awayWinPct, 10, 95) },
      { tip: "Over 2.5 Goals", probability: clamp(30 + (totalGoals - 2.5) * 20, 10, 90) },
      { tip: "Under 2.5 Goals", probability: clamp(70 - (totalGoals - 2.5) * 20, 10, 90) },
      { tip: "BTTS: Yes", probability: clamp(40 + (totalGoals - 2.0) * 15, 10, 90) },
      { tip: "BTTS: No", probability: clamp(60 - (totalGoals - 2.0) * 15, 10, 90) },
      { tip: "Handicap: Home +1.5", probability: clamp(homeWinPct + drawPct + 15, 20, 95) },
      { tip: "Handicap: Away +1.5", probability: clamp(awayWinPct + drawPct + 15, 20, 95) }
    ];

    // Select the best logically consistent bettingTip
    let validBets = [...additionalBets];
    if (totalGoals < 3) validBets = validBets.filter(b => b.tip !== "Over 2.5 Goals");
    if (totalGoals > 2) validBets = validBets.filter(b => b.tip !== "Under 2.5 Goals");
    if (homeGoals === 0 || awayGoals === 0) validBets = validBets.filter(b => b.tip !== "BTTS: Yes");
    if (homeGoals > 0 && awayGoals > 0) validBets = validBets.filter(b => b.tip !== "BTTS: No");
    if (outcome === "Home Win") validBets = validBets.filter(b => !b.tip.includes("X2"));
    if (outcome === "Away Win") validBets = validBets.filter(b => !b.tip.includes("1X"));
    if (outcome === "Draw") validBets = validBets.filter(b => !b.tip.includes("12"));
    
    validBets.sort((a, b) => b.probability - a.probability);
    const bettingTip = validBets[0]?.tip || "Under 2.5 Goals";
    
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
      additionalBets
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
  "bettingTip": "Select the SINGLE BEST bet from your 9 additionalBets. It MUST logically match your scoreline.",
  "insight": one compelling sentence explaining the key reason for this prediction,
  "homeWinPct": integer,
  "drawPct": integer,
  "awayWinPct": integer,
  "detailedAnalysis": "A detailed 2-3 paragraph analysis of the match explaining the tactical matchup, recent form, and why the predicted outcome and betting tips are likely.",
  "additionalBets": [
    { "tip": "Double Chance: 1X (Home or Draw)", "probability": integer },
    { "tip": "Double Chance: X2 (Away or Draw)", "probability": integer },
    { "tip": "Double Chance: 12 (Home or Away)", "probability": integer },
    { "tip": "Over 2.5 Goals", "probability": integer },
    { "tip": "Under 2.5 Goals", "probability": integer },
    { "tip": "BTTS: Yes", "probability": integer },
    { "tip": "BTTS: No", "probability": integer },
    { "tip": "Handicap: Home +1.5", "probability": integer },
    { "tip": "Handicap: Away +1.5", "probability": integer }
  ]
}
CRITICAL INSTRUCTIONS:
- Ensure homeWinPct + drawPct + awayWinPct = exactly 100.
- CRITICAL: The 'outcome', 'scoreline', and 'bettingTip' MUST be perfectly logically consistent. If outcome is 'Home Win', the home team MUST score more goals in the scoreline.
- For additionalBets, calculate realistic probabilities based on your analysis for EXACTLY the 9 bet types listed above.
- Your main 'bettingTip' MUST be the exact name of whichever of the 9 bets you calculate has the highest probability of success, while ensuring it logically aligns with your predicted scoreline. Do not default to the same bet every time. Explore all options and pick the best value.`;

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
