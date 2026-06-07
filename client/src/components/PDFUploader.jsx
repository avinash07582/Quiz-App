import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFUploader({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(15);
  const [timeLimit, setTimeLimit] = useState(600);
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('General');

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: loading,
  });

  const handleSubmit = () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('questionCount', questionCount);
    fd.append('timeLimit', timeLimit);
    fd.append('difficulty', difficulty);
    fd.append('category', category);
    onUpload(fd, file.name);
  };

  return (
    <div className="glass-card p-6 sm:p-12 relative overflow-hidden group/uploader shadow-lg">
      {/* Animated pure purple gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-fuchsia-500/20 to-purple-900/20 opacity-0 group-hover/uploader:opacity-100 transition-opacity duration-1000 blur-3xl -z-10" />

      <div className="space-y-8 sm:space-y-10">
        {/* Dropzone */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          {...getRootProps()} 
          className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-12 text-center transition-all duration-500
            ${isDragActive ? 'border-purple-600 bg-purple-600/10' : 'border-purple-600/30 dark:border-purple-500/40 hover:border-purple-600/50 dark:hover:border-purple-400 bg-purple-50/50 dark:bg-[#150a2c]/40'}
            ${file ? 'border-purple-600 bg-purple-600/10' : ''}`}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div 
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <span className="text-5xl sm:text-6xl block mb-2 sm:mb-4 filter drop-shadow-md">📄</span>
                <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md mx-auto px-2">{file.name}</p>
                <div className="inline-flex px-3.5 sm:px-4 py-1 sm:py-1.5 bg-purple-600/10 dark:bg-purple-600/20 border border-purple-600/30 dark:border-purple-500/40 rounded-full text-purple-900 dark:text-purple-200 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                  Ready for synthesis
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-600/10 border border-purple-600/20 dark:border-purple-500/30 rounded-[1.75rem] sm:rounded-[2rem] flex items-center justify-center text-purple-700 dark:text-purple-300 group-hover/uploader:text-purple-950 dark:group-hover/uploader:text-purple-100 group-hover/uploader:border-purple-600/40 transition-all duration-500">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isDragActive ? 'Release Asset' : 'Drop Research PDF'}
                  </p>
                  <p className="text-xs sm:text-sm text-purple-950/60 dark:text-purple-300/60 font-medium mt-1.5 sm:mt-2">Maximum file capacity: 20MB</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-left">
          <div className="space-y-3 sm:space-y-4">
            <label className="text-[10px] sm:text-xs font-black text-purple-950/70 dark:text-purple-300/70 uppercase tracking-[0.2em] ml-1">Question Quota</label>
            <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-purple-50/60 dark:bg-[#150a2c]/60 border border-purple-600/30 rounded-2xl shadow-inner">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer
                    ${questionCount === n ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-md shadow-purple-900/30 font-black' : 'text-purple-950/80 dark:text-purple-300/80 hover:text-slate-900 dark:hover:text-white hover:bg-purple-600/10'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="text-[10px] sm:text-xs font-black text-purple-950/70 dark:text-purple-300/70 uppercase tracking-[0.2em] ml-1">Time Allocation</label>
            <select 
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="glass-input !py-3 !text-xs sm:!text-sm !font-bold cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%22%237c3aed%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/></svg>')] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value={300} className="bg-white dark:bg-[#0d071a] text-slate-900 dark:text-white font-bold">5 Minutes</option>
              <option value={600} className="bg-white dark:bg-[#0d071a] text-slate-900 dark:text-white font-bold">10 Minutes</option>
              <option value={900} className="bg-white dark:bg-[#0d071a] text-slate-900 dark:text-white font-bold">15 Minutes</option>
              <option value={1200} className="bg-white dark:bg-[#0d071a] text-slate-900 dark:text-white font-bold">20 Minutes</option>
            </select>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="text-[10px] sm:text-xs font-black text-purple-950/70 dark:text-purple-300/70 uppercase tracking-[0.2em] ml-1">Neural Complexity</label>
            <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-purple-50/60 dark:bg-[#150a2c]/60 border border-purple-600/30 rounded-2xl shadow-inner">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black capitalize transition-all duration-300 cursor-pointer
                    ${difficulty === d ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-md shadow-purple-900/30 font-black' : 'text-purple-950/80 dark:text-purple-300/80 hover:text-slate-900 dark:hover:text-white hover:bg-purple-600/10'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="text-[10px] sm:text-xs font-black text-purple-950/70 dark:text-purple-300/70 uppercase tracking-[0.2em] ml-1">Domain Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input !py-3 !text-xs sm:!text-sm !font-bold"
              placeholder="e.g. Astrophysics"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="btn-premium w-full !py-4 sm:!py-5 flex items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg cursor-pointer shadow-md"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-sm sm:text-base">Initializing Neural Synthesis...</span>
            </div>
          ) : (
            <>
              <span className="brightness-125 text-xl sm:text-2xl">⚡</span>
              <span>Generate Neural Assessment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
