"use client";

import { useEffect, useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import { MatchData } from "../types";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import LeagueFilter from "../components/LeagueFilter";
import MatchCard from "../components/MatchCard";

export default function Home() {
  const [predictions, setPredictions] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("/api/predictions");
        if (!res.ok) {
          throw new Error("Failed to fetch predictions");
        }
        const data = await res.json();
        setPredictions(data.predictions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const leagues = Array.from(new Set(predictions.map((p) => p.fixture.league.name)));
  
  const filteredPredictions = selectedLeague === "All Leagues" 
    ? predictions 
    : predictions.filter((p) => p.fixture.league.name === selectedLeague);

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-medium mb-4">
            <Sparkles size={14} />
            <span>Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="text-white">Today's</span>
            <span className="text-white"> Football </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Predictions
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-4">
            AI-analyzed fixtures from Europe's top 5 leagues
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-emerald-400 font-semibold">
              {predictions.length} Matches Analyzed
            </span>
            <span className="text-slate-400">{todayStr}</span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-red-400 text-lg font-medium">{error}</p>
          </div>
        ) : (
          <>
            <LeagueFilter 
              leagues={leagues} 
              selected={selectedLeague} 
              onChange={setSelectedLeague} 
            />

            {filteredPredictions.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                No matches found for this league today.
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {filteredPredictions.map((match) => (
                  <MatchCard 
                    key={match.fixture.id} 
                    fixture={match.fixture} 
                    prediction={match.prediction} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-16 pb-8 text-center">
        <p className="text-slate-600 text-xs">
          GambleIt © 2025 · AI predictions for entertainment purposes only · Not financial advice · Data from football-data.org & Google Gemini
        </p>
      </footer>
    </div>
  );
}
