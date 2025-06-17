const request = require('supertest');
const app = require('../server'); // Adjust if needed

describe('POST /api/color/convert', () => {
  it('should convert HEX to RGB', async () => {
    const res = await request(app).post('/api/color/convert').send({
      from: 'hex',
      to: 'rgb',
      value: '#ff5733',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result).toHaveProperty('r');
    expect(res.body.result).toHaveProperty('g');
    expect(res.body.result).toHaveProperty('b');
  });

  it('should return 400 for unsupported format', async () => {
    const res = await request(app).post('/api/color/convert').send({
      from: 'cmyk',
      to: 'rgb',
      value: '#000000',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/color/convert').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
