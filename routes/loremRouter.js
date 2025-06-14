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
router.post('/generate', (req, res) => {
  const { type = 'paragraph', count = 1 } = req.body;
  const amt = Math.min(parseInt(count), 50);

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
