
import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ pdfName }) {
  const steps = [
    { icon: '📄', text: 'Analyzing Neural Structures' },
    { icon: '✂️', text: 'Optimizing Data Chunks' },
    { icon: '🤖', text: 'Synthesizing Intelligence' },
    { icon: '🎯', text: 'Establishing Final Assessment' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#f5f3ff] dark:bg-[#000000] overflow-hidden transition-colors duration-500">
      {/* Background Orbs */}
      <div className="bg-animate opacity-40">
        <div className="bg-orb orb-1 scale-150" />
        <div className="bg-orb orb-2 scale-150" />
      </div>

      <div className="relative z-10 max-w-lg w-full px-4 sm:px-6 md:px-10 text-center space-y-8 sm:space-y-12 overflow-y-auto max-h-screen py-8">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-purple-600/30 rounded-full blur-3xl absolute inset-0 animate-pulse" />
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-600 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center relative shadow-2xl shadow-purple-500/50">
            <span className="text-4xl sm:text-5xl animate-bounce">⚡</span>
          </div>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Synthesis in Progress
          </motion.h2>
          {pdfName && (
            <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-300/70 font-medium break-words">
              Processing Source: <span className="text-purple-700 dark:text-purple-400 font-bold">{pdfName}</span>
            </p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.8 }}
              className="flex items-center gap-3 sm:gap-6 p-3 sm:p-5 glass-card border-purple-500/20"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0">{step.icon}</span>
              <span className="flex-1 min-w-0 text-left text-[10px] sm:text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest leading-relaxed">
                {step.text}
              </span>
              <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                {[1, 2, 3].map(d => (
                  <div key={d} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.2}s` }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="text-[10px] sm:text-xs text-purple-950/50 dark:text-purple-300/50 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] animate-pulse"
        >
          Synchronizing neural pathways...
        </motion.p>
      </div>
    </div>
  );
}
