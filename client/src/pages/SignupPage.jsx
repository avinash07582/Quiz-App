
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, displayName);
      toast.success('Enterprise account established');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-10 overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-animate">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-5 sm:p-7 md:p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-600 mb-3 sm:mb-4 shadow-xl shadow-purple-500/30 border border-purple-400/20">
                <span className="text-2xl sm:text-3xl text-white">✨</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Onboarding
              </h1>

              <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-200/70 font-medium leading-relaxed px-1">
                Join 10k+ researchers using AI for discovery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 uppercase tracking-widest ml-1">
                  Full Identity
                </label>

                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="glass-input w-full text-sm sm:text-base"
                  placeholder="e.g. Alex Vance"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 uppercase tracking-widest ml-1">
                  Secure Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full text-sm sm:text-base"
                  placeholder="name@nexus.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 uppercase tracking-widest ml-1">
                  Encryption Key
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base !py-3.5 sm:!py-4 text-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Establish Secure Connection</span>
                )}
              </button>
            </form>

            <p className="text-center text-sm sm:text-base text-purple-950/70 dark:text-purple-300/70 font-medium leading-relaxed">
              Already have clearance?{' '}
              <Link
                to="/login"
                className="text-purple-700 dark:text-purple-400 hover:underline font-black transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
