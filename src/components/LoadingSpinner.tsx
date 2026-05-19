export default function LoadingSpinner() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-700" />
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse mt-4">
        Gemini AI is analyzing today's matches...
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full mt-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800/50 rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
