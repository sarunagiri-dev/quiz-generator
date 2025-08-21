const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `
      Generate a 5-question multiple-choice quiz on the topic of "${topic}".
      Provide the output in a clean JSON format. Do not include any text outside of the JSON.
      The JSON should be an array of objects, where each object has the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctOptionIndex": 0
      }
      "correctOptionIndex" should be the 0-based index of the correct answer in the "options" array.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    // Sometimes the model might return the JSON wrapped in markdown backticks.
    const jsonResponse = content.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const quiz = JSON.parse(jsonResponse);
      res.json(quiz);
    } catch (e) {
      console.error('Failed to parse JSON from OpenAI response:', e);
      console.error('Raw response:', content);
      res.status(500).json({ error: 'Failed to parse quiz data from AI. The format was invalid.' });
    }

  } catch (error) {
    console.error('Error generating quiz:', error.message);
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key.' });
    }
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;