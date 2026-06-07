import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizProvider } from './context/QuizContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCallback from './pages/AuthCallback';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import StudyNotesPage from './pages/StudyNotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import './index.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 sm:p-2.5 rounded-xl glass-button-secondary flex items-center justify-center text-purple-700 dark:text-purple-300 shadow-md cursor-pointer flex-shrink-0"
      title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </motion.button>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 py-3 sm:py-4 w-full"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-2.5 sm:py-3 glass-card !rounded-2xl border-purple-600/30 dark:border-purple-500/40 w-full shadow-lg">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-black bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-600 dark:from-purple-400 dark:via-fuchsia-300 dark:to-purple-500 bg-clip-text text-transparent flex-shrink-0">
          <span className="text-xl sm:text-2xl brightness-125">⚡</span>
          QuizAI
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/explore" className="text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400 transition tracking-wide">Explore</Link>
          <Link to="/interview" className="text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400 transition tracking-wide">Interview Prep</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400 transition tracking-wide">Dashboard</Link>
              <div className="h-4 w-px bg-purple-500/30 dark:bg-purple-500/40 hidden sm:block" />
              <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-purple-950 dark:text-purple-200 text-xs font-black uppercase tracking-widest hidden md:block">{user.displayName}</span>
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-purple-500/40 shadow-md flex-shrink-0" />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-950 flex items-center justify-center text-[10px] sm:text-xs font-black text-white shadow-md border border-purple-500/40 flex-shrink-0">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button onClick={logout} className="p-1.5 sm:p-2 text-red-500/80 hover:text-red-500 transition hover:bg-red-500/10 rounded-lg cursor-pointer flex-shrink-0" title="Log Out">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Link to="/login" className="text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400 transition">Sign In</Link>
              <Link to="/signup" className="btn-premium !px-3.5 sm:!px-5 !py-2 sm:!py-2.5 !text-xs sm:!text-sm !rounded-xl whitespace-nowrap">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/quiz/:shareId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/results/:shareId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/leaderboard/:shareId" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/notes/:shareId" element={<ProtectedRoute><StudyNotesPage /></ProtectedRoute>} />
        <Route path="/flashcards/:shareId" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>} />
        <Route path="/interview/:shareId" element={<ProtectedRoute><InterviewSessionPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <BrowserRouter>
            <div className="min-h-screen selection:bg-purple-500/30 bg-white dark:bg-[#000000] transition-colors duration-500 overflow-x-hidden">
              <Navbar />
              <main className="pt-24 min-h-screen">
                <AnimatedRoutes />
              </main>
            </div>
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(20, 10, 40, 0.95)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '16px',
                fontWeight: '600',
                fontSize: '14px',
              },
            }}
          />
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
