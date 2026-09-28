
import React from 'react';

export default function LeaderboardList({ entries, currentPlayer }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-card text-center py-12 sm:py-16 px-4">
        <span className="text-4xl block mb-4">🚀</span>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 font-medium">
          No attempts yet. Be the first to take this quiz!
        </p>
      </div>
    );
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const isCurrentPlayer = currentPlayer && entry.playerName.toLowerCase() === currentPlayer.toLowerCase();
        
        return (
          <div
            key={i}
            className={`group flex items-center gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl border transition-all duration-300 transform hover:translate-x-2 shadow-sm dark:shadow-none
              ${isCurrentPlayer ? 'bg-purple-500/20 dark:bg-purple-500/10 border-purple-500/50' : 'bg-white/80 dark:bg-white/5 border-purple-500/20 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-white/20'}`}
          >
            <div className="flex-shrink-0 w-8 sm:w-12 text-center text-xl sm:text-2xl">
              {i < 3 ? medals[i] : <span className="text-xs sm:text-sm font-bold text-slate-500">#{i + 1}</span>}
            </div>
            
            <div className="flex-grow min-w-0 flex items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="truncate">{entry.playerName}</span>
                  {isCurrentPlayer && (
                    <span className="flex-shrink-0 text-[9px] sm:text-[10px] px-2 py-0.5 bg-purple-600 text-white rounded-full uppercase tracking-tighter font-black">
                      You
                    </span>
                  )}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  Finished in <span className="text-slate-800 dark:text-gray-300 font-medium">{formatTime(entry.timeTaken)}</span>
                </p>
              </div>
              
              <div className="text-right flex-shrink-0">
                <span className={`block text-lg sm:text-xl font-black ${entry.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' : entry.percentage >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                  {entry.percentage}%
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {entry.score} / {entry.maxScore} PTS
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}
