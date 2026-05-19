import { Clock } from "lucide-react";
import { Fixture, Prediction } from "../types";
import PredictionBadge from "./PredictionBadge";
import BettingTipBadge from "./BettingTipBadge";
import StatsBar from "./StatsBar";

export default function MatchCard({ fixture, prediction }: { fixture: Fixture; prediction: Prediction }) {
  const kickoffTime = new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.innerHTML = '⚽';
    fallback.className = 'w-12 h-12 flex items-center justify-center text-2xl';
    e.currentTarget.parentNode?.appendChild(fallback);
  };

  const handleLeagueImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {fixture.league.emblem && (
            <img 
              src={fixture.league.emblem} 
              alt={fixture.league.name} 
              className="w-5 h-5 object-contain"
              onError={handleLeagueImageError}
            />
          )}
          <span className="text-slate-400 text-xs font-medium">
            {fixture.league.name} · {fixture.league.country}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-slate-500" />
          <span className="text-slate-400 text-xs">{kickoffTime}</span>
        </div>
      </div>

      {/* Teams Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 w-2/5">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <img 
              src={fixture.homeTeam.crest} 
              alt={fixture.homeTeam.name} 
              className="w-12 h-12 object-contain"
              onError={handleImageError}
            />
          </div>
          <span className="text-white text-sm font-semibold text-center leading-tight">
            {fixture.homeTeam.shortName}
          </span>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <PredictionBadge outcome={prediction.outcome} confidence={prediction.confidence} />
          <span className="text-3xl font-black text-white tracking-tight">
            {prediction.scoreline}
          </span>
          <span className="text-slate-600 text-xs text-center truncate max-w-full px-1">
            {fixture.venue}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 w-2/5">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <img 
              src={fixture.awayTeam.crest} 
              alt={fixture.awayTeam.name} 
              className="w-12 h-12 object-contain"
              onError={handleImageError}
            />
          </div>
          <span className="text-white text-sm font-semibold text-center leading-tight">
            {fixture.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800 my-3" />

      {/* Stats bar */}
      <StatsBar 
        homeWinPct={prediction.homeWinPct}
        drawPct={prediction.drawPct}
        awayWinPct={prediction.awayWinPct}
        homeName={fixture.homeTeam.shortName}
        awayName={fixture.awayTeam.shortName}
      />

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-3 gap-2">
        <BettingTipBadge tip={prediction.bettingTip} />
        <span className="text-slate-500 text-xs italic text-right leading-relaxed line-clamp-2 flex-1">
          {prediction.insight}
        </span>
      </div>
    </div>
  );
}
