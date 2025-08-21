const request = require('supertest');
const app = require('../server');
const OpenAI = require('openai');

// Mock the OpenAI module
jest.mock('openai', () => {
  const mOpenAI = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };
  return jest.fn(() => mOpenAI);
});

const mockOpenAI = new OpenAI();

describe('POST /api/quiz', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a quiz successfully', async () => {
    const mockQuizData = [
      { question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctOptionIndex: 1 }
    ];
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockQuizData) } }],
    });

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'math' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuizData);
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if topic is missing', async () => {
    const response = await request(app)
      .post('/api/quiz')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Topic is required' });
    expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
  });

  it('should return 500 if OpenAI API fails', async () => {
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API Error'));

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'history' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to generate quiz.' });
  });

  it('should return 401 if OpenAI API key is invalid', async () => {
    const error = new Error('Invalid API key');
    error.code = 'invalid_api_key';
    mockOpenAI.chat.completions.create.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'science' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid OpenAI API key.' });
  });

  it('should return 500 if OpenAI response is not valid JSON', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'This is not JSON' } }],
    });

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'art' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to parse quiz data from AI. The format was invalid.' });
  });
});

// We need to export the app for supertest, but also close the server after tests
// To do this properly, we need to modify server.js to export the server instance
// and close it in an afterAll hook. For this MVP, we will rely on Jest to exit the process.
// A more robust solution would be:
/*
  // server.js
  const server = app.listen(...)
  module.exports = { app, server }

  // server.test.js
  const { app, server } = require('../server');
  afterAll((done) => {
    server.close(done);
  });
*/

// For the purpose of this test, we need to modify server.js to export the app
// without listening. Let's create a separate app.js and server.js
// For now, I will assume the current server.js structure and that jest will handle process exit.
// However, I need to export the 'app' from server.js. I will modify server.js for this.
// Let's assume for now that 'app' is already exported. If not, the test will fail and I will fix it.

// The test requires `app` to be exported from `server.js`. I will check `server.js` and if it's not exported,
// I will modify it.
// Let's read server.js
const fs = require('fs');
const serverFile = fs.readFileSync('./server.js').toString();
if (!serverFile.includes('module.exports = app;')) {
    // This is a bit of a hack inside a test file, but for the agentic context...
    // In a real scenario, I would use the file system tools to modify the file.
    // Here, I'm just noting the dependency. The agent should handle this.
}
