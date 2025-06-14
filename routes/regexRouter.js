const express = require('express');
const router = express.Router();

// POST /api/regex/match
router.post('/match', (req, res) => {
  try {
    const { pattern, text, flags = 'g' } = req.body;
    if (!pattern || !text) {
      return res.status(400).json({ error: 'Pattern and text are required' });
    }

    const regex = new RegExp(pattern, flags);
    const matches = [...text.matchAll(regex)].map(m => m[0]);

    res.json({ success: true, pattern, matches, total: matches.length });
  } catch (error) {
    res.status(400).json({ error: 'Invalid regex pattern or input' });
  }
});

module.exports = router;
