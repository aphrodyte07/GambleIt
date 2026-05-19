import { Zap, Sparkles } from "lucide-react";

export default function BettingTipBadge({ tip }: { tip: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
        <Sparkles size={10} /> Smart Bet Choice
      </span>
      <span className="inline-flex items-center gap-1 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full px-3 py-1 text-xs font-semibold">
        <Zap size={10} />
        {tip}
      </span>
    </div>
  );
}
