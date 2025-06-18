const express = require('express')
const router = express.Router()

router.post('/validate', (req, res) => {
  const input = req.body?.json

  if (typeof input !== 'string') {
    return res.status(400).json({
      success: false,
      valid: false,
      error: 'Invalid input. "json" must be a string.'
    })
  }

  try {
    JSON.parse(input)
    return res.status(200).json({
      success: true,
      valid: true,
      message: 'Valid JSON'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      valid: false,
      error: error.message
    })
  }
})

module.exports = router
