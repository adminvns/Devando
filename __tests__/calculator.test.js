const request = require('supertest');
const express = require('express');
const calculatorRouter = require('../routes/calculator');

const app = express();
app.use(express.json());
app.use('/api/calculator', calculatorRouter);

describe('Calculator API', () => {
  let originalConsoleError;

  beforeAll(() => {
    // Store the original console.error
    originalConsoleError = console.error;
    // Mock console.error to suppress output during tests
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore the original console.error after tests
    console.error = originalConsoleError;
  });

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
      
      expect(res.status).toBe(400);
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
  });

  test('rejects invalid expressions', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '2 + * 3' });
    
    expect(res.status).toBe(400);
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
  });

  describe('Operation-based calculations', () => {
    test('performs addition with operation mode', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'add', a: 5, b: 3 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(8);
    });

    test('performs subtraction with operation mode', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'subtract', a: 10, b: 4 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(6);
    });

    test('performs multiplication with operation mode', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'multiply', a: 6, b: 7 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(42);
    });

    test('performs division with operation mode', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'divide', a: 15, b: 3 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(5);
    });

    test('handles division by zero in operation mode', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'divide', a: 10, b: 0 });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Division by zero');
    });

    test('performs power operation', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'power', a: 2, b: 3 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(8);
    });

    test('performs modulo operation', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'mod', a: 17, b: 5 });
      
      expect(res.status).toBe(200);
      expect(res.body.result).toBe(2);
    });

    test('handles invalid operation', async () => {
      const res = await request(app)
        .post('/api/calculator')
        .send({ operation: 'invalid', a: 5, b: 3 });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid operation');
    });
  });

  test('rejects expressions with invalid characters', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '2 + abc' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid characters in expression');
  });

  test('handles infinite results', async () => {
    const res = await request(app)
      .post('/api/calculator')
      .send({ expression: '2 ** 1000' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid calculation: result is infinite or undefined');
  });
});
