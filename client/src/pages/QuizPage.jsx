import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../utils/api';
import { useQuiz } from '../context/QuizContext';
import { useTimer } from '../hooks/useTimer';
import NameModal from '../components/NameModal';
import QuestionCard from '../components/QuestionCard';
import TimerBar from '../components/TimerBar';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { setQuiz, setPlayerName, setResults, playerName } = useQuiz();

  const [quiz, setLocalQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    getQuiz(shareId)
      .then((res) => { setLocalQuiz(res.data); setQuiz(res.data); })
      .catch(() => toast.error('Quiz not found'))
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleExpire = () => handleSubmit(true);

  const { display, pct, start, stop } = useTimer(
    quiz?.timeLimit || 600,
    handleExpire
  );

  const handleStart = (name) => {
    setPlayerName(name);
    setStarted(true);
    startTimeRef.current = Date.now();
    start();
  };

  const handleAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [current]: val }));
  };

  async function handleSubmit(auto = false) {
    if (submitting) return;
    setSubmitting(true);
    stop();
    const timeTaken = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    const answersArr = quiz.questions.map((_, i) => answers[i] || '');
    
    // Track skipped questions
    const skippedQuestions = quiz.questions
      .map((_, i) => i)
      .filter(i => !answers[i]);

    try {
      const res = await submitQuiz(shareId, {
        playerName,
        answers: answersArr,
        timeTaken,
        skippedQuestions,
      });
      setResults(res.data);
      if (auto) toast('⏰ Time\'s up! Auto-submitted.', { icon: '⏰' });
      navigate(`/results/${shareId}`);
    } catch (err) {
      toast.error('Failed to submit quiz.');
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-purple-950/70 dark:text-purple-300/70 animate-pulse font-semibold text-sm sm:text-base">Loading your quiz...</p>
    </div>
  );

  if (!quiz) return (
    <div className="text-center py-20 space-y-4 px-4">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Quiz not found</h2>
      <button onClick={() => navigate('/')} className="btn-premium !py-3 !px-6 text-sm sm:text-base">Return Home</button>
    </div>
  );

  if (!started) return <NameModal onStart={handleStart} />;

  const q = quiz.questions[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20 px-3 sm:px-4">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-3" />
      </div>

      {/* Header Info */}
      <div className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-md">
        <div className="space-y-1 w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white line-clamp-1">{quiz.title}</h1>
          <p className="text-xs sm:text-sm text-purple-950/70 dark:text-purple-300/70 font-medium">
            Progress: <span className="text-purple-700 dark:text-purple-400 font-black">{answeredCount}</span> of {quiz.questions.length} answered
          </p>
        </div>
        <div className="w-full sm:w-64">
          <TimerBar display={display} pct={pct} />
        </div>
      </div>

      {/* Main Quiz Body */}
      <div className="space-y-6">
        <QuestionCard
          question={q}
          index={current}
          total={quiz.questions.length}
          value={{ answer: answers[current] || '' }}
          onChange={handleAnswer}
          showResult={false}
        />

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 glass-card p-4 sm:p-6 shadow-md">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="w-full sm:w-auto glass-button-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-sm sm:text-base order-2 sm:order-1"
          >
            ← Previous
          </button>

          <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center max-w-xs py-2 sm:py-0 order-1 sm:order-2">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 transform cursor-pointer
                  ${i === current ? 'bg-purple-600 scale-125 shadow-md shadow-purple-500/50' : (answers[i] ? 'bg-purple-600/60 dark:bg-purple-500/50' : 'bg-purple-600/20 dark:bg-white/10 hover:bg-purple-600/40 dark:hover:bg-white/20')}`}
              />
            ))}
          </div>

          {current < quiz.questions.length - 1 ? (
            <button 
              onClick={() => setCurrent((c) => c + 1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 text-white font-black shadow-md shadow-purple-900/30 transition-all cursor-pointer text-sm sm:text-base order-3"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="w-full sm:w-auto btn-premium !py-3 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base order-3 shadow-md font-black"
            >
              {submitting ? 'Submitting...' : '🎯 Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
