const express = require('express')
const router = express.Router()
const { colord } = require('colord')
const logger = require('../logger')

// Supported color models
const SUPPORTED_FORMATS = ['hex', 'rgb', 'hsl', 'cmyk']

const parseInput = (value, from) => {
  if (from === 'hex') return colord(value)
  if (from === 'rgb' || from === 'hsl') {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value
      return colord(parsed)
    } catch (err) {
      throw new Error('Invalid color object. Must be a valid JSON string or object.')
    }
  }
  throw new Error(`Unsupported 'from' format: ${from}`)
}

router.post('/convert', (req, res) => {
  const { from, to, value } = req.body

  logger.debug(`[COLOR CONVERT] Received - From: ${from}, To: ${to}, Value: ${JSON.stringify(value)}`)

  if (!from || !to || !value) {
    logger.debug('[COLOR CONVERT] Missing required fields.')
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: from, to, and value are needed.'
    })
  }

  if (!SUPPORTED_FORMATS.includes(from) || !SUPPORTED_FORMATS.includes(to)) {
    logger.debug('[COLOR CONVERT] Unsupported format detected.')
    return res.status(400).json({
      success: false,
      error: `Supported formats are: ${SUPPORTED_FORMATS.join(', ')}`
    })
  }

  try {
    const color = parseInput(value, from)
    let converted

    if (to === 'hex') {
      converted = color.toHex()
    } else if (to === 'rgb') {
      converted = color.toRgb()
    } else if (to === 'hsl') {
      converted = color.toHsl()
    } else {
      throw new Error(`Conversion to ${to} not implemented.`)
    }

    logger.debug(`[COLOR CONVERT] Converted Value: ${JSON.stringify(converted)}`)

    return res.status(200).json({
      success: true,
      from,
      to,
      input: value,
      result: converted
    })
  } catch (error) {
    logger.error('[COLOR CONVERT] Conversion failed:', error.message)
    return res.status(500).json({
      success: false,
      error: `Conversion failed: ${error.message}`
    })
  }
})

module.exports = router
