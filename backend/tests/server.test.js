/**
 * Comprehensive Test Suite for Quiz Generator API
 * Tests all endpoints, services, and error handling scenarios
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const QuizResult = require('../models/QuizResult');
const { clearCache } = require('../services/wikipediaService');

// Mock OpenAI module
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

const OpenAI = require('openai');
const mockOpenAI = new OpenAI();

// Test database setup
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_TEST_URI || '***REMOVED***localhost:27017/quiz-generator-test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections and caches before each test
  await QuizResult.deleteMany({});
  clearCache();
  jest.clearAllMocks();
});

describe('Health Check API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version');
  });
});

describe('Quiz Generation API', () => {
  it('should generate a quiz successfully with Wikipedia context', async () => {
    const mockQuizData = [
      { 
        question: 'What is photosynthesis?', 
        options: ['Process A', 'Process B', 'Process C', 'Process D'], 
        correctOptionIndex: 0,
        explanation: 'Photosynthesis is the process by which plants convert light energy into chemical energy.'
      }
    ];
    
    // Mock Wikipedia API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        extract: 'Photosynthesis is a process used by plants to convert light energy into chemical energy.' 
      })
    });
    
    // Mock OpenAI API response
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockQuizData) } }],
    });

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'photosynthesis' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuizData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('wikipedia.org'));
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it('should return mock quiz when OpenAI fails', async () => {
    // Mock Wikipedia success
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ extract: 'Math context' })
    });
    
    // Mock OpenAI failure
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API Error'));

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'math' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toHaveProperty('explanation');
    expect(response.body[0].question).toContain('2 + 2');
  });

  it('should validate topic input', async () => {
    const testCases = [
      { input: {}, expectedError: 'Topic is required' },
      { input: { topic: '' }, expectedError: 'Topic is required' },
      { input: { topic: '   ' }, expectedError: 'Topic is required' },
      { input: { topic: 123 }, expectedError: 'Topic is required' }
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/quiz')
        .send(testCase.input);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain(testCase.expectedError);
    }
  });

  it('should handle Wikipedia API failure gracefully', async () => {
    // Mock Wikipedia failure
    fetch.mockRejectedValue(new Error('Wikipedia API Error'));
    
    // Mock OpenAI success with fallback
    const mockQuizData = [
      { question: 'Test question', options: ['A', 'B', 'C', 'D'], correctOptionIndex: 0, explanation: 'Test explanation' }
    ];
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockQuizData) } }],
    });

    const response = await request(app)
      .post('/api/quiz')
      .send({ topic: 'science' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuizData);
  });
});

describe('Quiz Results API', () => {
  describe('GET /api/results', () => {
    it('should return empty results when no data exists', async () => {
      const response = await request(app).get('/api/results');
      
      expect(response.status).toBe(200);
      expect(response.body.results).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return paginated results', async () => {
      // Create test data
      const testResults = [
        { topic: 'math', score: 4, totalQuestions: 5 },
        { topic: 'science', score: 3, totalQuestions: 5 },
        { topic: 'history', score: 5, totalQuestions: 5 }
      ];

      for (const result of testResults) {
        await QuizResult.create(result);
      }

      const response = await request(app)
        .get('/api/results?limit=2&offset=0');
      
      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.hasMore).toBe(true);
    });

    it('should filter results by topic', async () => {
      await QuizResult.create({ topic: 'mathematics', score: 4, totalQuestions: 5 });
      await QuizResult.create({ topic: 'science', score: 3, totalQuestions: 5 });

      const response = await request(app)
        .get('/api/results?topic=math');
      
      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(1);
      expect(response.body.results[0].topic).toBe('mathematics');
    });

    it('should sort results correctly', async () => {
      const result1 = await QuizResult.create({ topic: 'math', score: 4, totalQuestions: 5 });
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const result2 = await QuizResult.create({ topic: 'science', score: 3, totalQuestions: 5 });

      const response = await request(app)
        .get('/api/results?sortBy=timestamp&sortOrder=desc');
      
      expect(response.status).toBe(200);
      expect(response.body.results[0].topic).toBe('science'); // Most recent first
    });
  });

  describe('POST /api/results', () => {
    it('should save quiz result successfully', async () => {
      const resultData = { topic: 'science', score: 3, totalQuestions: 5 };
      
      const response = await request(app)
        .post('/api/results')
        .send(resultData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toMatchObject(resultData);
      expect(response.body.result.percentage).toBe(60);
      expect(response.body.result).toHaveProperty('id');
      expect(response.body.result).toHaveProperty('timestamp');
    });

    it('should validate input data', async () => {
      const testCases = [
        { 
          input: { score: 3, totalQuestions: 5 }, 
          expectedError: 'Topic is required' 
        },
        { 
          input: { topic: 'math', totalQuestions: 5 }, 
          expectedError: 'Score must be a non-negative number' 
        },
        { 
          input: { topic: 'math', score: -1, totalQuestions: 5 }, 
          expectedError: 'Score must be a non-negative number' 
        },
        { 
          input: { topic: 'math', score: 3 }, 
          expectedError: 'Total questions must be between 1 and 50' 
        },
        { 
          input: { topic: 'math', score: 6, totalQuestions: 5 }, 
          expectedError: 'Score cannot be greater than total questions' 
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/results')
          .send(testCase.input);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain(testCase.expectedError);
      }
    });

    it('should handle database errors gracefully', async () => {
      // Close database connection to simulate error
      await mongoose.connection.close();

      const response = await request(app)
        .post('/api/results')
        .send({ topic: 'math', score: 4, totalQuestions: 5 });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to save quiz result');

      // Reconnect for other tests
      await mongoose.connect(process.env.MONGODB_TEST_URI || '***REMOVED***localhost:27017/quiz-generator-test');
    });
  });

  describe('GET /api/results/stats', () => {
    it('should return statistics', async () => {
      // Create test data
      await QuizResult.create({ topic: 'math', score: 4, totalQuestions: 5 });
      await QuizResult.create({ topic: 'science', score: 3, totalQuestions: 5 });
      await QuizResult.create({ topic: 'math', score: 5, totalQuestions: 5 });

      const response = await request(app).get('/api/results/stats');
      
      expect(response.status).toBe(200);
      expect(response.body.totalQuizzes).toBe(3);
      expect(response.body.averageScore).toBeCloseTo(80, 1); // (4+3+5)/(5+5+5) * 100
      expect(response.body.uniqueTopics).toBe(2);
    });

    it('should return zero stats when no data exists', async () => {
      const response = await request(app).get('/api/results/stats');
      
      expect(response.status).toBe(200);
      expect(response.body.totalQuizzes).toBe(0);
      expect(response.body.averageScore).toBe(0);
      expect(response.body.uniqueTopics).toBe(0);
    });
  });
});

describe('Error Handling', () => {
  it('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-endpoint');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Route not found');
    expect(response.body.path).toBe('/api/unknown-endpoint');
  });

  it('should handle malformed JSON', async () => {
    const response = await request(app)
      .post('/api/quiz')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');

    expect(response.status).toBe(400);
  });
});

describe('Wikipedia Service Caching', () => {
  it('should cache Wikipedia responses', async () => {
    const mockExtract = 'Test Wikipedia content';
    
    // First call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ extract: mockExtract })
    });

    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '[]' } }],
    });

    await request(app)
      .post('/api/quiz')
      .send({ topic: 'test-topic' });

    // Second call - should use cache
    await request(app)
      .post('/api/quiz')
      .send({ topic: 'test-topic' });

    // Wikipedia API should only be called once due to caching
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});