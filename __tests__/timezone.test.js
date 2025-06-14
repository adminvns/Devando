const request = require('supertest');
const express = require('express');
const timezoneRouter = require('../routes/timezone');

const app = express();
app.use('/api/timezone', timezoneRouter);

describe('Timezone Converter API', () => {
  test('converts between UTC and specific timezone', async () => {
    const params = {
      from: 'UTC',
      to: 'America/New_York',
      datetime: '2025-06-14T12:00:00'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('original');
    expect(res.body).toHaveProperty('converted');
    expect(res.body.original.timezone).toBe('UTC');
    expect(res.body.converted.timezone).toBe('America/New_York');
  });

  test('converts between specific timezones', async () => {
    const params = {
      from: 'Asia/Tokyo',
      to: 'Europe/London',
      datetime: '2025-06-14T15:00:00'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(200);
    expect(res.body.original.timezone).toBe('Asia/Tokyo');
    expect(res.body.converted.timezone).toBe('Europe/London');
  });

  test('handles daylight saving time', async () => {
    const params = {
      from: 'America/New_York',
      to: 'America/Los_Angeles',
      datetime: '2025-01-01T12:00:00' // Winter
    };

    const winterRes = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    const summerParams = { ...params, datetime: '2025-07-01T12:00:00' }; // Summer
    const summerRes = await request(app)
      .get('/api/timezone/convert')
      .query(summerParams);
    
    expect(winterRes.status).toBe(200);
    expect(summerRes.status).toBe(200);
    // Check that both conversions maintain 3-hour difference
    const winterDiff = new Date(winterRes.body.original.timestamp) - new Date(winterRes.body.converted.timestamp);
    const summerDiff = new Date(summerRes.body.original.timestamp) - new Date(summerRes.body.converted.timestamp);
    expect(winterDiff).toBe(summerDiff);
  });

  test('handles invalid timezone', async () => {
    const params = {
      from: 'Invalid/Zone',
      to: 'UTC',
      datetime: '2025-06-14T12:00:00'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('handles invalid datetime format', async () => {
    const params = {
      from: 'UTC',
      to: 'Asia/Tokyo',
      datetime: 'invalid-date'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('maintains hour, minute, second precision', async () => {
    const params = {
      from: 'UTC',
      to: 'Asia/Tokyo',
      datetime: '2025-06-14T23:59:59'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(200);
    expect(res.body.original.formatted).toMatch(/23:59:59/);
    expect(res.body.converted.formatted).toMatch(/\d{2}:\d{2}:59/);
  });

  test('handles dates across day boundaries', async () => {
    const params = {
      from: 'America/Los_Angeles',
      to: 'Asia/Tokyo',
      datetime: '2025-06-14T20:00:00'
    };

    const res = await request(app)
      .get('/api/timezone/convert')
      .query(params);
    
    expect(res.status).toBe(200);
    expect(res.body.converted.formatted).toContain('2025-06-15');
  });
});
