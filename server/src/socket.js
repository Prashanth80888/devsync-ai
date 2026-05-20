import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    // Rooms align teammates to specific project canvas screens to isolate network traffic
    socket.on('join:project', (projectId) => {
      socket.join(projectId);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(projectId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io engine has not been initialized yet.');
  return io;
};