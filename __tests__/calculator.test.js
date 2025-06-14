const request = require('supertest');
const express = require('express');
const calculatorRouter = require('../routes/calculator');

const app = express();
app.use(express.json());
app.use('/api/calculator', calculatorRouter);

describe('Calculator API', () => {
  describe('Basic Operations', () => {
    test('performs addition', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ expression: '2 + 2' });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(4);
    });

    test('performs subtraction', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ expression: '5 - 3' });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(2);
    });

    test('performs multiplication', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ expression: '4 * 3' });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(12);
    });

    test('performs division', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ expression: '10 / 2' });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(5);
    });

    test('performs modulo', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ expression: '7 % 3' });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(1);
    });
  });

  test('performs complex arithmetic', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '(5 + 3) * 2 - 4' });
    
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(12);
  });

  test('handles decimal numbers', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '3.14 * 2' });
    
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(6.28);
  });

  test('handles empty input', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('rejects invalid expressions', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '2 + * 3' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('handles division by zero', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '1 / 0' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('handles nested parentheses', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '((2 + 3) * (4 - 1)) / 2' });
    
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(7.5);
  });

  test('rejects unsafe expressions', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: 'console.log(1)' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
