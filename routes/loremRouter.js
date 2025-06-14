const express = require('express');
const router = express.Router();
const { LoremIpsum } = require('lorem-ipsum');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

// POST /api/lorem/generate
// Constants for lorem ipsum generation limits
const MAX_COUNT = {
  word: 1000,
  sentence: 100,
  paragraph: 50
};

router.post('/generate', (req, res) => {
  let { type = 'paragraph', count = 1 } = req.body;
  
  // Validate type
  if (!['word', 'sentence', 'paragraph'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid type. Must be word, sentence, or paragraph'
    });
  }

  // Validate and limit count
  count = parseInt(count);
  if (isNaN(count) || count < 1) {
    return res.status(400).json({
      success: false,
      error: 'Count must be a positive number'
    });
  }
  
  const amt = Math.min(count, MAX_COUNT[type]);

  let result;
  switch (type) {
    case 'word':
      result = lorem.generateWords(amt);
      break;
    case 'sentence':
      result = lorem.generateSentences(amt);
      break;
    case 'paragraph':
    default:
      result = lorem.generateParagraphs(amt);
      break;
  }

  res.json({ success: true, type, count: amt, content: result });
});

module.exports = router;
