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

      <div className="relative z-10 max-w-lg w-full px-10 text-center space-y-12">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 bg-purple-600/30 rounded-full blur-3xl absolute inset-0 animate-pulse" />
          <div className="w-32 h-32 bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-600 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl shadow-purple-500/50">
            <span className="text-5xl animate-bounce">⚡</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Synthesis in Progress
          </motion.h2>
          {pdfName && (
            <p className="text-purple-950/70 dark:text-purple-300/70 font-medium">
              Processing Source: <span className="text-purple-700 dark:text-purple-400 font-bold">{pdfName}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.8 }}
              className="flex items-center gap-6 p-5 glass-card border-purple-500/20"
            >
              <span className="text-2xl">{step.icon}</span>
              <span className="flex-1 text-left text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">{step.text}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(d => (
                  <div key={d} className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.2}s` }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="text-xs text-purple-950/50 dark:text-purple-300/50 font-bold uppercase tracking-[0.3em] animate-pulse"
        >
          Synchronizing neural pathways...
        </motion.p>
      </div>
    </div>
  );
}
