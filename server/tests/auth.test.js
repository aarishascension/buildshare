import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock app for testing
const API_URL = 'http://localhost:5000';

describe('Authentication API', () => {
  let authToken;
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    userType: 'developer',
    title: 'Full-Stack Developer',
    location: 'San Francisco, CA'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      authToken = response.body.token;
    });

    it('should not register duplicate email', async () => {
      await request(API_URL)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);
    });

    it('should validate required fields', async () => {
      await request(API_URL)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject invalid credentials', async () => {
      await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
    });

    it('should reject without token', async () => {
      await request(API_URL)
        .get('/api/auth/me')
        .expect(401);
    });
  });
});
