
import { useState } from 'react';

export default function NameModal({ onStart }) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-purple-950/40 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-500">
      <div className="w-full max-w-md glass-card p-6 sm:p-10 text-center animate-fadeIn">
        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎮</div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
          Ready to Play?
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 font-medium mb-6 sm:mb-8">
          Enter your name to appear on the leaderboard
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            className="glass-input !text-base sm:!text-lg !font-bold"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim())}
            autoFocus
            maxLength={30}
          />
          
          <button
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            className="btn-premium w-full !py-3 sm:!py-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}
