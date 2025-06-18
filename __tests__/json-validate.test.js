const request = require('supertest')
const app = require('../server') // Update path as needed

describe('POST /api/json/validate', () => {
  it('should return valid for proper JSON string', async () => {
    const res = await request(app).post('/api/json/validate').send({
      json: '{"name":"Mr. Stark"}'
    })
    expect(res.statusCode).toBe(200)
    expect(res.body.valid).toBe(true)
  })

  it('should return invalid for malformed JSON', async () => {
    const res = await request(app).post('/api/json/validate').send({
      json: '{"name":}'
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.valid).toBe(false)
  })

  it('should return error if input is not a string', async () => {
    const res = await request(app).post('/api/json/validate').send({
      json: { name: 'Tony' }
    })
    expect(res.statusCode).toBe(400)
    expect(res.body.valid).toBe(false)
  })
})
