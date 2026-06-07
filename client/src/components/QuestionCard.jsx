import React, { useState } from 'react';

export default function QuestionCard({ question, index, total, value, onChange, showResult }) {
  const { type, question: text, options, explanation } = question;
  const [showExplanation, setShowExplanation] = useState(true);

  const getStatusClasses = () => {
    if (!showResult) return 'border-purple-600/20 dark:border-white/10 bg-white/90 dark:bg-white/5 shadow-md dark:shadow-none';
    return value?.isCorrect 
      ? 'border-emerald-500/50 bg-emerald-50/90 dark:bg-emerald-500/5' 
      : 'border-red-500/50 bg-red-50/90 dark:bg-red-500/5';
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${getStatusClasses()} space-y-6`}>
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 rounded-full bg-purple-600/10 border border-purple-600/20 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm">
          {type === 'mcq' ? 'Multiple Choice' : type === 'truefalse' ? 'True / False' : type === 'fillintheblank' ? 'Fill in Blank' : 'Short Answer'}
        </span>
        <span className="text-xs sm:text-sm font-bold text-slate-500">{index + 1} of {total}</span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">{text}</h2>

      {type === 'mcq' && (
        <div className="grid gap-2.5 sm:gap-3">
          {options.map((opt) => {
            let stateClasses = 'bg-white dark:bg-white/5 border-purple-600/20 dark:border-white/10 hover:border-purple-600/50 hover:bg-purple-50/80 dark:hover:bg-white/10 text-slate-800 dark:text-gray-300 shadow-sm dark:shadow-none cursor-pointer';
            
            if (showResult) {
              if (opt === question.answer) stateClasses = 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-bold shadow-md';
              else if (opt === value?.answer) stateClasses = 'bg-red-100 dark:bg-red-500/20 border-red-500 text-red-800 dark:text-red-400 font-bold shadow-md';
            } else if (value?.answer === opt) {
              stateClasses = 'bg-gradient-to-r from-purple-700 to-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/30 font-bold';
            }

            return (
              <button 
                key={opt} 
                className={`w-full p-3.5 sm:p-4 rounded-xl text-left text-sm sm:text-base font-medium border transition-all duration-200 ${stateClasses}`}
                onClick={() => !showResult && onChange(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {type === 'truefalse' && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {['True', 'False'].map((opt) => {
            let stateClasses = 'bg-white dark:bg-white/5 border-purple-600/20 dark:border-white/10 hover:border-purple-600/50 hover:bg-purple-50/80 dark:hover:bg-white/10 text-slate-800 dark:text-gray-300 shadow-sm dark:shadow-none cursor-pointer';
            
            if (showResult) {
              if (opt === question.answer) stateClasses = 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-bold shadow-md';
              else if (opt === value?.answer) stateClasses = 'bg-red-100 dark:bg-red-500/20 border-red-500 text-red-800 dark:text-red-400 font-bold shadow-md';
            } else if (value?.answer === opt) {
              stateClasses = 'bg-gradient-to-r from-purple-700 to-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/30 font-bold';
            }

            return (
              <button 
                key={opt} 
                className={`flex-1 p-4 sm:p-5 rounded-xl font-bold border transition-all duration-200 text-sm sm:text-base ${stateClasses}`}
                onClick={() => !showResult && onChange(opt)}
              >
                {opt === 'True' ? '✅ True' : '❌ False'}
              </button>
            );
          })}
        </div>
      )}

      {(type === 'fillintheblank' || type === 'shortanswer') && (
        <div className="space-y-4">
          <textarea
            rows={type === 'shortanswer' ? 4 : 1}
            className={`glass-input !py-3 !rounded-xl text-sm sm:text-base
              ${!showResult ? '' : (value?.isCorrect ? '!border-emerald-500 !bg-emerald-50/80 dark:!bg-emerald-500/10' : '!border-red-500 !bg-red-50/80 dark:!bg-red-500/10')}`}
            placeholder="Type your answer here..."
            value={value?.answer || ''}
            onChange={(e) => !showResult && onChange(e.target.value)}
            readOnly={showResult}
          />
          {showResult && !value?.isCorrect && (
            <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-500/10 border border-emerald-500/30 shadow-sm">
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-bold">Correct Answer:</p>
              <p className="text-slate-900 dark:text-white mt-1 font-bold text-sm sm:text-base">{question.answer}</p>
            </div>
          )}
        </div>
      )}

      {/* AI Tutor Explanation Box */}
      {showResult && explanation && (
        <div className="mt-6 pt-6 border-t border-purple-600/20 dark:border-white/10 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <span className="p-1 bg-purple-600/15 dark:bg-purple-500/20 rounded text-base sm:text-lg animate-pulse">✨</span>
              AI Tutor Explanation
            </h3>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-purple-950/60 dark:text-purple-300/60 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
            >
              {showExplanation ? 'Collapse ▲' : 'Expand ▼'}
            </button>
          </div>
          {showExplanation && (
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-500/10 border border-purple-600/20 dark:border-purple-400/20 text-slate-800 dark:text-purple-100/90 text-sm sm:text-base leading-relaxed shadow-sm">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
