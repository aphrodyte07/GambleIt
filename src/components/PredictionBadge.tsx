export default function PredictionBadge({ outcome, confidence }: { outcome: string, confidence: number }) {
  let colorClasses = "bg-slate-500/15 text-slate-400 border-slate-500/30";
  
  if (outcome === "Home Win") {
    colorClasses = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  } else if (outcome === "Away Win") {
    colorClasses = "bg-blue-500/15 text-blue-400 border-blue-500/30";
  } else if (outcome === "Draw") {
    colorClasses = "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${colorClasses}`}>
      {outcome} · {confidence}%
    </span>
  );
}
