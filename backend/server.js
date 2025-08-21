// Import required packages
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Loads environment variables from a .env file

// Create an Express application
const app = express();
const port = process.env.PORT || 3001; // Use port from environment variables or default to 3001

// === Middleware ===
// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with this backend
app.use(cors());
// Parse incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

// === OpenAI Client Setup ===
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === Storage Setup ===
const QUIZ_RESULTS_FILE = path.join(__dirname, 'quiz_results.json');

// Wikipedia retrieval function
const getWikipediaContext = async (topic) => {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (response.ok) {
      const data = await response.json();
      return data.extract || '';
    }
  } catch (error) {
    console.log('Wikipedia fetch failed:', error.message);
  }
  return '';
};

// Save quiz results
const saveQuizResult = (topic, score, totalQuestions, timestamp) => {
  try {
    let results = [];
    if (fs.existsSync(QUIZ_RESULTS_FILE)) {
      results = JSON.parse(fs.readFileSync(QUIZ_RESULTS_FILE, 'utf8'));
    }
    results.push({ topic, score, totalQuestions, timestamp });
    fs.writeFileSync(QUIZ_RESULTS_FILE, JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Failed to save quiz result:', error.message);
  }
};

// === Routes ===

// A simple test route to check if the backend is running
app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

/**
 * The main endpoint for generating a quiz.
 * It expects a POST request with a 'topic' in the request body.
 */
// Enhanced mock quiz with explanations
const generateMockQuiz = (topic) => {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('math') || topicLower.includes('algebra')) {
    return [
      { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctOptionIndex: 1, explanation: "2 + 2 = 4. This is basic addition." },
      { question: "What is the square root of 16?", options: ["2", "3", "4", "5"], correctOptionIndex: 2 },
      { question: "What is 5 × 3?", options: ["12", "15", "18", "20"], correctOptionIndex: 1 },
      { question: "What is 10 ÷ 2?", options: ["3", "4", "5", "6"], correctOptionIndex: 2 },
      { question: "What is 7 - 3?", options: ["3", "4", "5", "6"], correctOptionIndex: 1 }
    ];
  }
  
  if (topicLower.includes('science') || topicLower.includes('physics')) {
    return [
      { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correctOptionIndex: 0, explanation: "The speed of light in vacuum is approximately 299,792,458 meters per second, or about 300,000 km/s." },
      { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "N2"], correctOptionIndex: 0 },
      { question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correctOptionIndex: 1 },
      { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctOptionIndex: 2 },
      { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], correctOptionIndex: 2 }
    ];
  }
  
  // Default generic quiz
  return [
    { question: `What is a key concept in ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correctOptionIndex: 0, explanation: `This is a fundamental concept in ${topic}.` },
    { question: `Which statement about ${topic} is true?`, options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"], correctOptionIndex: 1 },
    { question: `How does ${topic} relate to other subjects?`, options: ["Relation A", "Relation B", "Relation C", "Relation D"], correctOptionIndex: 2 },
    { question: `What is an important application of ${topic}?`, options: ["Application A", "Application B", "Application C", "Application D"], correctOptionIndex: 3 },
    { question: `Which best describes ${topic}?`, options: ["Description A", "Description B", "Description C", "Description D"], correctOptionIndex: 0 }
  ];
};

app.post('/api/quiz', async (req, res) => {
  // Extract the topic from the request body
  const { topic } = req.body;

  // Validate that a topic was provided
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    // Get Wikipedia context for factual accuracy
    const context = await getWikipediaContext(topic);
    
    const prompt = `Using this context about ${topic}: "${context}"
    
Generate a 5-question multiple-choice quiz. Return only JSON array with this structure:
[{"question":"text","options":["A","B","C","D"],"correctOptionIndex":0,"explanation":"why this answer is correct"}]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const jsonResponse = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const quiz = JSON.parse(jsonResponse);
    res.json(quiz);

  } catch (error) {
    console.error('Error generating quiz:', error.message);
    console.error('Using mock quiz as fallback');
    
    const mockQuiz = generateMockQuiz(topic);
    return res.json(mockQuiz);
  }
});

// Get quiz results endpoint
app.get('/api/results', (req, res) => {
  try {
    if (fs.existsSync(QUIZ_RESULTS_FILE)) {
      const results = JSON.parse(fs.readFileSync(QUIZ_RESULTS_FILE, 'utf8'));
      res.json(results);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load results' });
  }
});

// Save quiz result endpoint
app.post('/api/results', (req, res) => {
  const { topic, score, totalQuestions } = req.body;
  const timestamp = new Date().toISOString();
  saveQuizResult(topic, score, totalQuestions, timestamp);
  res.json({ success: true });
});

// === Server Initialization ===
// Only start the server if the script is run directly (not when imported for tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
  });
}

// Export the Express app instance for use in other files (like our test suite)
module.exports = app;