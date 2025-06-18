const express = require('express')
const router = express.Router()
const { LoremIpsum } = require('lorem-ipsum')
const logger = require('../logger') // Add logger

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

// POST /api/lorem/generate
// Constants for lorem ipsum generation limits
const MAX_COUNT = {
  word: 1000,
  sentence: 100,
  paragraph: 50
}

router.post('/generate', (req, res) => {
  logger.info('[LOREM] /generate endpoint hit')
  let { type = 'paragraph', count = 1 } = req.body

  // Validate type
  if (!['word', 'sentence', 'paragraph'].includes(type)) {
    logger.warn(`[LOREM] Invalid type provided: ${type}`)
    return res.status(400).json({
      success: false,
      error: 'Invalid type. Must be word, sentence, or paragraph'
    })
  }

  // Validate and limit count
  count = parseInt(count)
  if (isNaN(count) || count < 1) {
    logger.warn(`[LOREM] Invalid count provided: ${count}`)
    return res.status(400).json({
      success: false,
      error: 'Count must be a positive number'
    })
  }

  const amt = Math.min(count, MAX_COUNT[type])

  try {
    let result
    switch (type) {
      case 'word':
        result = lorem.generateWords(amt)
        break
      case 'sentence':
        result = lorem.generateSentences(amt)
        break
      case 'paragraph':
      default:
        result = lorem.generateParagraphs(amt)
        break
    }

    logger.debug(`[LOREM] Successfully generated ${amt} ${type}`)
    res.json({ success: true, type, count: amt, content: result })
  } catch (error) {
    logger.error(`[LOREM] Error generating lorem ipsum: ${error.message}`)
    res.status(500).json({ success: false, error: 'Failed to generate lorem ipsum' })
  }
})

module.exports = router
