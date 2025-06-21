const express = require('express')
const axios = require('axios')
const router = express.Router()
const logger = require('../logger')

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'error: No API key provided'
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL

router.post('/', async (req, res) => {
  const { code } = req.body
  if (!code || typeof code !== 'string') {
    logger.error('[AI Code Summarizer] Missing or invalid code in request body')
    return res.status(400).json({ error: "Missing or invalid 'code' in request body." })
  }

  try {
    logger.info('[AI Code Summarizer] Received code snippet for summarization')

    // Use a different prompt for very short code
    const prompt = code.length < 40
      ? `Explain, in plain English, what this code does, even if it is a single line:\n\n${code}, Make it short and concise.`
      : `Summarize what this code does in plain English:\n\n${code}, Make it short and concise.`

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 128,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    let summary = response.data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      // Fallback: try with a more forceful prompt if first attempt fails
      const forcePrompt = `Even if it is a single line, explain exactly what this code does:\n\n${code}`
      logger.info('[AI Code Summarizer] Retrying with forceful prompt for short code line.')
      const retry = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: forcePrompt
            }
          ],
          max_tokens: 128,
          temperature: 0.2
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      summary = retry.data.choices?.[0]?.message?.content?.trim()
    }

    if (!summary) {
      logger.warn(
        '[AI Code Summarizer] No summary content in OpenRouter response for code:',
        code
      )
      return res.json({ summary: 'No summary generated. The code may be too short or lack context for summarization.' })
    }

    res.json({ summary })
    logger.info('[AI Code Summarizer] Successfully summarized code snippet')
  } catch (error) {
    if (error?.response?.data) {
      logger.error('[AI Code Summarizer] AI summarization error:', JSON.stringify(error.response.data, null, 2))
    } else {
      logger.error('[AI Code Summarizer] AI summarization error:', error.message)
    }
    res.status(500).json({ error: 'Failed to summarize code.' })
  }
})

module.exports = router
