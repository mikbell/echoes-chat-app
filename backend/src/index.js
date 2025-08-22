import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./utils/logger.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Apply rate limiting to all requests
app.use(apiLimiter);

app.use(express.json({ limit: '10mb' })); // Set JSON payload limit
app.use(cookieParser());
// CORS origins configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://192.168.1.95:8081", // Mobile development
];

// Add production frontend URL if available
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Add Vercel.app patterns for dynamic URLs
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/https:\/\/.*\.vercel\.app$/);
  allowedOrigins.push(/https:\/\/.*\.onrender\.com$/);
  // Add Vercel URL if available
  if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  }
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.request(req.method, req.path);
    next();
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  logger.info(`Server is running on PORT: ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB();
});

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at Promise', { reason, promise });
  process.exit(1);
});
