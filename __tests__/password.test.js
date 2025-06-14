const request = require('supertest');
const express = require('express');
const passwordRouter = require('../routes/password');

const app = express();
app.use(express.json());
app.use('/api/generatePassword', passwordRouter);

describe('Password Generator API', () => {
  describe('Default Settings', () => {
    test('generates password with default length', async () => {
      const res = await request(app)
        .post('/api/generatePassword')
        .send({});
      
      expect(res.status).toBe(200);
      expect(res.text).toMatch(/^[A-Za-z0-9!@#$%^&*()_+\[\]{}<>?,\.]{12}$/);
    });

    test('includes all character types by default', async () => {
      const res = await request(app)
        .post('/api/generatePassword')
        .send({});
      
      expect(res.status).toBe(200);
      expect(res.text).toMatch(/[!@#$%^&*()_+\[\]{}<>?,\.]/); // Symbols
    });

    test('generates unique passwords', async () => {
      const res1 = await request(app)
        .post('/api/generatePassword')
        .send({});
      
      const res2 = await request(app)
        .post('/api/generatePassword')
        .send({});
      
      expect(res1.text).not.toBe(res2.text);
    });
  });

  test('generates password with custom length', async () => {
    const res = await request(app)
      .post('/api/generatePassword')
      .send({ length: 20 });
    
    expect(res.status).toBe(200);
    expect(res.text).toHaveLength(20);
  });

  test('rejects invalid length', async () => {
    const res = await request(app)
      .post('/api/generatePassword')
      .send({ length: 200 });
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('Password length must be between');
  });

  test('rejects negative length', async () => {
    const res = await request(app)
      .post('/api/generatePassword')
      .send({ length: -10 });
    
    expect(res.status).toBe(400);
  });

  test('requires at least one character type', async () => {
    const res = await request(app)
      .post('/api/generatePassword')
      .send({
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false
      });
    
    expect(res.status).toBe(400);
    expect(res.text).toContain('At least one character type must be selected');
  });

  test('generates password with only numbers', async () => {
    const res = await request(app)
      .post('/api/generatePassword')
      .send({
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: true,
        includeSymbols: false
      });
    
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/^[0-9]{12}$/);
  });
});
