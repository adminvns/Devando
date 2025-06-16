const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger'); // Add logger

// POST /api/uuid/generate
// Maximum number of UUIDs that can be generated at once
const MAX_UUID_COUNT = 50;
const MIN_UUID_COUNT = 1;

router.post('/generate', (req, res) => {
  logger.info('[UUID] /generate endpoint hit');
  let { count = 1 } = req.body;
  
  // Validate count
  count = parseInt(count);
  if (isNaN(count) || count < MIN_UUID_COUNT) {
    logger.warn(`[UUID] Invalid count received: ${count}`);
    return res.status(400).json({ 
      error: `Count must be a number between ${MIN_UUID_COUNT} and ${MAX_UUID_COUNT}` 
    });
  }
  
  // Limit maximum count
  count = Math.min(count, MAX_UUID_COUNT);
  const total = Math.min(parseInt(count), 100);
  const uuids = Array.from({ length: total }, () => uuidv4());
  logger.debug(`[UUID] Successfully generated ${total} UUIDs`);
  res.json({ success: true, count: total, uuids });
});

module.exports = router;