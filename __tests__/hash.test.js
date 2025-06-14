const request = require('supertest');
const express = require('express');
const hashRouter = require('../routes/hash');

const app = express();
app.use(express.json());
app.use('/api/generateHash', hashRouter);

describe('Hash Generator API', () => {
  test('generates SHA-256 hash by default', async () => {
    const text = 'test123';
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text });
    
    expect(res.status).toBe(200);
    // SHA-256 hash of 'test123'
    expect(res.text).toBe('ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae');
  });

  test('generates MD5 hash', async () => {
    const text = 'test123';
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text, algorithm: 'md5' });
    
    expect(res.status).toBe(200);
    // MD5 hash of 'test123'
    expect(res.text).toBe('cc03e747a6afbbcbf8be7668acfebee5');
  });

  test('generates SHA-1 hash', async () => {
    const text = 'test123';
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text, algorithm: 'sha1' });
    
    expect(res.status).toBe(200);
    // SHA-1 hash of 'test123'
    expect(res.text).toBe('7288edd0fc3ffcbe93a0cf06e3568e28521687bc');
  });

  test('handles empty input', async () => {
    const res = await request(app)
      .post('/api/generateHash')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('Text is required');
  });

  test('rejects unsupported algorithm', async () => {
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text: 'test123', algorithm: 'invalid' });
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('Unsupported algorithm');
  });

  test('handles unicode characters', async () => {
    const text = 'Hello, 世界!';
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text });
    
    expect(res.status).toBe(200);
    expect(res.text).toHaveLength(64); // SHA-256 hash is 64 characters
  });

  test('handles special characters', async () => {
    const text = '!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`';
    const res = await request(app)
      .post('/api/generateHash')
      .send({ text });
    
    expect(res.status).toBe(200);
    expect(res.text).toHaveLength(64); // SHA-256 hash is 64 characters
  });
});
