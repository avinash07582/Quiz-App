let io;

function init(socketIo) {
  io = socketIo;

  io.on('connection', (socket) => {
    // Client joins a quiz leaderboard room
    socket.on('join:quiz', (shareId) => {
      socket.join(`quiz:${shareId}`);
    });

    socket.on('leave:quiz', (shareId) => {
      socket.leave(`quiz:${shareId}`);
    });

    socket.on('disconnect', () => {});
  });
}

/**
 * Broadcast updated leaderboard to all clients in quiz room
 */
function emitLeaderboardUpdate(shareId, leaderboard) {
  if (!io) return;
  io.to(`quiz:${shareId}`).emit('leaderboard:update', leaderboard);
}

module.exports = { init, emitLeaderboardUpdate };
