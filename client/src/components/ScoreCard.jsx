import { useEffect, useRef } from 'react';

export default function ScoreCard({ score, maxScore, percentage, playerName }) {
  const circleRef = useRef(null);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (percentage / 100) * circumference;
      circleRef.current.style.strokeDashoffset = offset;
    }
  }, [percentage, circumference]);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-emerald-700 dark:text-emerald-400', stroke: '#34d399' };
    if (percentage >= 70) return { label: 'Great Job!', color: 'text-blue-700 dark:text-blue-400', stroke: '#60a5fa' };
    if (percentage >= 50) return { label: 'Good Effort', color: 'text-amber-700 dark:text-amber-400', stroke: '#fbbf24' };
    return { label: 'Keep Practicing', color: 'text-red-700 dark:text-red-400', stroke: '#f87171' };
  };

  const grade = getGrade();

  return (
    <div className="text-center space-y-6 px-2">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Well done, <span className="text-purple-700 dark:text-purple-400">{playerName}</span>!</h2>
      
      <div className="relative inline-flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-36 h-36 sm:w-48 sm:h-48 transform -rotate-90 mx-auto">
          {/* Background circle */}
          <circle 
            cx="60" cy="60" r={radius} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="10" 
            className="text-purple-600/15 dark:text-white/5"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={grade.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">{percentage}%</span>
          <span className={`text-xs sm:text-sm font-black uppercase tracking-widest mt-0.5 sm:mt-1 ${grade.color}`}>{grade.label}</span>
        </div>
      </div>

      <div>
        <div className="bg-purple-50 dark:bg-white/5 border border-purple-600/20 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 inline-block shadow-sm dark:shadow-none max-w-xs sm:max-w-md w-full">
          <p className="text-xs sm:text-sm text-purple-950/70 dark:text-gray-400 font-bold">You scored <span className="text-slate-900 dark:text-white font-black">{score}</span> out of <span className="text-slate-900 dark:text-white font-black">{maxScore}</span> points</p>
        </div>
      </div>
    </div>
  );
}
