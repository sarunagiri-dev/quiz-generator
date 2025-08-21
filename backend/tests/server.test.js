const request = require('supertest');

// Mock all external dependencies before importing app
jest.mock('openai');
jest.mock('../services/wikipediaService');
jest.mock('../config/database', () => ({
  connectDB: jest.fn()
}));

const app = require('../server');

describe('Essential API Tests', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should validate topic input', async () => {
    const response = await request(app)
      .post('/api/quiz')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Topic is required');
  });

  it('should handle 404 routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});