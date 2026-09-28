
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInterviewSession, submitInterviewSession } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function InterviewSessionPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getInterviewSession(shareId)
      .then((res) => {
        setSession(res.data);
        const initialResponses = {};
        res.data.questions?.forEach((q, idx) => {
          initialResponses[idx] = q.userResponse || '';
        });
        setResponses(initialResponses);
      })
      .catch(() => toast.error('Interview session not found.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleResponseChange = (val) => {
    setResponses((prev) => ({ ...prev, [current]: val }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const toastId = toast.loading('AI is grading your technical & behavioral answers...');

    try {
      const res = await submitInterviewSession(shareId, responses);
      toast.success('Evaluation complete!', { id: toastId });
      setSession(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit evaluation.';
      toast.error(`Error: ${msg}`, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 sm:gap-4 px-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-300/70 font-semibold animate-pulse text-center">
        Loading Interview Simulator...
      </p>
    </div>
  );

  if (!session) return (
    <div className="text-center py-16 sm:py-20 space-y-4 px-4">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
        Session Not Found
      </h2>
      <button
        onClick={() => navigate('/interview')}
        className="btn-premium !py-3 !px-5 sm:!px-6 text-sm sm:text-base"
      >
        Initialize New Session
      </button>
    </div>
  );

  const questions = session.questions || [];
  const q = questions[current];

  // If session is completed, render results view
  if (session.status === 'completed') {
    return (
      <div className="max-w-4xl mx-auto space-y-7 sm:space-y-10 px-3 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-20 overflow-x-hidden animate-fadeIn">
        <div className="bg-animate">
          <div className="bg-orb orb-1" />
          <div className="bg-orb orb-2" />
        </div>

        {/* Overall Evaluation Score Header */}
        <header className="glass-card p-5 sm:p-8 md:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 sm:px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[9px] sm:text-xs font-black uppercase tracking-widest">
            Grading Complete
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight px-2">
            Interview Evaluation Report
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-purple-950/70 dark:text-purple-200/70 break-words">
            Target Role:{' '}
            <span className="font-bold text-purple-700 dark:text-purple-300">
              {session.targetRole}
            </span>
          </p>

          <div className="inline-flex flex-col items-center justify-center p-5 sm:p-8 rounded-full bg-purple-50 dark:bg-purple-500/10 border-4 border-purple-600/30 w-36 h-36 sm:w-44 sm:h-44 shadow-lg mx-auto">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-purple-700 dark:text-purple-400">
              {session.overallScore}%
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1 text-center">
              Overall Score
            </span>
          </div>
        </header>

        {/* Strengths & Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="glass-card p-5 sm:p-6 md:p-8 space-y-4 shadow-lg border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <span>🚀</span> Key Strengths
            </h2>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-emerald-100/90 font-medium list-disc list-inside break-words">
              {session.strengths?.map((str, idx) => <li key={idx}>{str}</li>)}
            </ul>
          </div>

          <div className="glass-card p-5 sm:p-6 md:p-8 space-y-4 shadow-lg border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <span>🎯</span> Areas for Growth
            </h2>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-amber-100/90 font-medium list-disc list-inside break-words">
              {session.improvementAreas?.map((imp, idx) => <li key={idx}>{imp}</li>)}
            </ul>
          </div>
        </div>

        {/* Detailed Question Review */}
        <section className="space-y-5 sm:space-y-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 leading-tight">
            <span className="p-1.5 sm:p-2 bg-purple-600/10 rounded-xl text-base sm:text-lg flex-shrink-0">
              📋
            </span>
            <span>Question-by-Question Evaluation</span>
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {questions.map((quest, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 md:p-8 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-600/15 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-widest w-fit">
                      {quest.category}
                    </span>

                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-fuchsia-600/15 text-fuchsia-800 dark:text-fuchsia-300 text-[10px] sm:text-xs font-black uppercase tracking-widest w-fit">
                      {quest.type === 'mcq' ? 'Multiple Choice' : 'Open Response'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs md:text-sm font-black px-2.5 sm:px-3 py-1 rounded-lg shadow-sm w-fit
                    ${quest.score >= 8 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' : quest.score >= 6 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'}`}
                  >
                    Score: {quest.score} / 10
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base md:text-lg leading-relaxed break-words">
                  {quest.question}
                </h3>

                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    Your Response:
                  </span>

                  <div className="p-3 sm:p-4 rounded-xl bg-purple-50/50 dark:bg-black/30 text-purple-950 dark:text-purple-100 text-xs sm:text-sm leading-relaxed border border-purple-600/20 dark:border-white/5 break-words whitespace-pre-wrap overflow-hidden">
                    {quest.userResponse || <span className="italic opacity-50">No response provided.</span>}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-purple-600/10 dark:border-white/5">
                  <span className="text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest flex items-start gap-1.5">
                    <span>✨</span>
                    <span>AI Interviewer Critique:</span>
                  </span>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-purple-100/90 leading-relaxed font-medium break-words">
                    {quest.aiFeedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
          <Link
            to="/interview"
            className="btn-premium !py-3 sm:!py-3.5 !px-5 sm:!px-8 text-sm sm:text-base font-black shadow-lg text-center"
          >
            Start New Mock Interview 🚀
          </Link>

          <Link
            to="/explore"
            className="glass-button-secondary text-sm sm:text-base shadow-sm text-center"
          >
            Explore Topics
          </Link>
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 px-3 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-20 overflow-x-hidden animate-fadeIn">
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      <header className="glass-card p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0 w-full sm:w-auto">
          <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-widest inline-block max-w-full break-words">
            {session.targetRole}
          </span>

          <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Mock Interview Round
          </h1>
        </div>

        <div className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 w-full sm:w-auto">
          Question{' '}
          <span className="text-purple-700 dark:text-purple-300 font-black">
            {current + 1}
          </span>{' '}
          of {questions.length}
        </div>
      </header>

      {/* Main Question Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-4 sm:p-6 md:p-10 shadow-xl space-y-5 sm:space-y-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-fuchsia-600/15 border border-fuchsia-500/30 text-fuchsia-800 dark:text-fuchsia-300 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              {q.category}
            </span>

            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              {q.type === 'mcq' ? 'Conceptual MCQ' : 'Open Verbal Response'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed break-words">
            {q.question}
          </h2>

          <div className="space-y-3 pt-2 sm:pt-4">
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-purple-950 dark:text-purple-200">
              {q.type === 'mcq' ? 'Select the correct option:' : 'Your Detailed Response:'}
            </label>

            {q.type === 'mcq' ? (
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                {q.options?.map((opt, oIdx) => {
                  const isSelected = responses[current] === opt;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleResponseChange(opt)}
                      className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer font-bold text-sm sm:text-base shadow-sm
                        ${isSelected 
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.01]' 
                          : 'bg-white dark:bg-[#150a2c]/60 text-slate-900 dark:text-white border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-500/15'}`}
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 text-xs sm:text-sm
                        ${isSelected ? 'bg-white text-purple-700 shadow-sm' : 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200'}`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>

                      <span className="flex-1 leading-relaxed break-words min-w-0">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                rows={8}
                value={responses[current] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Explain your technical approach, architecture trade-offs, or STAR method answer here..."
                className="glass-input !py-3 sm:!py-4 text-sm sm:text-base leading-relaxed font-sans w-full min-h-[180px] sm:min-h-0"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="glass-card p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="w-full sm:w-auto glass-button-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-sm sm:text-base"
        >
          ← Previous
        </button>

        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center py-1 sm:py-0 max-w-full">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer
                ${idx === current ? 'bg-purple-600 scale-125 shadow-md shadow-purple-500/50' : (responses[idx] ? 'bg-purple-600/60 dark:bg-purple-500/50' : 'bg-purple-600/20 dark:bg-white/10 hover:bg-purple-600/40 dark:hover:bg-white/20')}`}
            />
          ))}
        </div>

        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 text-white font-black shadow-md shadow-purple-900/30 transition-all cursor-pointer text-sm sm:text-base"
          >
            Next Question →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto btn-premium !py-3 sm:!py-3.5 font-black shadow-lg disabled:opacity-50 text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? 'Grading Responses...' : '🎯 Submit Interview'}
          </button>
        )}
      </div>
    </div>
  );
}
