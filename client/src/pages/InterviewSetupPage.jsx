import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadInterviewResume } from '../utils/api';
import toast from 'react-hot-toast';

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      toast.error('Please upload your resume PDF or paste your background details.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Analyzing background and generating tailored interview rounds...');
    
    try {
      const formData = new FormData();
      formData.append('targetRole', targetRole);
      if (file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', resumeText);
      }

      const res = await uploadInterviewResume(formData);
      toast.success('Interview simulator initialized!', { id: toastId });
      navigate(`/interview/${res.data.shareId}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to initialize interview simulator.';
      toast.error(`Error: ${errorMsg}`, { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 overflow-x-hidden animate-fadeIn">
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
      </div>

      <header className="text-center space-y-3">
        <span className="px-4 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-xs font-black uppercase tracking-widest inline-block">
          AI Interview Simulator
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Technical & Behavioral Prep</h1>
        <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-200/70 max-w-xl mx-auto">
          Upload your resume or job description to generate customized technical questions, system design problems, and HR behavioral prompts.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-purple-950 dark:text-purple-200">
            Target Job Title / Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer (React/TypeScript)"
            className="glass-input font-bold"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-black uppercase tracking-widest text-purple-950 dark:text-purple-200">
            Upload Resume (PDF)
          </label>
          <div className="border-2 border-dashed border-purple-600/30 rounded-3xl p-8 text-center bg-purple-50/40 dark:bg-purple-950/20 hover:border-purple-600/60 transition cursor-pointer relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-2">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-bold text-slate-800 dark:text-purple-100">
                {file ? file.name : 'Drag & drop your resume PDF here or click to browse'}
              </p>
              <p className="text-xs text-purple-950/50 dark:text-purple-300/50">Supports PDF documents up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-purple-950 dark:text-purple-200">
            Or Paste Profile / Background Text
          </label>
          <textarea
            rows={4}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text, key skills, or job description requirements here..."
            className="glass-input text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium w-full !py-4 font-black shadow-lg text-sm sm:text-base cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Generating Interview Rounds...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Launch Mock Interview Simulator</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
