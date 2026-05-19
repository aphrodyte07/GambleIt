import { Clock } from "lucide-react";
import { Fixture, Prediction } from "../types";
import PredictionBadge from "./PredictionBadge";
import BettingTipBadge from "./BettingTipBadge";
import StatsBar from "./StatsBar";

export default function MatchCard({ fixture, prediction, onClick }: { fixture: Fixture; prediction: Prediction; onClick?: () => void }) {
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
    <div 
      className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center"
      onClick={onClick}
    >
      
      {/* Left Column: Match Details & Teams */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          {fixture.league.emblem && (
            <img 
              src={fixture.league.emblem} 
              alt={fixture.league.name} 
              className="w-4 h-4 object-contain"
              onError={handleLeagueImageError}
            />
          )}
          <span className="text-slate-400 text-xs font-medium">
            {fixture.league.name} · {fixture.league.country}
          </span>
          <span className="text-slate-600 text-xs mx-1">•</span>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-slate-500" />
            <span className="text-slate-400 text-xs">{kickoffTime}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Home Team */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <img 
                src={fixture.homeTeam.crest} 
                alt={fixture.homeTeam.name} 
                className="w-8 h-8 object-contain"
                onError={handleImageError}
              />
            </div>
            <span className="text-white font-semibold flex-1">
              {fixture.homeTeam.shortName}
            </span>
          </div>
          
          {/* Away Team */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <img 
                src={fixture.awayTeam.crest} 
                alt={fixture.awayTeam.name} 
                className="w-8 h-8 object-contain"
                onError={handleImageError}
              />
            </div>
            <span className="text-white font-semibold flex-1">
              {fixture.awayTeam.shortName}
            </span>
          </div>
        </div>
      </div>

      {/* Center Column: Score & Predictions */}
      <div className="flex flex-col items-center justify-center min-w-[120px] py-4 md:py-0 md:border-x border-slate-800 md:px-6">
        <PredictionBadge outcome={prediction.outcome} confidence={prediction.confidence} />
        <span className="text-3xl font-black text-white tracking-tight my-1">
          {prediction.scoreline}
        </span>
        <span className="text-slate-500 text-[10px] text-center max-w-full truncate">
          {fixture.venue}
        </span>
      </div>

      {/* Right Column: Tips & Stats */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <StatsBar 
          homeWinPct={prediction.homeWinPct}
          drawPct={prediction.drawPct}
          awayWinPct={prediction.awayWinPct}
          homeName={fixture.homeTeam.shortName}
          awayName={fixture.awayTeam.shortName}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-1">
          <BettingTipBadge tip={prediction.bettingTip} />
          <span className="text-slate-500 text-xs italic leading-tight line-clamp-2 sm:text-right">
            {prediction.insight}
          </span>
        </div>
      </div>
    </div>
  );
}
