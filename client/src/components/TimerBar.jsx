import React from 'react';

export default function TimerBar({ pct, display }) {
  const getTimerColor = () => {
    if (pct > 50) return 'text-emerald-400';
    if (pct > 25) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBarColor = () => {
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {display}
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${getBarColor()}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
