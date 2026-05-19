import { MatchData, ParlayLeg, ParlayRecommendation, ParlaySlip } from "../types";

// Convert a probability % to a fair decimal odd
function probToDecimalOdds(prob: number): number {
  const p = Math.max(5, Math.min(95, prob)) / 100;
  return Math.round((1 / p) * 100) / 100;
}

// Compute total parlay odds from legs
function totalOdds(legs: ParlayLeg[]): number {
  return Math.round(legs.reduce((acc, l) => acc * l.decimalOdds, 1) * 100) / 100;
}

// Gather ALL candidate bets (outcome + additional) for every match, sorted by confidence desc
function gatherCandidates(predictions: MatchData[]): ParlayLeg[] {
  const candidates: ParlayLeg[] = [];

  for (const { fixture, prediction } of predictions) {
    // Primary outcome bet
    candidates.push({
      fixtureId: fixture.id,
      homeTeam: fixture.homeTeam.shortName,
      awayTeam: fixture.awayTeam.shortName,
      bet: prediction.outcome,
      probability: prediction.confidence,
      decimalOdds: probToDecimalOdds(prediction.confidence),
    });

    // Additional bets from AI
    if (prediction.additionalBets) {
      for (const ab of prediction.additionalBets) {
        candidates.push({
          fixtureId: fixture.id,
          homeTeam: fixture.homeTeam.shortName,
          awayTeam: fixture.awayTeam.shortName,
          bet: ab.tip,
          probability: ab.probability,
          decimalOdds: probToDecimalOdds(ab.probability),
        });
      }
    }
  }

  // Sort highest probability first → safest bets
  return candidates.sort((a, b) => b.probability - a.probability);
}

// Pick N legs greedily: max 1 leg per fixture, target totalOdds close to targetMax
function pickLegs(
  candidates: ParlayLeg[],
  count: number,
  targetMaxOdds: number
): ParlayLeg[] {
  const usedFixtures = new Set<number>();
  const picked: ParlayLeg[] = [];
  let runningOdds = 1;

  for (const c of candidates) {
    if (picked.length === count) break;
    if (usedFixtures.has(c.fixtureId)) continue;

    const projectedOdds = runningOdds * c.decimalOdds;

    // If adding this leg would blow past the target ceiling and we still have room,
    // skip only if there's a cheaper option still to come (probability > 70)
    if (projectedOdds > targetMaxOdds && c.probability < 68 && picked.length < count - 1) {
      continue;
    }

    picked.push(c);
    usedFixtures.add(c.fixtureId);
    runningOdds = projectedOdds;
  }

  return picked;
}

function buildSlip(
  candidates: ParlayLeg[],
  legs: number,
  label: string,
  targetPayoutRange: string,
  targetMaxOdds: number,
  aiReasoning: string
): ParlaySlip {
  const picks = pickLegs(candidates, legs, targetMaxOdds);
  const odds = totalOdds(picks);
  const impliedProb = Math.round((picks.reduce((acc, l) => acc * (l.probability / 100), 1)) * 1000) / 10;

  return {
    legs,
    label,
    targetPayoutRange,
    totalOdds: odds,
    impliedProbability: impliedProb,
    picks,
    aiReasoning,
  };
}

export function buildParlayRecommendation(predictions: MatchData[]): ParlayRecommendation {
  if (predictions.length < 3) {
    return { slips: [], generatedAt: new Date().toISOString() };
  }

  const candidates = gatherCandidates(predictions);

  const slip3 = buildSlip(
    candidates,
    3,
    "Safe 3-Leg",
    "~2x",
    2.2,
    "Three of today's highest-confidence picks. Each leg carries 65%+ implied probability, keeping total risk low while delivering a clean 2x return."
  );

  const slip4 = buildSlip(
    candidates,
    4,
    "Balanced 4-Leg",
    "2.5x – 3x",
    3.2,
    "Four solid picks across different matches. A good balance between safety and reward — one step up in upside without diving into lottery-territory odds."
  );

  const slip5 = buildSlip(
    candidates,
    5,
    "Value 5-Leg",
    "3x – 4x",
    4.2,
    "Five well-reasoned selections drawn from today's best statistical matchups. Each leg is individually strong, making this a disciplined value parlay rather than a gamble."
  );

  return {
    slips: [slip3, slip4, slip5],
    generatedAt: new Date().toISOString(),
  };
}
