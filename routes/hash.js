const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const supportedAlgos = ['md5', 'sha1', 'sha256', 'sha512'];

router.post('/', (req, res) => {
  const { text, algorithm = 'sha256' } = req.body;

  if (!text) return res.status(400).send('Text is required');
  if (!supportedAlgos.includes(algorithm)) {
    return res.status(400).send(`Unsupported algorithm. Use one of: ${supportedAlgos.join(', ')}`);
  }

  try {
    const hash = crypto.createHash(algorithm).update(text).digest('hex');
    res.send(hash);
  } catch (err) {
    res.status(500).send('Hashing failed');
  }
});

module.exports = router;
