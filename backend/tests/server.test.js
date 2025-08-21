const request = require('supertest');
const mongoose = require('mongoose');
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

// Mock fetch for Wikipedia API
global.fetch = jest.fn();

const mockOpenAI = new OpenAI();

// Test database setup
beforeAll(async () => {
  const mongoUri = '***REMOVED***localhost:27017/quiz-generator-test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
});

describe('POST /api/quiz', () => {
  it('should generate a quiz successfully with Wikipedia context', async () => {
    const mockQuizData = [
      { 
        question: 'What is 2+2?', 
        options: ['3', '4', '5', '6'], 
        correctOptionIndex: 1,
        explanation: '2+2 equals 4 in basic arithmetic.'
      }
    ];
    
    // Mock Wikipedia API
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ extract: 'Math is the study of numbers.' })
    });
    
    // Mock OpenAI API
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockQuizData) } }],
    });

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'math' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuizData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('wikipedia.org'));
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it('should return mock quiz when OpenAI fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ extract: 'Math context' })
    });
    
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API Error'));

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'math' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toHaveProperty('explanation');
  });

  it('should return 400 if topic is missing', async () => {
    const response = await request(app)
      .post('/api/quiz')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Topic is required' });
  });
});

describe('GET /api/results', () => {
  it('should return empty array when no results exist', async () => {
    const response = await request(app).get('/api/results');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return quiz results', async () => {
    // First save a result
    await request(app)
      .post('/api/results')
      .send({ topic: 'math', score: 4, totalQuestions: 5 });

    const response = await request(app).get('/api/results');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      topic: 'math',
      score: 4,
      totalQuestions: 5
    });
    expect(response.body[0]).toHaveProperty('timestamp');
  });
});

describe('POST /api/results', () => {
  it('should save quiz result successfully', async () => {
    const resultData = { topic: 'science', score: 3, totalQuestions: 5 };
    
    const response = await request(app)
      .post('/api/results')
      .send(resultData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toMatchObject(resultData);
  });

  it('should handle save errors gracefully', async () => {
    // Send invalid data to trigger error
    const response = await request(app)
      .post('/api/results')
      .send({ invalidField: 'test' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('GET /api', () => {
  it('should return hello message', async () => {
    const response = await request(app).get('/api');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello from backend!" });
  });
});