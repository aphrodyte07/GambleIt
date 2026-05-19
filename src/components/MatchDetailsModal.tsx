import { X, Lightbulb, Activity, BrainCircuit } from "lucide-react";
import { MatchData } from "../types";

interface MatchDetailsModalProps {
  match: MatchData;
  onClose: () => void;
}

export default function MatchDetailsModal({ match, onClose }: MatchDetailsModalProps) {
  const { fixture, prediction } = match;

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return "bg-emerald-500";
    if (prob >= 50) return "bg-amber-400";
    return "bg-rose-500";
  };
  
  const getProbabilityTextColor = (prob: number) => {
    if (prob >= 70) return "text-emerald-400";
    if (prob >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-500/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 border-b border-slate-800 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">AI Analysis</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{fixture.league.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Detailed Analysis Section */}
          <section>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              Match Breakdown
            </h3>
            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
              {prediction.detailedAnalysis?.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              )) || <p>No detailed analysis available for this match.</p>}
            </div>
          </section>

          {/* Additional Bets Section */}
          <section>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              More Bet Recommendations
            </h3>
            
            <div className="space-y-4">
              {prediction.additionalBets && prediction.additionalBets.length > 0 ? (
                [...prediction.additionalBets]
                  .sort((a, b) => b.probability - a.probability)
                  .map((bet, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{bet.tip}</span>
                      <span className={`font-bold ${getProbabilityTextColor(bet.probability)}`}>
                        {bet.probability}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProbabilityColor(bet.probability)} transition-all duration-1000 ease-out`}
                        style={{ width: `${bet.probability}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No additional betting recommendations available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
