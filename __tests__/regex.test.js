const request = require('supertest');
const express = require('express');
const regexRouter = require('../routes/regexRouter');

const app = express();
app.use(express.json());
app.use('/api/regex', regexRouter);

describe('Regex Matcher API', () => {
  test('matches simple pattern', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: 'hello',
        text: 'hello world hello there'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual(['hello', 'hello']);
  });

  test('matches with regex pattern', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: '\\d+',
        text: 'abc 123 def 456'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual(['123', '456']);
  });

  test('handles no matches', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: '\\d+',
        text: 'abc def ghi'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual([]);
  });

  test('handles empty input', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('handles invalid regex pattern', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: '[',
        text: 'some text'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('matches with capture groups', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: '(\\w+)@(\\w+\\.\\w+)',
        text: 'contact us at test@example.com or support@test.com'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual(['test@example.com', 'support@test.com']);
  });

  test('handles Unicode characters', async () => {
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: '\\p{Script=Han}+',
        text: 'Hello 世界 Welcome 你好'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual(['世界', '你好']);
  });

  test('limits match count for performance', async () => {
    const text = 'a '.repeat(1000);
    const res = await request(app)
      .post('/api/regex/match')
      .send({
        pattern: 'a',
        text
      });
    
    expect(res.status).toBe(200);
    expect(res.body.matches.length).toBeLessThanOrEqual(100); // Assuming there's a limit
  });
});
