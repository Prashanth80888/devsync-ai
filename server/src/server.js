import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import orgRoutes from './routes/orgRoutes.js';
import projectRoutes from './routes/projectRoutes.js'; // Injected module
import teamRoutes from './routes/teamRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

// Import Global Error Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// ========================================
// ENVIRONMENT VARIABLES
// ========================================

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// ========================================
// GLOBAL MIDDLEWARE
// ========================================

// Enable CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Parse Incoming JSON Requests
app.use(express.json());

// Parse URL Encoded Requests
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevSync AI API is running successfully",
  });
});

// ========================================
// API ROUTES
// ========================================

// Authentication Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orgs", orgRoutes);
app.use('/api/v1/projects', projectRoutes); // Active Project endpoint routing
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/activity', activityRoutes);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "devsync-ai-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ========================================
// 404 FALLBACK ROUTE
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`
========================================
🚀 DevSync AI Server Started
========================================
🌐 Environment : ${process.env.NODE_ENV}
📡 Port        : ${PORT}
🔗 API URL     : http://localhost:${PORT}
========================================
  `);
});