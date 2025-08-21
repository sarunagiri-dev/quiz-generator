/**
 * Quiz Controller
 * Handles quiz-related HTTP requests and responses
 */

const OpenAI = require('openai');
const { getWikipediaContext } = require('../services/wikipediaService');
const { generateMockQuiz } = require('../services/quizService');

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️  OpenAI API key not configured. Quiz generation will use fallback.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a quiz based on the provided topic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    // Input validation and sanitization
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required and must be a non-empty string' 
      });
    }

    const trimmedTopic = topic.trim().substring(0, 50); // Limit to 50 chars for security

    // Get Wikipedia context for factual accuracy
    const context = await getWikipediaContext(trimmedTopic);
    
    // Construct AI prompt with context
    const prompt = `Using this context about ${trimmedTopic}: "${context}"
    
Generate a 5-question multiple-choice quiz. Return only a JSON array with this exact structure:
[{"question":"text","options":["A","B","C","D"],"correctOptionIndex":0,"explanation":"why this answer is correct"}]

Requirements:
- Questions should be factual and educational
- Each question must have exactly 4 options
- correctOptionIndex must be 0, 1, 2, or 3
- Include detailed explanations for learning
- Return only valid JSON, no additional text`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    const jsonResponse = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const quiz = JSON.parse(jsonResponse);
    
    // Validate quiz structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Invalid quiz format received from AI');
    }

    res.json(quiz);

  } catch (error) {
    console.error('Error generating quiz:', error.message);
    
    // Fallback to mock quiz
    try {
      const mockQuiz = generateMockQuiz(req.body.topic || 'general');
      res.json(mockQuiz);
    } catch (fallbackError) {
      console.error('Fallback quiz generation failed:', fallbackError.message);
      res.status(500).json({ 
        error: 'Failed to generate quiz. Please try again.' 
      });
    }
  }
};

/**
 * Health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = (req, res) => {
  res.json({ 
    message: "Quiz API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
};

module.exports = {
  generateQuiz,
  healthCheck
};