const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Add logger

// POST /api/regex/match
router.post('/match', (req, res) => {
  logger.info('[REGEX] /match endpoint hit');
  try {
    const { pattern, text, flags = 'g' } = req.body;
    if (!pattern || !text) {
      logger.warn('[REGEX] Missing pattern or text in request');
      return res.status(400).json({ error: 'Pattern and text are required' });
    }

    const regex = new RegExp(pattern, flags);
    const matches = [...text.matchAll(regex)].map(m => m[0]);
    logger.debug(`[REGEX] Found ${matches.length} matches for pattern: ${pattern}`);
    res.json({ success: true, pattern, matches, total: matches.length });
  } catch (error) {
    logger.error(`[REGEX] Error in regex matching: ${error.message}`);
    res.status(400).json({ error: 'Invalid regex pattern or input' });
  }
});

module.exports = router;
