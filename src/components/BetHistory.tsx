import React from 'react';
import { CheckCircle2, XCircle, Clock, History, TrendingUp } from 'lucide-react';

export interface PastBet {
  id: string;
  match: string;
  date: string;
  smartBet: string;
  odds: number;
  status: 'Hit' | 'Miss' | 'Pending';
  actualScore?: string;
}

const MOCK_HISTORY: PastBet[] = [
  { id: '1', match: 'Arsenal vs Chelsea', date: '2025-05-18', smartBet: 'Arsenal Win', odds: 1.85, status: 'Hit', actualScore: '2-0' },
  { id: '2', match: 'Real Madrid vs Barcelona', date: '2025-05-19', smartBet: 'Over 2.5 Goals', odds: 1.65, status: 'Miss', actualScore: '1-1' },
  { id: '3', match: 'Bayern vs Dortmund', date: '2025-05-19', smartBet: 'BTTS - Yes', odds: 1.55, status: 'Hit', actualScore: '3-1' },
  { id: '4', match: 'Man City vs Liverpool', date: '2025-05-20', smartBet: 'Man City Win', odds: 2.10, status: 'Pending' },
  { id: '5', match: 'Juventus vs Milan', date: '2025-05-17', smartBet: 'Under 2.5 Goals', odds: 1.90, status: 'Hit', actualScore: '1-0' },
];

export default function BetHistory() {
  const calculateWinPercentage = (bets: PastBet[]) => {
    const resolvedBets = bets.filter((b) => b.status !== 'Pending');
    if (resolvedBets.length === 0) return 0;
    const hits = resolvedBets.filter((b) => b.status === 'Hit').length;
    return Math.round((hits / resolvedBets.length) * 100);
  };

  const winPercentage = calculateWinPercentage(MOCK_HISTORY);

  const getStatusIcon = (status: PastBet['status']) => {
    switch (status) {
      case 'Hit':
        return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'Miss':
        return <XCircle className="text-red-500" size={20} />;
      case 'Pending':
        return <Clock className="text-amber-500" size={20} />;
    }
  };

  const getStatusColor = (status: PastBet['status']) => {
    switch (status) {
      case 'Hit':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Miss':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 mb-8 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <History className="text-emerald-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">Smart Bet History</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2">
          <TrendingUp className="text-emerald-400" size={16} />
          <span className="text-slate-400 text-sm font-medium">Win Rate</span>
          <span className="text-white font-bold text-lg ml-1">{winPercentage}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        {MOCK_HISTORY.map((bet) => (
          <div 
            key={bet.id}
            className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{bet.match}</span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  • {bet.date}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Pick:</span>
                <span className="text-slate-200 font-medium">{bet.smartBet}</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded text-xs ml-1">
                  {bet.odds.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {bet.actualScore && (
                <div className="text-center md:text-right hidden sm:block">
                  <span className="text-slate-500 text-xs block mb-0.5">Final Score</span>
                  <span className="text-white font-bold font-mono bg-slate-900 px-2 py-1 rounded">
                    {bet.actualScore}
                  </span>
                </div>
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${getStatusColor(bet.status)} min-w-[90px] justify-center`}>
                {getStatusIcon(bet.status)}
                <span className="text-sm font-bold tracking-wide">{bet.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
