const request = require('supertest');
const express = require('express');
const urlRouter = require('../routes/url');

const app = express();
app.use(express.json());
app.use('/api/url', urlRouter);

describe('URL Encoder/Decoder API', () => {
  test('encodes URL with special characters', async () => {
    const url = 'https://example.com/path with spaces?q=test&special=!@#$%^&*()';
    const res = await request(app)
      .post('/api/url/encode')
      .send({ url });
    
    expect(res.status).toBe(200);
    expect(res.text).toBe('https%3A%2F%2Fexample.com%2Fpath%20with%20spaces%3Fq%3Dtest%26special%3D!%40%23%24%25%5E%26*()');
  });

  test('decodes encoded URL', async () => {
    const encoded = 'https%3A%2F%2Fexample.com%2Fpath%20with%20spaces';
    const res = await request(app)
      .post('/api/url/decode')
      .send({ url: encoded });
    
    expect(res.status).toBe(200);
    expect(res.text).toBe('https://example.com/path with spaces');
  });

  test('handles empty input for encode', async () => {
    const res = await request(app)
      .post('/api/url/encode')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('URL is required');
  });

  test('handles empty input for decode', async () => {
    const res = await request(app)
      .post('/api/url/decode')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('URL is required');
  });

  test('handles URLs with Unicode characters', async () => {
    const url = 'https://example.com/path/世界';
    const res1 = await request(app)
      .post('/api/url/encode')
      .send({ url });
    
    expect(res1.status).toBe(200);
    
    const res2 = await request(app)
      .post('/api/url/decode')
      .send({ url: res1.text });
    
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(url);
  });

  test('handles complex query parameters', async () => {
    const url = 'https://example.com/search?q=test query&category[]=books&category[]=movies&year=2023';
    const res1 = await request(app)
      .post('/api/url/encode')
      .send({ url });
    
    expect(res1.status).toBe(200);
    
    const res2 = await request(app)
      .post('/api/url/decode')
      .send({ url: res1.text });
    
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(url);
  });
});
