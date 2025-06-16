const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Add logger

// Encode text to base64
router.post('/encode', (req, res) => {
  logger.info('[BASE64] /encode endpoint hit');
  const { text } = req.body;
  if (!text) {
    logger.warn('[BASE64] Missing text in request');
    return res.status(400).send('Text is required');
  }

  try {
    const encoded = Buffer.from(text, 'utf8').toString('base64');
    logger.debug(`[BASE64] Successfully encoded text of length ${text.length}`);
    res.send(encoded);
  } catch (error) {
    logger.error(`[BASE64] Error encoding text: ${error.message}`);
    res.status(500).send('Failed to encode text');
  }
});

// Decode base64 to text
router.post('/decode', (req, res) => {
  logger.info('[BASE64] /decode endpoint hit');
  const { encoded } = req.body;
  if (!encoded) {
    logger.warn('[BASE64] Missing text in request');
    return res.status(400).send('Encoded text is required');
  }

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    logger.debug(`[BASE64] Successfully decoded text of length ${encoded.length}`);
    res.send(decoded);
  } catch (error) {
    logger.error(`[BASE64] Error decoding base64: ${error.message}`);
    res.status(400).send('Invalid Base64 input');
  }
});


router.get('/decode', (req, res) => {
    logger.warn('[BASE64] GET method not allowed on /decode');
    res.status(405).send("hey only a POST method allowed!");
});

router.get('/encode', (req, res) => {
    logger.warn('[BASE64] GET method not allowed on /encode');
    res.status(405).send("hey only a POST method allowed!");
});


module.exports = router;
