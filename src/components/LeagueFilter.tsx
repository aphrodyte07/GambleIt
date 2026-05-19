export default function LeagueFilter({ 
  leagues, 
  selected, 
  onChange 
}: { 
  leagues: string[], 
  selected: string, 
  onChange: (league: string) => void 
}) {
  return (
    <div className="flex flex-row gap-2 pb-2 overflow-x-auto scrollbar-hide mb-6">
      <button
        onClick={() => onChange("All Leagues")}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
          selected === "All Leagues"
            ? "bg-emerald-500 text-white"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
        }`}
      >
        All Leagues
      </button>
      
      {leagues.map((league) => (
        <button
          key={league}
          onClick={() => onChange(league)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selected === league
              ? "bg-emerald-500 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {league}
        </button>
      ))}
    </div>
  );
}
