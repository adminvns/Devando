// __tests__/uuid.test.js
const request = require('supertest');
const app = require('../server'); // Path should match where you export the app

describe('UUID API', () => {
  it('should return UUIDs', async () => {
    const res = await request(app)
      .post('/api/uuid/generate')
      .send({ count: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.uuids.length).toBe(3);
  });
});
