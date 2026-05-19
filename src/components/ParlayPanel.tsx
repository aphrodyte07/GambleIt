"use client";

import { useEffect, useRef } from "react";
import { Zap, ShieldCheck, TrendingUp, Target, ChevronRight, Layers } from "lucide-react";
import { ParlayRecommendation, ParlaySlip } from "../types";

const SLIP_CONFIG = [
  {
    icon: ShieldCheck,
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-500",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/20",
  },
  {
    icon: TrendingUp,
    accentFrom: "from-amber-400",
    accentTo: "to-orange-500",
    accentText: "text-amber-400",
    accentBg: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    glowColor: "shadow-amber-400/20",
  },
  {
    icon: Zap,
    accentFrom: "from-violet-500",
    accentTo: "to-purple-600",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    glowColor: "shadow-violet-500/20",
  },
];

function ProbabilityBar({ prob, accentFrom, accentTo }: { prob: number; accentFrom: string; accentTo: string }) {
  return (
    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${accentFrom} ${accentTo} transition-all duration-1000 ease-out`}
        style={{ width: `${prob}%` }}
      />
    </div>
  );
}

function SlipCard({ slip, config }: { slip: ParlaySlip; config: typeof SLIP_CONFIG[0] }) {
  const Icon = config.icon;
  return (
    <div className={`bg-slate-900 border ${config.accentBorder} rounded-2xl p-5 flex flex-col gap-4 shadow-lg ${config.glowColor} hover:scale-[1.02] transition-transform duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.accentBg}`}>
            <Icon className={`w-4 h-4 ${config.accentText}`} />
          </div>
          <span className="text-white font-bold text-sm">{slip.label}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.accentBg} ${config.accentText}`}>
          {slip.targetPayoutRange} payout
        </span>
      </div>

      {/* Odds summary */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Odds</p>
          <p className={`text-3xl font-black bg-gradient-to-r ${config.accentFrom} ${config.accentTo} bg-clip-text text-transparent`}>
            {slip.totalOdds.toFixed(2)}x
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Slip Probability</p>
          <p className="text-white font-bold text-lg">{slip.impliedProbability}%</p>
        </div>
      </div>

      {/* Legs */}
      <div className="space-y-3">
        {slip.picks.map((leg, i) => (
          <div key={i} className="bg-slate-800/60 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`text-[10px] font-bold ${config.accentText} bg-slate-950 rounded px-1.5 py-0.5`}>LEG {i + 1}</span>
              <span className="text-slate-400 text-xs truncate">{leg.homeTeam} vs {leg.awayTeam}</span>
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-semibold">{leg.bet}</span>
              <span className={`text-xs font-bold ${config.accentText}`}>{leg.probability}%</span>
            </div>
            <ProbabilityBar prob={leg.probability} accentFrom={config.accentFrom} accentTo={config.accentTo} />
          </div>
        ))}
      </div>

      {/* AI reasoning */}
      <div className={`${config.accentBg} border ${config.accentBorder} rounded-xl p-3`}>
        <p className={`text-xs ${config.accentText} font-semibold mb-1 flex items-center gap-1`}>
          <Target className="w-3 h-3" /> AI Reasoning
        </p>
        <p className="text-slate-300 text-xs leading-relaxed">{slip.aiReasoning}</p>
      </div>
    </div>
  );
}

export default function ParlayPanel({ parlay }: { parlay: ParlayRecommendation }) {
  const ref = useRef<HTMLDivElement>(null);

  // Animate bars after mount
  useEffect(() => {
    if (ref.current) {
      const bars = ref.current.querySelectorAll<HTMLDivElement>("[data-width]");
      bars.forEach((bar) => {
        bar.style.width = bar.dataset.width || "0%";
      });
    }
  }, [parlay]);

  if (!parlay.slips || parlay.slips.length === 0) return null;

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 mt-14 mb-4">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/20 rounded-xl">
          <Layers className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-white font-black text-xl">
            AI-Recommended <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">Parlays</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Smart multi-bet slips built for consistent, safe returns — not lottery odds.</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-2.5 mb-6 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300/80 text-xs leading-relaxed">
          Legs are selected by probability, not by gut feel. Each parlay is capped to a realistic payout range to keep returns sustainable. Never bet more than you can afford to lose. <strong>Please note that the odds shown might not be exactly accurate.</strong>
        </p>
      </div>

      {/* Slip grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {parlay.slips.map((slip, i) => (
          <SlipCard key={i} slip={slip} config={SLIP_CONFIG[i]} />
        ))}
      </div>
    </section>
  );
}
