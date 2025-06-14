const express = require('express');
const router = express.Router();

// Encode text to base64
router.post('/encode', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text is required');

  try {
    const encoded = Buffer.from(text, 'utf8').toString('base64');
    res.send(encoded);
  } catch {
    res.status(500).send('Failed to encode text');
  }
});

// Decode base64 to text
router.post('/decode', (req, res) => {
  const { encoded } = req.body;
  if (!encoded) return res.status(400).send('Encoded text is required');

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    res.send(decoded);
  } catch {
    res.status(400).send('Invalid Base64 input');
  }
});


router.get('/decode', (req, res) => {
    res.status(405).send("hey only a POST method allowed!");
    console.log("Error: User hit GET Method!")
  });

router.get('/encode', (req, res) => {
    res.status(405).send("hey only a POST method allowed!");
    console.log("Error: User hit GET Method!");
});


module.exports = router;
