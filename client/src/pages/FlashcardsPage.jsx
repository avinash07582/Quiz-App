import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudyNotes, updateFlashcardMastery } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getStudyNotes(shareId)
      .then((res) => {
        setNotes(res.data);
      })
      .catch(() => toast.error('Flashcards not found.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-purple-950/70 dark:text-purple-300/70 font-semibold animate-pulse">Loading Flashcard Deck...</p>
    </div>
  );

  if (!notes || !notes.flashcards?.length) return (
    <div className="text-center py-20 space-y-4 px-4">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">No Flashcards Available</h2>
      <button onClick={() => navigate('/')} className="btn-premium !py-3 !px-6 text-sm sm:text-base">Return Home</button>
    </div>
  );

  const cards = notes.flashcards;
  const activeCard = cards[current];
  const progressPct = Math.round(((current + 1) / cards.length) * 100);

  const handleRating = async (mastery) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateFlashcardMastery(shareId, activeCard._id, mastery);
      setIsFlipped(false);
      if (current < cards.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        toast.success('🎉 Deck completed! Great practice.');
      }
    } catch (err) {
      toast.error('Failed to update flashcard progress.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 px-4 sm:px-6 py-8 pb-20 overflow-x-hidden animate-fadeIn">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      {/* Header Info & Progress Bar */}
      <header className="glass-card p-4 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-xs font-black uppercase tracking-widest">
              {notes.topic || 'General CS'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Flashcard Mastery</h1>
          </div>
          <span className="text-xs sm:text-sm font-black text-purple-700 dark:text-purple-300">
            Card <span className="text-slate-900 dark:text-white">{current + 1}</span> of {cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100 dark:bg-purple-950/40 rounded-full h-2 sm:h-2.5 p-0.5 border border-purple-600/20 dark:border-white/10 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Interactive 3D Flip Card Container */}
      <div className="relative h-80 sm:h-96 w-full cursor-pointer perspective-[1000px]" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          className="w-full h-full preserve-3d"
        >
          {/* Front Card */}
          <div className="absolute inset-0 backface-hidden glass-card p-8 sm:p-12 flex flex-col justify-center items-center text-center shadow-2xl border-purple-600/30 dark:border-white/10 bg-white dark:bg-[#120824]/90 group">
            <span className="absolute top-6 left-6 text-[10px] sm:text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full bg-purple-600/10 text-purple-800 dark:text-purple-300">
              Question / Prompt
            </span>
            <span className="absolute top-6 right-6 text-xs text-purple-950/40 dark:text-gray-500 font-bold group-hover:scale-105 transition-transform">
              🔄 Click to Flip
            </span>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-relaxed max-w-xl">
              {activeCard.front}
            </p>
          </div>

          {/* Back Card */}
          <div className="absolute inset-0 backface-hidden glass-card p-8 sm:p-12 flex flex-col justify-center items-center text-center shadow-2xl border-emerald-500/30 bg-emerald-50/95 dark:bg-[#0c1f17]/95 transform rotateY-180">
            <span className="absolute top-6 left-6 text-[10px] sm:text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              Answer / Explanation
            </span>
            <span className="absolute top-6 right-6 text-xs text-emerald-800/40 dark:text-emerald-500/60 font-bold">
              ✨ Solution
            </span>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-emerald-100 leading-relaxed max-w-xl overflow-y-auto max-h-[70%]">
              {activeCard.back}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Spaced Repetition Controls */}
      <div className="space-y-4 pt-2">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-purple-950/60 dark:text-purple-300/60">
          How well did you recall this answer?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleRating('again'); }}
            disabled={submitting}
            className="p-4 rounded-2xl border border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 font-black tracking-wide text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-base sm:text-lg">🔴</span>
            <span>Again (1d)</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleRating('hard'); }}
            disabled={submitting}
            className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black tracking-wide text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-base sm:text-lg">🟡</span>
            <span>Hard (2d)</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleRating('good'); }}
            disabled={submitting}
            className="p-4 rounded-2xl border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-black tracking-wide text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-base sm:text-lg">🔵</span>
            <span>Good (3d)</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleRating('easy'); }}
            disabled={submitting}
            className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black tracking-wide text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-base sm:text-lg">🟢</span>
            <span>Easy (7d)</span>
          </button>
        </div>
      </div>

      <footer className="flex justify-between items-center pt-6 px-2 border-t border-purple-600/10 dark:border-white/5">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="glass-button-secondary !py-2 text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          ← Previous Card
        </button>
        <Link to={`/notes/${shareId}`} className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400 hover:underline">
          Return to Study Guide 📚
        </Link>
        <button
          onClick={() => setCurrent((c) => Math.min(cards.length - 1, c + 1))}
          disabled={current === cards.length - 1}
          className="glass-button-secondary !py-2 text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Next Card →
        </button>
      </footer>
    </div>
  );
}
