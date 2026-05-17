import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

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

// Parse JSON Request Body
app.use(express.json());

// Parse URL Encoded Data
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