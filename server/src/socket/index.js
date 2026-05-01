const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join:group', (groupId) => {
      socket.join(`group:${groupId}`);
    });

    socket.on('leave:group', (groupId) => {
      socket.leave(`group:${groupId}`);
    });

    socket.on('join:dashboard', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
