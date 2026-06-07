import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudyNotes } from '../utils/api';
import toast from 'react-hot-toast';

export default function StudyNotesPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudyNotes(shareId)
      .then((res) => setNotes(res.data))
      .catch(() => toast.error('Study guide not found or generating.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-purple-950/70 dark:text-purple-300/70 font-semibold animate-pulse">Loading AI Study Guide...</p>
    </div>
  );

  if (!notes) return (
    <div className="text-center py-20 space-y-4 px-4">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Study Guide Not Found</h2>
      <button onClick={() => navigate('/')} className="btn-premium !py-3 !px-6 text-sm sm:text-base">Return Home</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-6 py-8 pb-20 overflow-x-hidden animate-fadeIn">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
      </div>

      <header className="glass-card p-6 sm:p-10 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-xs font-black uppercase tracking-widest">
              {notes.topic || 'General CS'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{notes.title}</h1>
          </div>
          <Link
            to={`/flashcards/${shareId}`}
            className="btn-premium !py-3.5 !px-6 text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-lg flex-shrink-0 cursor-pointer"
          >
            <span>🎴</span> Interactive Flashcards
          </Link>
        </div>
        <p className="text-sm sm:text-base text-purple-950/80 dark:text-purple-100/80 font-medium leading-relaxed pt-2 border-t border-purple-600/10 dark:border-white/10">
          {notes.summary}
        </p>
      </header>

      {/* Key Concepts */}
      {notes.keyConcepts?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-base sm:text-lg">💡</span>
            Key Concepts & Definitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {notes.keyConcepts.map((kc, idx) => (
              <div key={idx} className="glass-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-all space-y-2 border-purple-600/20 dark:border-purple-400/20">
                <h3 className="text-base sm:text-lg font-bold text-purple-800 dark:text-purple-300">{kc.concept}</h3>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-purple-100/80 leading-relaxed">{kc.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formulas & Code Snippets */}
      {notes.formulasOrSnippets?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-base sm:text-lg">📐</span>
            Important Rules & Snippets
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {notes.formulasOrSnippets.map((fs, idx) => (
              <div key={idx} className="glass-card p-5 sm:p-6 shadow-md bg-purple-50/50 dark:bg-purple-950/20 font-mono text-sm border-purple-600/30 dark:border-purple-500/30">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">{fs.title}</h4>
                <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-black/40 text-purple-950 dark:text-purple-100 overflow-x-auto text-xs sm:text-sm border border-purple-600/20 dark:border-white/10">
                  {fs.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Prep Q&A */}
      {notes.interviewQuestions?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-base sm:text-lg">🎤</span>
            Interview Q&A Vault
          </h2>
          <div className="space-y-4">
            {notes.interviewQuestions.map((iq, idx) => (
              <div key={idx} className="glass-card p-5 sm:p-6 shadow-md space-y-3 border-purple-600/20 dark:border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Q{idx + 1}: {iq.question}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex-shrink-0
                    ${iq.difficulty === 'hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    {iq.difficulty || 'Medium'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/80 dark:bg-purple-500/10 border border-purple-600/20 dark:border-white/5 text-slate-800 dark:text-purple-100/90 text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">Expected Answer:</span>
                  {iq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <footer className="flex justify-center gap-4 pt-6">
        <Link to="/explore" className="glass-button-secondary text-sm sm:text-base shadow-sm">Explore More Topics</Link>
        <Link to={`/flashcards/${shareId}`} className="btn-premium !py-3.5 !px-8 text-sm sm:text-base font-black shadow-md">
          Launch Flashcard Deck 🎴
        </Link>
      </footer>
    </div>
  );
}
