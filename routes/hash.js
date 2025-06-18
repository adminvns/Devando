const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const logger = require('../logger') // Add logger

const supportedAlgos = ['md5', 'sha1', 'sha256', 'sha512']

router.post('/', (req, res) => {
  logger.info('[HASH] / endpoint hit')
  const { text, algorithm = 'sha256' } = req.body

  if (!text) {
    logger.warn('[HASH] Missing text in request')
    return res.status(400).send('Text is required')
  }
  if (!supportedAlgos.includes(algorithm)) {
    logger.warn(`[HASH] Unsupported algorithm: ${algorithm}`)
    return res.status(400).send(`Unsupported algorithm. Use one of: ${supportedAlgos.join(', ')}`)
  }

  try {
    const hash = crypto.createHash(algorithm).update(text).digest('hex')
    logger.debug(`[HASH] Successfully hashed text using ${algorithm}`)
    res.send(hash)
  } catch (error) {
    logger.error(`[HASH] Error hashing text: ${error.message}`)
    res.status(500).send('Hashing failed')
  }
})

module.exports = router
