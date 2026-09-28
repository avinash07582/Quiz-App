
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PDFUploader from '../components/PDFUploader';
import LoadingScreen from '../components/LoadingScreen';
import { uploadQuiz } from '../utils/api';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pdfName, setPdfName] = useState('');

  const handleUpload = async (formData, fileName) => {
    setLoading(true);
    setPdfName(fileName);
    try {
      const res = await uploadQuiz(formData);
      const { shareId } = res.data;
      toast.success('Quiz Engine Synchronized');
      navigate(`/quiz/${shareId}`);
    } catch (err) {
      toast.error('Processing failed. Ensure PDF is valid.');
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen pdfName={pdfName} />;

  return (
    <div className="relative max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-10 pb-16 sm:pb-20 space-y-12 sm:space-y-20 md:space-y-24 overflow-x-hidden">
      {/* Background elements */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 sm:space-y-10"
      >
        <div className="inline-flex max-w-full items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 bg-purple-600/10 dark:bg-purple-500/15 border border-purple-600/20 dark:border-purple-500/40 rounded-full text-purple-950 dark:text-purple-300 text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] shadow-sm text-center">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse flex-shrink-0" />
          <span className="break-words">Powered by Gemini 2.5 Flash Intelligence</span>
        </div>
        
        <div className="space-y-4 sm:space-y-6 px-1 sm:px-2">
          <h1 className="text-3xl min-[400px]:text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] sm:leading-[0.9]">
            Transform Data into <br />
            <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-900 dark:from-purple-400 dark:via-fuchsia-300 dark:to-purple-500 bg-clip-text text-transparent">
              Neural Quizzes.
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-purple-950/70 dark:text-purple-200/70 max-w-2xl mx-auto font-medium leading-relaxed px-2 sm:px-4">
            The next generation of AI-driven education. Upload complex PDF documents and witness the conversion into high-fidelity assessments instantly.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative max-w-3xl mx-auto px-0 sm:px-0"
        >
          {/* Decorative rings */}
          <div className="absolute -inset-3 sm:-inset-10 bg-purple-600/10 dark:bg-purple-500/15 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />
          <PDFUploader onUpload={handleUpload} loading={loading} />
        </motion.div>
      </motion.section>

      {/* Capabilities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-0 sm:px-2">
        {[
          { 
            icon: '🧠', 
            title: 'Neural Parsing', 
            desc: 'Deep context analysis of technical whitepapers, textbooks, and research journals.' 
          },
          { 
            icon: '⚡', 
            title: 'Instant Synthesis', 
            desc: 'Generate comprehensive assessments in sub-second cycles using our proprietary pipeline.' 
          },
          { 
            icon: '🛡️', 
            title: 'Enterprise Security', 
            desc: 'End-to-end encryption for all uploaded assets and generated evaluation data.' 
          },
        ].map((f, i) => (
          <motion.div 
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + (i * 0.2) }}
            className="glass-card p-5 sm:p-8 md:p-10 hover:border-purple-600/40 dark:hover:border-purple-500/50 transition-all duration-500 group"
          >
            <span className="text-3xl sm:text-4xl md:text-5xl block mb-3 sm:mb-4 md:mb-6 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </span>

            <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight break-words">
              {f.title}
            </h3>

            <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-200/70 font-medium leading-relaxed break-words">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Dashboard Preview / Stats Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="glass-card p-1 overflow-hidden mx-0 sm:mx-0"
      >
        <div className="bg-purple-950/5 dark:bg-[#0c051f] border border-purple-600/20 dark:border-purple-500/30 rounded-[22px] p-4 sm:p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 transition-colors duration-500">
          <div className="space-y-3 sm:space-y-4 md:space-y-6 max-w-md text-left w-full">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
              Enterprise Analytics
            </h2>

            <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-200/70 font-medium leading-relaxed">
              Track performance across your organization with real-time telemetry and deep-dive accuracy metrics.
            </p>

            <div className="flex gap-4 w-full">
              <button className="glass-button-secondary cursor-pointer text-xs sm:text-sm w-full sm:w-auto">
                View Network Stats
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {[
              { label: 'Uptime', val: '99.99%' },
              { label: 'Latency', val: '24ms' },
              { label: 'Capacity', val: 'Infinite' },
              { label: 'Security', val: 'Level 4' },
            ].map(stat => (
              <div
                key={stat.label}
                className="p-3 sm:p-4 md:p-6 bg-white dark:bg-purple-500/15 border border-purple-600/20 dark:border-purple-500/30 rounded-2xl shadow-sm dark:shadow-none flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0 min-w-0"
              >
                <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-purple-800 dark:text-purple-300 uppercase tracking-widest break-words">
                  {stat.label}
                </span>

                <span className="block text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0 sm:mt-1 break-words text-right sm:text-left">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
