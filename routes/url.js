const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Add logger

// Encode URL
router.post('/encode', (req, res) => {
  logger.info('[URL] /encode endpoint hit');
  const { url } = req.body;

  if (!url) {
    logger.warn('[URL] Missing URL in request');
    return res.status(400).send('URL is required');
  }

  try {
    const encoded = encodeURIComponent(url);
    logger.debug(`[URL] Successfully encoded URL: ${url}`);
    res.send(encoded);
  } catch (error) {
    logger.error(`[URL] Error encoding URL: ${error.message}`);
    res.status(500).send('Failed to encode URL');
  }
});

// Decode URL
router.post('/decode', (req, res) => {
  logger.info('[URL] /decode endpoint hit');
  const { url } = req.body;

  if (!url) {
    logger.warn('[URL] Missing URL in request');
    return res.status(400).send('Encoded URL is required');
  }

  try {
    const decoded = decodeURIComponent(url);
    logger.debug(`[URL] Successfully decoded URL: ${url}`);
    res.send(decoded);
  } catch (error) {
    logger.error(`[URL] Error decoding URL: ${error.message}`);
    res.status(400).send('Invalid encoded URL');
  }
});

module.exports = router;
