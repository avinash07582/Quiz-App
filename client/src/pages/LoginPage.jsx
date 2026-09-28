
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to QuizAI');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-5 sm:p-7 md:p-10 relative overflow-hidden group">
          {/* Subtle purple light effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-600 mb-3 sm:mb-4 shadow-xl shadow-purple-500/30 border border-purple-400/20"
              >
                <span className="text-2xl sm:text-3xl text-white">⚡</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Sign In
              </h1>

              <p className="text-sm sm:text-base text-purple-950/70 dark:text-purple-200/70 font-medium leading-relaxed px-1">
                Elevate your learning with AI intelligence.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 uppercase tracking-widest ml-1">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full text-sm sm:text-base"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center gap-3 ml-1">
                  <label className="text-xs sm:text-sm font-bold text-purple-950/70 dark:text-purple-300/70 uppercase tracking-widest">
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-[11px] sm:text-xs text-purple-700 dark:text-purple-400 hover:underline font-bold flex-shrink-0"
                  >
                    Forgot?
                  </a>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full text-sm sm:text-base"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 group cursor-pointer text-sm sm:text-base !py-3.5 sm:!py-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative py-3 sm:py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20 dark:border-purple-500/30"></div>
              </div>

              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-[#f5f3ff] dark:bg-[#000000] px-3 sm:px-4 text-purple-950/60 dark:text-purple-300/60 font-bold tracking-widest transition-colors duration-500 text-center">
                  Enterprise Auth
                </span>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-3 bg-white/90 dark:bg-purple-950/20 border border-purple-500/30 hover:bg-purple-600/10 dark:hover:bg-purple-950/40 text-slate-900 dark:text-white font-bold rounded-2xl transition-all shadow-sm cursor-pointer text-sm sm:text-base"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 flex-shrink-0"
              />

              <span className="text-center">Continue with Google</span>
            </button>

            <p className="text-center text-sm sm:text-base text-purple-950/70 dark:text-purple-300/70 font-medium leading-relaxed">
              New to the platform?{' '}
              <Link
                to="/signup"
                className="text-purple-700 dark:text-purple-400 hover:underline font-black transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 sm:mt-10 px-2 text-purple-950/60 dark:text-purple-300/60 text-xs sm:text-sm font-medium leading-relaxed"
        >
          Securely powered by QuizAI Intelligence System v4.2
        </motion.p>
      </motion.div>
    </div>
  );
};
  
export default LoginPage;
