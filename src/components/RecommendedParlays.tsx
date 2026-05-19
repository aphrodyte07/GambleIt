import { Zap, Target, Flame } from "lucide-react";
import { Parlay } from "../types";

export default function RecommendedParlays({ parlays }: { parlays: Parlay[] }) {
  if (!parlays || parlays.length === 0) return null;

  const getIcon = (type: string) => {
    if (type.includes("3-Leg")) return <Target className="w-5 h-5 text-emerald-400" />;
    if (type.includes("4-Leg")) return <Zap className="w-5 h-5 text-amber-400" />;
    return <Flame className="w-5 h-5 text-rose-400" />;
  };

  const getGradient = (type: string) => {
    if (type.includes("3-Leg")) return "from-emerald-500/20 to-emerald-900/20 border-emerald-500/30";
    if (type.includes("4-Leg")) return "from-amber-500/20 to-amber-900/20 border-amber-500/30";
    return "from-rose-500/20 to-rose-900/20 border-rose-500/30";
  };

  return (
    <div className="mb-12 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Today's Recommended Parlays</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parlays.map((parlay, idx) => (
          <div key={idx} className={`bg-gradient-to-b ${getGradient(parlay.type)} border rounded-2xl p-5 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getIcon(parlay.type)}
                <h3 className="text-lg font-bold text-white">{parlay.type}</h3>
              </div>
              <span className="bg-slate-900/50 px-3 py-1 rounded-full text-white font-black text-sm">
                {parlay.totalPayout}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 mb-5">
              {parlay.legs.map((leg, i) => (
                <div key={i} className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-slate-300 text-xs font-medium mb-1">{leg.match}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-sm">{leg.tip}</span>
                    <span className="text-emerald-400 font-mono text-sm">@ {leg.odds}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white font-semibold text-sm">
              Build This Parlay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
