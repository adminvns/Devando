// __tests__/uuid.test.js
const request = require('supertest');
const app = require('../server'); // Path should match where you export the app

describe('UUID API', () => {
  test('generates default single UUID', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.uuids).toHaveLength(1);
    expect(res.body.uuids[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('generates multiple UUIDs', async () => {
    const count = 3;
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count });

    expect(res.statusCode).toBe(200);
    expect(res.body.uuids).toHaveLength(count);
    res.body.uuids.forEach(uuid => {
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  test('limits maximum UUID count', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body.uuids).toHaveLength(50); // Should be limited to 50
  });

  test('handles negative count', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count: -1 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Count must be a number between');
  });

  test('handles invalid count', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count: 'invalid' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('Count must be a number between');
  });

  test('UUIDs are unique', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count: 50 });

    expect(res.statusCode).toBe(200);
    const uuids = res.body.uuids;
    const uniqueUuids = [...new Set(uuids)];
    expect(uniqueUuids).toHaveLength(uuids.length);
  });
});
