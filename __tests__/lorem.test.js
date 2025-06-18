const request = require('supertest')
const express = require('express')
const loremRouter = require('../routes/loremRouter')

const app = express()
app.use(express.json())
app.use('/api/lorem', loremRouter)

describe('Lorem Ipsum Generator API', () => {
  test('generates paragraphs by default', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({})

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body).toHaveProperty('content')
    expect(res.body.content).toContain(' ')
    expect(res.body.type).toBe('paragraph')
  })

  test('generates specified number of words', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ type: 'word', count: 5 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body.content.split(' ')).toHaveLength(5)
  })

  test('generates specified number of sentences', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ type: 'sentence', count: 3 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    const sentences = res.body.content.split('.')
    expect(sentences.length - 1).toBe(3) // -1 because split creates an empty element after last period
  })

  test('limits maximum word count', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ type: 'word', count: 2000 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body.content.split(' ').length).toBeLessThanOrEqual(1000)
  })

  test('limits maximum paragraph count', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ type: 'paragraph', count: 100 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body.content.split('\n\n').length).toBeLessThanOrEqual(50)
  })

  test('rejects invalid type', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ type: 'invalid' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('success', false)
    expect(res.body.error).toContain('Invalid type')
  })

  test('handles negative count', async () => {
    const res = await request(app)
      .post('/api/lorem/generate')
      .send({ count: -1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('success', false)
    expect(res.body.error).toContain('Count must be a positive number')
  })
})
