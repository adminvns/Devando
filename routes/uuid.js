const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// POST /api/uuid/generate
router.post('/generate', (req, res) => {
  const { count = 1 } = req.body;
  const total = Math.min(parseInt(count), 100);
  const uuids = Array.from({ length: total }, () => uuidv4());
  res.json({ success: true, count: total, uuids });
});

module.exports = router;