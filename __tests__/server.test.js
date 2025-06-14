const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('Server Middleware', () => {
  describe('Rate Limiting', () => {
    test('allows requests within rate limit', async () => {
      const responses = await Promise.all(
        Array(5).fill().map(() => request(app).get('/api/health'))
      );
      
      responses.forEach(res => {
        expect(res.status).toBe(200);
      });
    });

    test('blocks requests exceeding rate limit', async () => {
      // Make 101 requests - should hit rate limit
      const responses = await Promise.all(
        Array(101).fill().map(() => request(app).get('/api/health'))
      );
      
      // Some responses should be rate limited
      const limitedResponses = responses.filter(res => res.status === 429);
      expect(limitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('API Key Validation', () => {
    test('allows premium access with valid API key', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('x-api-key', process.env.PREMIUM_API_KEY || 'test-key');
      
      expect(res.status).toBe(200);
    });

    test('sets premium flag with valid API key', async () => {
      // This would need a custom endpoint that returns the premium status
      const res = await request(app)
        .get('/api/status')
        .set('x-api-key', process.env.PREMIUM_API_KEY || 'test-key');
      
      expect(res.status).toBe(200);
      expect(res.body.isPremium).toBe(true);
    });
  });

  describe('CORS', () => {
    test('includes CORS headers', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://example.com');
      
      expect(res.headers['access-control-allow-origin']).toBeTruthy();
    });

    test('handles preflight requests', async () => {
      const res = await request(app)
        .options('/api/health')
        .set('Origin', 'http://example.com')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(res.headers['access-control-allow-methods']).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    test('handles 404 errors', async () => {
      const res = await request(app)
        .get('/api/nonexistent');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    test('handles server errors', async () => {
      // This would need a custom endpoint that triggers an error
      const res = await request(app)
        .get('/api/trigger-error');
      
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });

    test('handles JSON parsing errors', async () => {
      const res = await request(app)
        .post('/api/json/format')
        .set('Content-Type', 'application/json')
        .send('{"invalid json"');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Root Endpoint', () => {
    test('returns API information', async () => {
      const res = await request(app)
        .get('/');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Devando API Suite');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('toolsAvailable');
      expect(Array.isArray(res.body.toolsAvailable)).toBe(true);
    });
  });
});
