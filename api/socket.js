import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

// Configure allowed origins for Socket.IO
const getAllowedOrigins = () => {
  const origins = ["http://localhost:5173"]; // Local development
  
  // Add production URLs
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  // Add Vercel URL if available
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  // Add wildcard patterns for production
  if (process.env.NODE_ENV === 'production') {
    origins.push(/https:\/\/.*\.vercel\.app$/);
    origins.push(/https:\/\/.*\.onrender\.com$/);
  }
  
  return origins;
};

// Store online users
const userSocketMap = {}; // {userId: socketId}

// Socket.IO handler for Vercel
export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.IO server...");
    
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: getAllowedOrigins(),
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true
    });

    // Socket event handlers
    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) userSocketMap[userId] = socket.id;

      // Send online users to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

// Export utility functions
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getIO() {
  return res?.socket?.server?.io;
}
