const request = require('supertest');
const express = require('express');
const base64Router = require('../routes/base64');

const app = express();
app.use(express.json());
app.use('/api/base64', base64Router);

describe('Base64 Encoder/Decoder API', () => {
  test('encodes text to base64', async () => {
    const text = 'Hello, World!';
    const res = await request(app)
      .post('/api/base64/encode')
      .send({ text });
    
    expect(res.status).toBe(200);
    expect(res.text).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  test('decodes base64 to text', async () => {
    const encoded = 'SGVsbG8sIFdvcmxkIQ==';
    const res = await request(app)
      .post('/api/base64/decode')
      .send({ encoded });
    
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, World!');
  });

  test('handles empty input for encode', async () => {
    const res = await request(app)
      .post('/api/base64/encode')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('Text is required');
  });

  test('handles empty input for decode', async () => {
    const res = await request(app)
      .post('/api/base64/decode')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('Encoded text is required');
  });

  test('handles unicode characters', async () => {
    const text = 'Hello, 世界!';
    const res1 = await request(app)
      .post('/api/base64/encode')
      .send({ text });
    
    expect(res1.status).toBe(200);
    
    const res2 = await request(app)
      .post('/api/base64/decode')
      .send({ encoded: res1.text });
    
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(text);
  });

  test('handles special characters', async () => {
    const text = '!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`';
    const res1 = await request(app)
      .post('/api/base64/encode')
      .send({ text });
    
    expect(res1.status).toBe(200);
    
    const res2 = await request(app)
      .post('/api/base64/decode')
      .send({ encoded: res1.text });
    
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(text);
  });
});
