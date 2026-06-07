import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import ScoreCard from '../components/ScoreCard';
import QuestionCard from '../components/QuestionCard';
import { generateStudyNotes, generateAdaptiveRetake } from '../utils/api';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { results, quiz, playerName } = useQuiz();
  const [showReview, setShowReview] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingAdaptive, setLoadingAdaptive] = useState(false);

  if (!results || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 px-4 text-center">
        <p className="text-lg sm:text-xl text-purple-950/70 dark:text-purple-300/70 font-semibold">No results found for this session.</p>
        <Link to="/" className="btn-premium !py-3 !px-6 text-sm sm:text-base">
          Generate New Quiz
        </Link>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/quiz/${shareId}`);
    toast.success('Quiz link copied to clipboard!');
  };

  const handleGenerateNotes = async () => {
    setLoadingNotes(true);
    const toastId = toast.loading('Generating AI Study Guide & Flashcards...');
    try {
      const res = await generateStudyNotes(shareId);
      toast.success('Study notes ready!', { id: toastId });
      navigate(`/notes/${res.data.shareId}`);
    } catch (err) {
      toast.error('Failed to generate notes.', { id: toastId });
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAdaptiveRetake = async () => {
    setLoadingAdaptive(true);
    const toastId = toast.loading('Analyzing weak concepts for adaptive retake...');
    try {
      const res = await generateAdaptiveRetake(shareId);
      toast.success('Adaptive quiz initialized!', { id: toastId });
      navigate(`/quiz/${res.data.shareId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initialize adaptive retake.', { id: toastId });
    } finally {
      setLoadingAdaptive(false);
    }
  };

  const correctCount = results.gradedAnswers.filter(a => a.isCorrect).length;
  const wrongCount = results.gradedAnswers.length - correctCount;

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-20 px-4 overflow-x-hidden animate-fadeIn">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <div className="glass-card p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {quiz.detectedTopic && (
          <div className="absolute top-4 right-4 bg-purple-600/20 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-purple-700 dark:text-purple-300">
            {quiz.detectedTopic}
          </div>
        )}
        <ScoreCard
          score={results.score}
          maxScore={results.maxScore}
          percentage={results.percentage}
          playerName={playerName}
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/30 rounded-3xl text-center shadow-sm dark:shadow-none">
          <span className="block text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400">{correctCount}</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-800/80 dark:text-emerald-500/80 uppercase tracking-widest mt-1">Correct</span>
        </div>
        <div className="p-5 sm:p-6 bg-red-50 dark:bg-red-500/5 border border-red-500/30 rounded-3xl text-center shadow-sm dark:shadow-none">
          <span className="block text-3xl sm:text-4xl font-black text-red-700 dark:text-red-400">{wrongCount}</span>
          <span className="text-xs sm:text-sm font-bold text-red-800/80 dark:text-red-500/80 uppercase tracking-widest mt-1">Incorrect</span>
        </div>
        <div className="p-5 sm:p-6 bg-purple-50 dark:bg-purple-500/15 border border-purple-500/30 rounded-3xl text-center shadow-sm dark:shadow-none">
          <span className="block text-3xl sm:text-4xl font-black text-purple-700 dark:text-purple-400">{results.gradedAnswers.length}</span>
          <span className="text-xs sm:text-sm font-bold text-purple-950/80 dark:text-purple-300/80 uppercase tracking-widest mt-1">Total Items</span>
        </div>
      </div>

      {/* Advanced AI Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleGenerateNotes}
          disabled={loadingNotes}
          className="btn-premium !py-4 flex items-center justify-center gap-3 w-full shadow-lg disabled:opacity-50 text-sm sm:text-base font-black cursor-pointer"
        >
          <span>📚</span> {loadingNotes ? 'Generating Study Guide...' : 'AI Study Notes & Flashcards'}
        </button>
        <button
          onClick={handleAdaptiveRetake}
          disabled={loadingAdaptive || wrongCount === 0}
          className="btn-premium !py-4 !from-fuchsia-700 !to-purple-800 flex items-center justify-center gap-3 w-full shadow-lg disabled:opacity-50 text-sm sm:text-base font-black cursor-pointer"
        >
          <span>🎯</span> {loadingAdaptive ? 'Initializing Retake...' : wrongCount === 0 ? 'Flawless Mastery Achieved!' : 'Adaptive Focus Retake'}
        </button>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
        <button 
          onClick={copyLink}
          className="w-full sm:w-auto glass-button-secondary flex items-center justify-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base shadow-sm"
        >
          <span>🔗</span> Copy Quiz Link
        </button>
        <Link 
          to={`/leaderboard/${shareId}`}
          className="w-full sm:w-auto glass-button-secondary flex items-center justify-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base shadow-sm font-bold"
        >
          <span>🏆</span> View Leaderboard
        </Link>
        <button 
          onClick={() => navigate('/')}
          className="w-full sm:w-auto glass-button-secondary cursor-pointer text-sm sm:text-base shadow-sm"
        >
          New Quiz
        </button>
      </div>

      {/* Review Section */}
      <div className="space-y-6 glass-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Question Review & AI Explanations</h3>
          <button 
            onClick={() => setShowReview(!showReview)}
            className="text-purple-700 dark:text-purple-400 font-bold hover:underline transition cursor-pointer text-sm sm:text-base text-left sm:text-right"
          >
            {showReview ? 'Hide Review ▲' : 'Show Review ▼'}
          </button>
        </div>

        {showReview && (
          <div className="grid gap-6 animate-fadeIn pt-2">
            {quiz.questions.map((q, i) => {
              const graded = results.gradedAnswers[i];
              return (
                <QuestionCard
                  key={i}
                  question={{ ...q, answer: graded?.correctAnswer }}
                  index={i}
                  total={quiz.questions.length}
                  value={{ answer: graded?.answer, isCorrect: graded?.isCorrect }}
                  onChange={() => {}}
                  showResult={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
