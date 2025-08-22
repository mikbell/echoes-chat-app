import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "../backend/src/lib/db.js";

import authRoutes from "../backend/src/routes/auth.route.js";
import messageRoutes from "../backend/src/routes/message.route.js";

dotenv.config();

const app = express();

// Initialize database connection once
if (!global.dbConnected) {
  connectDB();
  global.dbConnected = true;
}

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS configuration for Vercel
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

// Routes
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Echoes API is running on Vercel!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Handle all API requests
app.all('*', (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export the Express API for Vercel
export default app;
