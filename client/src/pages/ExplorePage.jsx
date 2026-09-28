
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExploreTopics, getExploreQuizzes } from '../utils/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ExplorePage() {
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [selectedTopic, selectedDiff, search]);

  const fetchTopics = async () => {
    try {
      const res = await getExploreTopics();
      setTopics([{ name: 'All', count: res.data.reduce((acc, curr) => acc + curr.count, 0) }, ...res.data]);
    } catch (err) {
      toast.error('Failed to load explore topics');
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getExploreQuizzes({ topic: selectedTopic, difficulty: selectedDiff, search });
      setQuizzes(res.data);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-7 sm:space-y-10 overflow-x-hidden animate-fadeIn">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      <header className="text-center space-y-2.5 sm:space-y-3 px-1">
        <h1 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight break-words">
          Explore Knowledge Hub
        </h1>

        <p className="text-xs sm:text-base text-purple-950/70 dark:text-purple-200/70 max-w-2xl mx-auto leading-relaxed">
          Discover AI-curated assessments across Operating Systems, DBMS, Networks, Data Structures & Algorithms, React, and more.
        </p>
      </header>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search assessments by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input !py-3 sm:!py-3.5 flex-1 text-xs sm:text-base min-w-0"
          />

          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="glass-input !py-3 sm:!py-3.5 w-full sm:w-48 text-xs sm:text-base cursor-pointer font-bold"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Topic Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {topics.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTopic(t.name)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm flex-shrink-0
                ${selectedTopic === t.name 
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-900/30' 
                  : 'bg-purple-50 dark:bg-purple-500/10 text-purple-950 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-500/20'}`}
            >
              <span>{t.name}</span>

              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] ${selectedTopic === t.name ? 'bg-white/20 text-white font-black' : 'bg-purple-200 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="flex justify-center py-14 sm:py-20">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.shareId}
              whileHover={{ y: -4 }}
              className="glass-card p-4 sm:p-6 flex flex-col justify-between group shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-w-0"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600/20 to-transparent w-20 sm:w-24 h-20 sm:h-24 rounded-bl-full pointer-events-none" />

              <div className="space-y-3 sm:space-y-4 min-w-0">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-600/10 dark:bg-purple-500/20 border border-purple-600/20 text-purple-800 dark:text-purple-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest max-w-[70%] truncate">
                    {quiz.detectedTopic || 'General CS'}
                  </span>

                  <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap
                    ${quiz.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : quiz.difficulty === 'hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors break-words">
                  {quiz.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] sm:text-xs font-semibold text-purple-950/60 dark:text-purple-300/60">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    📝 {quiz.questionCount} Qs
                  </span>

                  <span className="flex items-center gap-1 whitespace-nowrap">
                    ⏰ {Math.round(quiz.timeLimit / 60)} mins
                  </span>

                  <span className="flex items-center gap-1 whitespace-nowrap">
                    📅 {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-purple-600/10 dark:border-white/5 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-[10px] font-black text-white shadow-xs flex-shrink-0">
                    {quiz.creator?.displayName?.charAt(0).toUpperCase() || 'A'}
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-gray-300 truncate max-w-[140px] sm:max-w-[100px]">
                    {quiz.creator?.displayName || 'AI System'}
                  </span>
                </div>

                <Link
                  to={`/quiz/${quiz.shareId}`}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] sm:text-xs font-black tracking-wide shadow-md shadow-purple-900/20 transition-all cursor-pointer text-center whitespace-nowrap w-full xs:w-auto"
                >
                  Start Quiz →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 sm:py-20 glass-card p-5 sm:p-8">
          <p className="text-purple-950/70 dark:text-purple-300/70 font-semibold text-sm sm:text-lg leading-relaxed">
            No assessments match your filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
