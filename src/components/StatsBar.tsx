export default function StatsBar({
  homeWinPct,
  drawPct,
  awayWinPct,
  homeName,
  awayName,
}: {
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  homeName: string;
  awayName: string;
}) {
  return (
    <div className="w-full mt-2">
      <div className="flex h-2 rounded-full overflow-hidden w-full">
        <div style={{ width: `${homeWinPct}%` }} className="bg-emerald-500 h-full" />
        <div style={{ width: `${drawPct}%` }} className="bg-amber-500 h-full" />
        <div style={{ width: `${awayWinPct}%` }} className="bg-blue-500 h-full" />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-emerald-500 text-xs truncate max-w-[30%] text-left">
          {homeName} {homeWinPct}%
        </span>
        <span className="text-amber-500 text-xs text-center max-w-[30%]">
          Draw {drawPct}%
        </span>
        <span className="text-blue-500 text-xs truncate max-w-[30%] text-right">
          {awayName} {awayWinPct}%
        </span>
      </div>
    </div>
  );
}
