// Import required packages
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config(); // Loads environment variables from a .env file

// Create an Express application
const app = express();
const port = process.env.PORT || 5000; // Use port from environment variables or default to 5000

// === Middleware ===
// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with this backend
app.use(cors());
// Parse incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

// === OpenAI Client Setup ===
// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === Routes ===

// A simple test route to check if the backend is running
app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

/**
 * The main endpoint for generating a quiz.
 * It expects a POST request with a 'topic' in the request body.
 */
app.post('/api/quiz', async (req, res) => {
  try {
    // Extract the topic from the request body
    const { topic } = req.body;

    // Validate that a topic was provided
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Construct the prompt to send to the OpenAI API.
    // This prompt asks the AI to generate a 5-question quiz in a specific JSON format.
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

    // Make the API call to OpenAI's chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // The model to use
      messages: [{ role: 'user', content: prompt }], // The prompt message
      temperature: 0.7, // A measure of randomness. 0.7 is a good balance of creative and deterministic.
    });

    // Extract the AI's response content
    const content = completion.choices[0].message.content;

    // The AI sometimes wraps its JSON response in markdown backticks (e.g., ```json ... ```).
    // This line removes them to ensure we have a clean JSON string.
    const jsonResponse = content.replace(/```json/g, '').replace(/```/g, '').trim();

    // Try to parse the cleaned response as JSON
    try {
      const quiz = JSON.parse(jsonResponse);
      // If successful, send the quiz data back to the client
      res.json(quiz);
    } catch (e) {
      // If JSON parsing fails, log the error and the raw response for debugging
      console.error('Failed to parse JSON from OpenAI response:', e);
      console.error('Raw response:', content);
      res.status(500).json({ error: 'Failed to parse quiz data from AI. The format was invalid.' });
    }

  } catch (error) {
    // Catch any errors from the OpenAI API call or other parts of the try block
    console.error('Error generating quiz:', error.message);
    // Specifically handle the case of an invalid API key for a clearer error message
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key.' });
    }
    // For all other errors, send a generic 500 server error
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
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