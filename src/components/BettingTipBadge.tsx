import { Zap } from "lucide-react";

export default function BettingTipBadge({ tip }: { tip: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full px-3 py-1 text-xs font-semibold">
      <Zap size={10} />
      {tip}
    </span>
  );
}
