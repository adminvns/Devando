const express = require('express');
const router = express.Router();

// GET /api/timezone/convert
router.get('/convert', (req, res) => {
  const { from, to, datetime } = req.query;

  if (!from || !to) {
    return res.status(400).send('From and to timezones are required');
  }

  const inputDate = datetime ? new Date(datetime) : new Date();

  if (isNaN(inputDate.getTime())) {
    return res.status(400).send('Invalid datetime format');
  }

  try {
    const fromTime = inputDate.toLocaleString('en-US', { timeZone: from });
    const toTime = inputDate.toLocaleString('en-US', { timeZone: to });

    res.json({
      original: {
        timezone: from,
        formatted: fromTime
      },
      converted: {
        timezone: to,
        formatted: toTime
      }
    });
  } catch {
    res.status(500).send('Timezone conversion failed');
  }
});

// GET /api/timezone/list
router.get('/list', (req, res) => {
  const timezones = [
    'UTC', 'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Dubai',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
  ];

  res.json(timezones);
});

module.exports = router;
