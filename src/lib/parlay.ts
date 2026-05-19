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

function fallbackPick(candidates: ParlayLeg[], count: number) {
  const picked: ParlayLeg[] = [];
  const used = new Set<number>();
  for (const c of candidates) {
    if (picked.length === count) break;
    if (!used.has(c.fixtureId)) {
      picked.push(c);
      used.add(c.fixtureId);
    }
  }
  return picked;
}

// Pick N legs with 1 per fixture that gets total odds closest to targetOdds
function pickLegs(
  candidates: ParlayLeg[],
  count: number,
  targetOdds: number
): ParlayLeg[] {
  // Group by fixture
  const byFixture: { [key: number]: ParlayLeg[] } = {};
  for (const c of candidates) {
    if (!byFixture[c.fixtureId]) byFixture[c.fixtureId] = [];
    byFixture[c.fixtureId].push(c);
  }
  const fixtures = Object.values(byFixture);
  if (fixtures.length < count) return fallbackPick(candidates, count);

  // Limit search space for performance: Top 15 fixtures (safest first), up to 3 bets each
  // Sort fixtures by their safest bet's probability
  fixtures.sort((a, b) => b[0].probability - a[0].probability);
  const limitedFixtures = fixtures.slice(0, 15).map(f => f.slice(0, 3));

  let bestPicks: ParlayLeg[] = [];
  let bestDiff = Infinity;

  function backtrack(idx: number, currentPicks: ParlayLeg[], currentOdds: number) {
    if (currentPicks.length === count) {
      const diff = Math.abs(currentOdds - targetOdds);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestPicks = [...currentPicks];
      }
      return;
    }

    if (limitedFixtures.length - idx < count - currentPicks.length) {
      return;
    }

    // Branch 1: Skip this fixture
    backtrack(idx + 1, currentPicks, currentOdds);

    // Branch 2: Pick one leg from this fixture
    for (const leg of limitedFixtures[idx]) {
      // Optimization: If odds are already wildly exceeding target, prune branch
      // We allow up to 1.5x overshoot just in case, but prune anything way above
      if (currentOdds * leg.decimalOdds > targetOdds * 2.0 && currentPicks.length < count - 1) {
        continue;
      }
      
      currentPicks.push(leg);
      backtrack(idx + 1, currentPicks, currentOdds * leg.decimalOdds);
      currentPicks.pop();
    }
  }

  backtrack(0, [], 1);

  if (bestPicks.length === 0) return fallbackPick(candidates, count);
  return bestPicks.sort((a, b) => b.probability - a.probability);
}

function buildSlip(
  candidates: ParlayLeg[],
  legs: number,
  label: string,
  targetPayoutRange: string,
  targetOdds: number,
  aiReasoning: string
): ParlaySlip {
  const picks = pickLegs(candidates, legs, targetOdds);
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
    2.0,
    "Three of today's highest-confidence picks. Each leg carries 65%+ implied probability, keeping total risk low while delivering a clean 2x return."
  );

  const slip4 = buildSlip(
    candidates,
    4,
    "Balanced 4-Leg",
    "2.5x – 3x",
    2.75,
    "Four solid picks across different matches. A good balance between safety and reward — one step up in upside without diving into lottery-territory odds."
  );

  const slip5 = buildSlip(
    candidates,
    5,
    "Value 5-Leg",
    "3x – 4x",
    3.5,
    "Five well-reasoned selections drawn from today's best statistical matchups. Each leg is individually strong, making this a disciplined value parlay rather than a gamble."
  );

  return {
    slips: [slip3, slip4, slip5],
    generatedAt: new Date().toISOString(),
  };
}
