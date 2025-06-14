const request = require('supertest');
const express = require('express');
const healthRouter = require('../routes/health');

const app = express();
app.use('/api/health', healthRouter);

describe('Health Check API', () => {
  test('returns success status', async () => {
    const res = await request(app)
      .get('/api/health')
      .send();
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  test('includes memory usage', async () => {
    const res = await request(app)
      .get('/api/health')
      .send();
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('memory');
    expect(res.body.memory).toHaveProperty('heapUsed');
    expect(res.body.memory).toHaveProperty('heapTotal');
    expect(res.body.memory).toHaveProperty('external');
    expect(res.body.memory).toHaveProperty('rss');
  });

  test('includes response time', async () => {
    const res = await request(app)
      .get('/api/health')
      .send();
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('responseTime');
    expect(typeof res.body.responseTime).toBe('number');
  });
});
