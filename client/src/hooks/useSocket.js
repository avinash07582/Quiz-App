import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export function useSocket() {
  const ref = useRef(null);

  useEffect(() => {
    if (!socket) {
      socket = io('/', { transports: ['websocket'] });
    }
    ref.current = socket;
    return () => {};
  }, []);

  const joinQuiz = (shareId) => {
    socket?.emit('join:quiz', shareId);
  };

  const leaveQuiz = (shareId) => {
    socket?.emit('leave:quiz', shareId);
  };

  const onLeaderboardUpdate = (cb) => {
    socket?.on('leaderboard:update', cb);
    return () => socket?.off('leaderboard:update', cb);
  };

  return { socket: ref.current, joinQuiz, leaveQuiz, onLeaderboardUpdate };
}
