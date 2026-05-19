import { Trophy } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800/60 h-16 w-full">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-1.5 rounded-lg">
            <Trophy className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">Predi</span>
            <span className="text-emerald-400 font-bold text-xl">goal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-slate-400 text-sm">Live AI Predictions</span>
        </div>
      </div>
    </nav>
  );
}
