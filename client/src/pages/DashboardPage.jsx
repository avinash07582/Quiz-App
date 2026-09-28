
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/user/dashboard');
      setData(res.data);
    } catch (error) {
      toast.error('Data retrieval failure');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full"
      />
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const topicAnalytics = data?.topicAnalytics || [];
  const badges = data?.stats?.badges || ['Newcomer'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-10 space-y-7 sm:space-y-12 overflow-x-hidden animate-fadeIn">
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-8 glass-card p-4 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-l from-purple-500/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-2 sm:space-y-2 relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1">
              <span>🔥</span> {data?.stats?.currentStreak || 1} Day Streak
            </span>

            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-600/20 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              Peak: {data?.stats?.highestStreak || 1} Days
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight break-words">
            Executive Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-purple-950/70 dark:text-purple-200/70 font-medium leading-relaxed break-words">
            Welcome back, <span className="text-purple-700 dark:text-purple-300 font-black">{user?.displayName}</span>. Here is your AI learning telemetry.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto relative z-10">
          <Link
            to="/explore"
            className="glass-button-secondary text-xs sm:text-sm font-bold shadow-md text-center w-full sm:w-auto"
          >
            Explore Topics
          </Link>

          <Link
            to="/"
            className="btn-premium text-center text-xs sm:text-base !py-3 sm:!py-4 shadow-md font-black w-full sm:w-auto"
          >
            Initialize New Quiz
          </Link>
        </div>
      </motion.header>

      {/* Analytics Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        {[
          { label: 'Intelligence Quotas', val: data?.stats?.totalQuizzesTaken || 0, icon: '📊' },
          { label: 'Cumulative Score', val: data?.stats?.totalScore || 0, icon: '🎯' },
          { label: 'Active Streak', val: `${data?.stats?.currentStreak || 1} Days`, icon: '🔥' },
          { label: 'Security Clearances', val: badges.length, icon: '🏆' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className="glass-card p-4 sm:p-8 group hover:bg-purple-50/80 dark:hover:bg-purple-500/10 transition-all duration-300 shadow-md min-w-0"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-[8px] sm:text-xs font-black text-purple-950/60 dark:text-purple-300/60 uppercase tracking-widest leading-relaxed break-words">
                {stat.label}
              </span>

              <span className="text-lg sm:text-2xl opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {stat.icon}
              </span>
            </div>

            <span className="block text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 sm:mt-4 tracking-tight break-words">
              {stat.val}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Badges Display */}
      <section className="glass-card p-4 sm:p-8 space-y-4 shadow-lg">
        <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>🛡️</span> Achievement Badges
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-700/20 to-fuchsia-600/20 border border-purple-500/40 font-black text-[11px] sm:text-sm text-purple-900 dark:text-purple-200 shadow-sm flex items-center gap-1.5 sm:gap-2 max-w-full"
            >
              <span className="text-sm sm:text-lg flex-shrink-0">⭐</span>
              <span className="break-words">{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Topic Mastery Breakdown */}
      {topicAnalytics.length > 0 && (
        <section className="glass-card p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-lg">
          <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧠</span> Topic Mastery & Accuracy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {topicAnalytics.map((topic, idx) => (
              <div
                key={idx}
                className="space-y-2 p-3.5 sm:p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-600/20 dark:border-white/5 min-w-0"
              >
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 dark:text-white truncate max-w-full xs:max-w-[60%]">
                    {topic.topic}
                  </span>

                  <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider self-start xs:self-auto whitespace-nowrap
                    ${topic.level === 'Master' ? 'bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-300' : topic.level === 'Advanced' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-blue-500/20 text-blue-800 dark:text-blue-300'}`}>
                    {topic.level} ({topic.accuracy}%)
                  </span>
                </div>

                <div className="w-full bg-purple-100 dark:bg-black/40 rounded-full h-2 overflow-hidden border border-purple-600/20 dark:border-white/10">
                  <div 
                    className="bg-gradient-to-r from-purple-700 to-fuchsia-600 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>

                <div className="text-[9px] sm:text-[10px] text-right text-purple-950/50 dark:text-purple-300/50 font-bold break-words">
                  {topic.correct} / {topic.attempted} Correct Answers
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-10">
        {/* Recent Telemetry */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 sm:space-y-6 min-w-0"
        >
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <span className="p-2 bg-purple-600/10 dark:bg-purple-500/15 rounded-lg text-base sm:text-lg flex-shrink-0">🕒</span>
            <span className="break-words">Recent Assessment History</span>
          </h2>

          <div className="glass-card overflow-hidden border-purple-600/20 dark:border-purple-500/30 shadow-lg">
            {data?.recentAttempts?.length > 0 ? (
              <div className="divide-y divide-purple-600/10 dark:divide-purple-500/20">
                {data.recentAttempts.map((attempt) => (
                  <div
                    key={attempt._id}
                    className="p-3.5 sm:p-6 flex items-center justify-between gap-3 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-colors group min-w-0"
                  >
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 max-w-[58%]">
                      <h3 className="font-bold text-xs sm:text-base text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors truncate">
                        {attempt.quizId?.title || 'Unknown Assessment'}
                      </h3>

                      <p className="text-[8px] sm:text-xs font-black text-purple-950/60 dark:text-purple-300/60 uppercase tracking-widest truncate">
                        {attempt.quizId?.detectedTopic || attempt.quizId?.category} • {attempt.quizId?.difficulty}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 flex items-center gap-1.5 sm:gap-3">
                      <div className="text-right min-w-0">
                        <span className="block text-xs sm:text-lg font-black text-purple-700 dark:text-purple-400 whitespace-nowrap">
                          {attempt.score} / {attempt.maxScore}
                        </span>

                        <span className="block text-[8px] sm:text-[10px] font-bold text-purple-950/60 dark:text-purple-300/60 uppercase tracking-widest whitespace-nowrap">
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/results/${attempt.shareId}`}
                        className="p-1.5 sm:p-2 rounded-xl bg-purple-600/10 text-purple-800 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition flex-shrink-0"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 sm:p-20 text-center text-purple-950/60 dark:text-purple-300/60 font-medium italic text-xs sm:text-base">
                No telemetry data available.
              </div>
            )}
          </div>
        </motion.div>

        {/* Neural Assets */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 sm:space-y-6 min-w-0"
        >
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <span className="p-2 bg-purple-600/10 dark:bg-purple-500/15 rounded-lg text-base sm:text-lg flex-shrink-0">📁</span>
            <span className="break-words">Neural Assets Created</span>
          </h2>

          <div className="glass-card overflow-hidden border-purple-600/20 dark:border-purple-500/30 shadow-lg">
            {data?.createdQuizzes?.length > 0 ? (
              <div className="divide-y divide-purple-600/10 dark:divide-purple-500/20">
                {data.createdQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="p-3.5 sm:p-6 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-colors group min-w-0"
                  >
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 max-w-full xs:max-w-[60%]">
                      <h3 className="font-bold text-xs sm:text-base text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors truncate">
                        {quiz.title}
                      </h3>

                      <p className="text-[8px] sm:text-xs font-black text-purple-950/60 dark:text-purple-300/60 uppercase tracking-widest truncate">
                        {quiz.questionCount} Questions • {quiz.detectedTopic || quiz.category}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap flex-shrink-0">
                      <Link
                        to={`/notes/${quiz.shareId}`}
                        className="text-[9px] sm:text-[10px] font-black text-purple-800 dark:text-purple-300 bg-purple-600/15 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-purple-600 hover:text-white transition uppercase tracking-widest"
                      >
                        Notes
                      </Link>

                      <Link
                        to={`/quiz/${quiz.shareId}`}
                        className="text-[9px] sm:text-[10px] font-black text-white bg-gradient-to-r from-purple-700 to-fuchsia-600 px-2.5 sm:px-3 py-1.5 rounded-lg hover:scale-105 transition uppercase tracking-widest shadow-sm"
                      >
                        Access Link
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 sm:p-20 text-center text-purple-950/60 dark:text-purple-300/60 font-medium italic text-xs sm:text-base">
                No assets established.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
