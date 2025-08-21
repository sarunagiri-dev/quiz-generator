/**
 * Quiz Generator Backend Server
 * Main application entry point with modular architecture
 * 
 * @license MIT
 * @copyright 2024 Quiz Generator
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Simple in-memory rate limiting (10 requests per 10 minutes per IP)
const requests = new Map();
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const window = 10 * 60 * 1000;
  
  if (!requests.has(ip)) requests.set(ip, []);
  const userRequests = requests.get(ip).filter(time => now - time < window);
  
  if (userRequests.length >= 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  userRequests.push(now);
  requests.set(ip, userRequests);
  next();
};

const { connectDB } = require('./config/database');
const routes = require('./routes');

// Create Express application
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '1mb' })); // Reduced limit
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit); // Basic rate limiting

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API root endpoint (REST compliant)
app.get('/', (req, res) => {
  res.json({
    name: 'QuizAI API',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api'
  });
});

// Routes
app.use('/', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📚 Quiz Generator API ready`);
  });
}

module.exports = app;