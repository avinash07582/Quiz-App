import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quiz, setQuiz] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState(null);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, playerName, setPlayerName, results, setResults }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
