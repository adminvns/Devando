const express = require('express')
const router = express.Router()
const logger = require('../logger') // Add logger

// GET /api/timezone/convert
router.get('/convert', (req, res) => {
  logger.info('[TIMEZONE] /convert endpoint hit')
  const { from, to, datetime } = req.query

  if (!from || !to) {
    logger.warn('[TIMEZONE] Missing required timezone parameters')
    return res.status(400).send('From and to timezones are required')
  }

  const inputDate = datetime ? new Date(datetime) : new Date()

  if (isNaN(inputDate.getTime())) {
    logger.warn(`[TIMEZONE] Invalid datetime provided: ${datetime}`)
    return res.status(400).send('Invalid datetime format')
  }

  try {
    const fromTime = inputDate.toLocaleString('en-US', { timeZone: from })
    const toTime = inputDate.toLocaleString('en-US', { timeZone: to })

    logger.debug(`[TIMEZONE] Successfully converted time from ${from} to ${to}`)
    res.json({
      original: {
        timezone: from,
        formatted: fromTime
      },
      converted: {
        timezone: to,
        formatted: toTime
      }
    })
  } catch (error) {
    logger.error(`[TIMEZONE] Error converting timezone: ${error.message}`)
    res.status(500).send('Timezone conversion failed')
  }
})

// GET /api/timezone/list
router.get('/list', (req, res) => {
  logger.info('[TIMEZONE] /list endpoint hit')
  const timezones = [
    'UTC', 'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Dubai',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
  ]

  logger.debug('[TIMEZONE] Successfully retrieved timezone list')
  res.json(timezones)
})

module.exports = router
