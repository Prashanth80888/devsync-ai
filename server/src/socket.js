import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {

    console.log(`⚡ Socket Connected: ${socket.id}`);

    // ==================================================
    // PROJECT TASK ROOM EVENTS
    // ==================================================

    // Rooms align teammates to specific project canvas screens
    socket.on('join:project', (projectId) => {

      if (!projectId) return;

      socket.join(projectId);

      console.log(
        `[Socket] User joined project room: ${projectId}`
      );
    });

    socket.on('leave:project', (projectId) => {

      if (!projectId) return;

      socket.leave(projectId);

      console.log(
        `[Socket] User left project room: ${projectId}`
      );
    });

    // ==================================================
    // CODE PLAYGROUND REAL-TIME EVENTS
    // ==================================================

    /**
     * JOIN SANDBOX ROOM
     */
    socket.on('sandbox:join', ({ sandboxId }) => {

      if (!sandboxId) return;

      socket.join(`sandbox_${sandboxId}`);

      console.log(
        `[WebSocket] Session ${socket.id} joined sandbox room: ${sandboxId}`
      );
    });

    /**
     * LIVE CODE BROADCAST
     */
    socket.on('sandbox:edit_code', ({ sandboxId, code }) => {

      if (!sandboxId) return;

      // Send updates to everyone except sender
      socket
        .to(`sandbox_${sandboxId}`)
        .emit('sandbox:code_updated', {
          sandboxId,
          code
        });
    });

    /**
     * LEAVE SANDBOX ROOM
     */
    socket.on('sandbox:leave', ({ sandboxId }) => {

      if (!sandboxId) return;

      socket.leave(`sandbox_${sandboxId}`);

      console.log(
        `[WebSocket] Session ${socket.id} left sandbox room: ${sandboxId}`
      );
    });

    // ==================================================
    // DISCONNECT EVENT
    // ==================================================

    socket.on('disconnect', () => {

      console.log(
        `❌ Socket Disconnected: ${socket.id}`
      );
    });

  });

  return io;
};

export const getIO = () => {

  if (!io) {

    throw new Error(
      'Socket.io engine has not been initialized yet.'
    );
  }

  return io;
};