const express = require('express');
const router = express.Router();

// Encode URL
router.post('/encode', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const encoded = encodeURIComponent(url);
    res.send(encoded);
  } catch (err) {
    res.status(500).send('Failed to encode URL');
  }
});

// Decode URL
router.post('/decode', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send('Encoded URL is required');
  }

  try {
    const decoded = decodeURIComponent(url);
    res.send(decoded);
  } catch (err) {
    res.status(400).send('Invalid encoded URL');
  }
});

module.exports = router;
