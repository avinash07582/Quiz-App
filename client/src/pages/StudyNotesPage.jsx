
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 sm:gap-4 px-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-300/70 font-semibold animate-pulse text-center">
        Loading AI Study Guide...
      </p>
    </div>
  );

  if (!notes) return (
    <div className="text-center py-16 sm:py-20 space-y-4 px-4">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
        Study Guide Not Found
      </h2>
      <button
        onClick={() => navigate('/')}
        className="btn-premium !py-3 !px-5 sm:!px-6 text-sm sm:text-base"
      >
        Return Home
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 md:space-y-12 px-3 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-20 overflow-x-hidden animate-fadeIn">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
      </div>

      <header className="glass-card p-4 sm:p-6 md:p-10 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-2 min-w-0">
            <span className="inline-block max-w-full px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-widest truncate">
              {notes.topic || 'General CS'}
            </span>

            <h1 className="text-xl min-[400px]:text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
              {notes.title}
            </h1>
          </div>

          <Link
            to={`/flashcards/${shareId}`}
            className="w-full sm:w-auto btn-premium !py-3 sm:!py-3.5 !px-5 sm:!px-6 text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-lg flex-shrink-0 cursor-pointer text-center"
          >
            <span>🎴</span>
            <span>Interactive Flashcards</span>
          </Link>
        </div>

        <p className="text-sm sm:text-base text-purple-950/80 dark:text-purple-100/80 font-medium leading-relaxed pt-3 sm:pt-2 border-t border-purple-600/10 dark:border-white/10 break-words">
          {notes.summary}
        </p>
      </header>

      {/* Key Concepts */}
      {notes.keyConcepts?.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-start gap-2.5 leading-tight">
            <span className="p-1.5 sm:p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-sm sm:text-base md:text-lg flex-shrink-0">
              💡
            </span>
            <span>Key Concepts & Definitions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {notes.keyConcepts.map((kc, idx) => (
              <div
                key={idx}
                className="glass-card p-4 sm:p-6 shadow-md hover:shadow-lg transition-all space-y-2 border-purple-600/20 dark:border-purple-400/20 min-w-0"
              >
                <h3 className="text-base sm:text-lg font-bold text-purple-800 dark:text-purple-300 break-words">
                  {kc.concept}
                </h3>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-purple-100/80 leading-relaxed break-words">
                  {kc.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formulas & Code Snippets */}
      {notes.formulasOrSnippets?.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-start gap-2.5 leading-tight">
            <span className="p-1.5 sm:p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-sm sm:text-base md:text-lg flex-shrink-0">
              📐
            </span>
            <span>Important Rules & Snippets</span>
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:gap-6">
            {notes.formulasOrSnippets.map((fs, idx) => (
              <div
                key={idx}
                className="glass-card p-4 sm:p-6 shadow-md bg-purple-50/50 dark:bg-purple-950/20 font-mono text-xs sm:text-sm border-purple-600/30 dark:border-purple-500/30 min-w-0"
              >
                <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2 break-words">
                  {fs.title}
                </h4>

                <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-black/40 text-purple-950 dark:text-purple-100 overflow-x-auto text-xs sm:text-sm border border-purple-600/20 dark:border-white/10 whitespace-pre-wrap break-words">
                  {fs.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Prep Q&A */}
      {notes.interviewQuestions?.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-start gap-2.5 leading-tight">
            <span className="p-1.5 sm:p-2 bg-purple-600/10 dark:bg-purple-500/20 rounded-xl text-sm sm:text-base md:text-lg flex-shrink-0">
              🎤
            </span>
            <span>Interview Q&A Vault</span>
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {notes.interviewQuestions.map((iq, idx) => (
              <div
                key={idx}
                className="glass-card p-4 sm:p-6 shadow-md space-y-3 border-purple-600/20 dark:border-white/10 min-w-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-relaxed break-words min-w-0">
                    Q{idx + 1}: {iq.question}
                  </h3>

                  <span className={`self-start px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex-shrink-0
                    ${iq.difficulty === 'hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    {iq.difficulty || 'Medium'}
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-purple-50/80 dark:bg-purple-500/10 border border-purple-600/20 dark:border-white/5 text-slate-800 dark:text-purple-100/90 text-xs sm:text-sm leading-relaxed break-words">
                  <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">
                    Expected Answer:
                  </span>
                  {iq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-5 sm:pt-6">
        <Link
          to="/explore"
          className="w-full sm:w-auto glass-button-secondary text-sm sm:text-base shadow-sm text-center"
        >
          Explore More Topics
        </Link>

        <Link
          to={`/flashcards/${shareId}`}
          className="w-full sm:w-auto btn-premium !py-3.5 !px-6 sm:!px-8 text-sm sm:text-base font-black shadow-md text-center"
        >
          Launch Flashcard Deck 🎴
        </Link>
      </footer>
    </div>
  );
}
