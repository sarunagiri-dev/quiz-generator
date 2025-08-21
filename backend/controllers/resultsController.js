/**
 * Results Controller
 * Handles quiz results storage and retrieval
 */

const QuizResult = require('../models/QuizResult');

/**
 * Retrieves quiz results with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getResults = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      topic,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Build query filter
    const filter = {};
    if (topic) {
      filter.topic = { $regex: topic, $options: 'i' }; // Case-insensitive search
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const results = await QuizResult
      .find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await QuizResult.countDocuments(filter);

    res.json({
      results,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    console.error('Failed to load results:', error);
    res.status(500).json({ 
      error: 'Failed to load quiz results',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Saves a new quiz result
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveResult = async (req, res) => {
  try {
    const { topic, score, totalQuestions } = req.body;

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required and must be a non-empty string' 
      });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ 
        error: 'Score must be a non-negative number' 
      });
    }

    if (typeof totalQuestions !== 'number' || totalQuestions < 1 || totalQuestions > 50) {
      return res.status(400).json({ 
        error: 'Total questions must be between 1 and 50' 
      });
    }

    if (score > totalQuestions) {
      return res.status(400).json({ 
        error: 'Score cannot be greater than total questions' 
      });
    }

    // Create and save result
    const result = new QuizResult({ 
      topic: topic.trim(), 
      score, 
      totalQuestions 
    });
    
    await result.save();

    res.status(201).json({ 
      success: true, 
      result: {
        id: result._id,
        topic: result.topic,
        score: result.score,
        totalQuestions: result.totalQuestions,
        timestamp: result.timestamp,
        percentage: Math.round((result.score / result.totalQuestions) * 100)
      }
    });

  } catch (error) {
    console.error('Failed to save result:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Invalid data provided',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      error: 'Failed to save quiz result',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Gets quiz statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStats = async (req, res) => {
  try {
    const stats = await QuizResult.aggregate([
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
          topicCount: { $addToSet: '$topic' }
        }
      },
      {
        $project: {
          _id: 0,
          totalQuizzes: 1,
          averageScore: { $multiply: ['$averageScore', 100] }, // Convert to percentage
          uniqueTopics: { $size: '$topicCount' }
        }
      }
    ]);

    res.json(stats[0] || { totalQuizzes: 0, averageScore: 0, uniqueTopics: 0 });

  } catch (error) {
    console.error('Failed to get stats:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve statistics' 
    });
  }
};

module.exports = {
  getResults,
  saveResult,
  getStats
};