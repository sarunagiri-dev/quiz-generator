const request = require('supertest');

// Mock all external dependencies before importing app
jest.mock('openai');
jest.mock('../services/wikipediaService');
jest.mock('../config/database', () => ({
  connectDB: jest.fn()
}));

// Mock the QuizResult model
jest.mock('../models/QuizResult', () => ({
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([])
        })
      })
    })
  }),
  countDocuments: jest.fn().mockResolvedValue(0),
  aggregate: jest.fn().mockResolvedValue([{ totalQuizzes: 0, averageScore: 0, uniqueTopics: 0 }]),
  prototype: {
    save: jest.fn().mockResolvedValue({})
  }
}));

const app = require('../server');

describe('Essential API Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Quiz Generation', () => {
    it('should validate topic input', async () => {
      const response = await request(app)
        .post('/api/quiz')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Topic is required');
    });

    it('should reject empty topic', async () => {
      const response = await request(app)
        .post('/api/quiz')
        .send({ topic: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('Results API', () => {
    it('should handle results retrieval', async () => {
      const response = await request(app).get('/api/results');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
    });

    it('should validate result data', async () => {
      const response = await request(app)
        .post('/api/results')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('Statistics API', () => {
    it('should handle stats request', async () => {
      const response = await request(app).get('/api/results/stats');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalQuizzes');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});