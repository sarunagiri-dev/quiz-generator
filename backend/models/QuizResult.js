const mongoose = require('mongoose');

/**
 * Quiz Result Schema
 * Stores quiz completion data with topic, score, and timestamp
 */
const QuizResultSchema = new mongoose.Schema({
  topic: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  score: { 
    type: Number, 
    required: true,
    min: 0
  },
  totalQuestions: { 
    type: Number, 
    required: true,
    min: 1,
    max: 50
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

// Add indexes for efficient querying
QuizResultSchema.index({ timestamp: -1 });
QuizResultSchema.index({ topic: 1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema);