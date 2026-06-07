import { useEffect, useRef, useState } from 'react';

export function useTimer(totalSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);
  const startedRef = useRef(false);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire && onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  const elapsed = totalSeconds - timeLeft;

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const display = `${mm}:${ss}`;
  const pct = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  return { timeLeft, display, pct, elapsed, start, stop };
}
