
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeaderboard } from '../utils/api';
import { useSocket } from '../hooks/useSocket';
import { useQuiz } from '../context/QuizContext';
import LeaderboardList from '../components/LeaderboardList';
import toast from 'react-hot-toast';

export default function LeaderboardPage() {
  const { shareId } = useParams();
  const { playerName, quiz } = useQuiz();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const { joinQuiz, leaveQuiz, onLeaderboardUpdate } = useSocket();

  useEffect(() => {
    getLeaderboard(shareId)
      .then((res) => setEntries(res.data))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));

    joinQuiz(shareId);
    setLive(true);

    const unsub = onLeaderboardUpdate((data) => {
      setEntries(data);
      toast('🏆 Leaderboard updated!', { 
        duration: 2000,
        style: { background: '#10b981', color: '#fff' }
      });
    });

    return () => {
      leaveQuiz(shareId);
      unsub && unsub();
    };
  }, [shareId]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-10 pb-16 sm:pb-20 px-3 sm:px-4 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      <header className="text-center space-y-3 sm:space-y-4 pt-3 sm:pt-4">
        <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 sm:gap-3 tracking-tight leading-tight">
          <span className="text-amber-500 text-xl min-[400px]:text-2xl sm:text-3xl flex-shrink-0">
            🏆
          </span>
          <span>Quiz Leaderboard</span>
        </h1>

        {quiz && (
          <div className="space-y-1 px-2 min-w-0">
            <p className="text-sm sm:text-base text-purple-950/80 dark:text-gray-300 font-bold break-words">
              {quiz.title}
            </p>

            <p className="text-[9px] sm:text-xs text-purple-950/60 dark:text-slate-500 uppercase tracking-[0.12em] sm:tracking-[0.2em] font-black break-words">
              {quiz.category} • {quiz.difficulty}
            </p>
          </div>
        )}
        
        <div className="flex justify-center pt-1">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest
            ${live ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 shadow-xs' : 'bg-gray-500/10 border-gray-500/20 text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${live ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            {live ? 'Live Updates' : 'Offline'}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card p-3 sm:p-6 md:p-8 shadow-lg overflow-hidden">
          <LeaderboardList entries={entries} currentPlayer={playerName} />
        </div>
      )}

      <footer className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-5 sm:pt-6 border-t border-purple-600/10 dark:border-white/5 w-full">
        <Link 
          to={`/quiz/${shareId}`} 
          className="w-full sm:w-auto btn-premium text-center font-black !py-3 sm:!py-3.5 !px-5 sm:!px-6 text-sm sm:text-base shadow-md"
        >
          Try Quiz Again
        </Link>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + `/quiz/${shareId}`);
            toast.success('Link copied!');
          }}
          className="w-full sm:w-auto glass-button-secondary cursor-pointer text-sm sm:text-base text-center shadow-sm"
        >
          🔗 Share Quiz
        </button>

        <Link
          to="/"
          className="w-full sm:w-auto glass-button-secondary text-center text-sm sm:text-base shadow-sm"
        >
          Home
        </Link>
      </footer>
    </div>
  );
}
