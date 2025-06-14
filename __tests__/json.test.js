const request = require('supertest');
const express = require('express');
const jsonRouter = require('../routes/json');

const app = express();
app.use(express.json());
app.use('/api/json', jsonRouter);

describe.skip('JSON Formatter API', () => {
  test('formats simple JSON object', async () => {
    const input = { name: 'test', value: 123 };
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
    expect(res.text).toContain('\n');
    expect(res.text).toContain('  ');
  });

  test('formats nested JSON object', async () => {
    const input = {
      person: {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Test City'
        }
      }
    };
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
    expect(res.text.split('\n').length).toBeGreaterThan(1);
  });

  test('formats JSON array', async () => {
    const input = [1, 2, { test: 'value' }, 4];
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
  });

  test('handles empty object', async () => {
    const res = await request(app)
      .post('/api/json/format')
      .send({});
    
    expect(res.status).toBe(200);
    expect(res.text).toBe('{}');
  });

  test('handles null values', async () => {
    const input = { test: null };
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
  });

  test('handles arrays with mixed types', async () => {
    const input = {
      mixed: [1, 'string', true, null, { nested: 'object' }]
    };
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
  });

  test('rejects invalid JSON', async () => {
    const res = await request(app)
      .post('/api/json/format')
      .send('not json');
    
    expect(res.status).toBe(400);
  });

  test('maintains original data types', async () => {
    const input = {
      string: 'test',
      number: 123,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      object: { key: 'value' }
    };
    const res = await request(app)
      .post('/api/json/format')
      .send(input);
    
    expect(res.status).toBe(200);
    const formatted = JSON.parse(res.text);
    expect(formatted).toEqual(input);
    expect(typeof formatted.string).toBe('string');
    expect(typeof formatted.number).toBe('number');
    expect(typeof formatted.boolean).toBe('boolean');
    expect(formatted.null).toBeNull();
    expect(Array.isArray(formatted.array)).toBe(true);
    expect(typeof formatted.object).toBe('object');
  });
});
