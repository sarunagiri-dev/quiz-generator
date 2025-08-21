/**
 * Main Routes Configuration
 * Centralizes all API route definitions
 */

const express = require('express');
const { generateQuiz, healthCheck } = require('../controllers/quizController');
const { getResults, saveResult, getStats } = require('../controllers/resultsController');

const router = express.Router();

// Health check endpoint
router.get('/api', healthCheck);

// Quiz routes
router.post('/api/quiz', generateQuiz);

// Results routes
router.get('/api/results', getResults);
router.post('/api/results', saveResult);
router.get('/api/results/stats', getStats);

module.exports = router;