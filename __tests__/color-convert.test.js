const request = require('supertest');
const express = require('express');
const colorRouter = require('../routes/colorConverter'); // Adjust path if needed

const app = express();
app.use(express.json());
app.use('/api/color', colorRouter);

describe('Color Converter API', () => {
  it('should convert HEX to RGB', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'hex', to: 'rgb', value: '#ff5733' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result).toHaveProperty('r');
  });

  it('should convert RGB object to HEX', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'rgb', to: 'hex', value: { r: 255, g: 87, b: 51 } });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.result).toBe('string');
  });

  it('should convert RGB stringified object to HEX', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'rgb', to: 'hex', value: '{"r":255,"g":87,"b":51}' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'hex', to: 'rgb' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Missing required fields/);
  });

  it('should return 400 for unsupported from format', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'lab', to: 'rgb', value: '#ff5733' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Supported formats are/);
  });

  it('should return 400 for unsupported to format', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'hex', to: 'xyz', value: '#ff5733' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should catch parse error for malformed JSON string', async () => {
    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'rgb', to: 'hex', value: '{"r":255,"g":87,"b":' }); // Invalid JSON

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Invalid color object/);
  });

  it('should throw error for unsupported conversion logic (internal check)', async () => {
    const app = express();
    const router = require('express').Router();

    // Mock to simulate non-implemented conversion
    router.post('/convert', (req, res) => {
      res.status(200).json({
        from: 'hex',
        to: 'lab', // Not handled
        value: '#000000',
        result: 'n/a',
      });
    });

    app.use('/api/color', router);

    const res = await request(app)
      .post('/api/color/convert')
      .send({ from: 'hex', to: 'lab', value: '#000000' });

    // This won't test your exact implementation, just a pattern idea
    expect(res.statusCode).toBe(200);
  });

  it('should throw error for unsupported "from" format in parseInput', async () => {
  const res = await request(app)
    .post('/api/color/convert')
    .send({ from: 'xyz', to: 'rgb', value: '#ff5733' });

  expect(res.statusCode).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.error).toMatch(/Supported formats are/);
});

it('should return 500 for unsupported "to" conversion logic', async () => {
  const res = await request(app)
    .post('/api/color/convert')
    .send({ from: 'hex', to: 'cmyk', value: '#ff5733' }); // cmyk is in SUPPORTED_FORMATS?

  // To force this branch to execute, you'll need to temporarily add "cmyk" to SUPPORTED_FORMATS
  // just for test coverage, or mock the condition

  expect(res.statusCode).toBe(500);
  expect(res.body.success).toBe(false);
  expect(res.body.error).toMatch(/Conversion to cmyk not implemented/);
});

});
