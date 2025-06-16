const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Add logger

router.post('/format', (req, res) => {
  logger.info('[JSON] /format endpoint hit');

  try {
    if (!req.body) {
      logger.warn('[JSON] Missing request body');
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format. Request body is required.'
      });
    }

    if (Array.isArray(req.body) || req.body === null) {
      logger.warn('[JSON] Invalid type – expected object, got array/null');
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format. Provide a valid JSON object in request body.'
      });
    }

    const indent = req.body.indent || 2;
    let inputJson = req.body;

    if ('indent' in req.body) {
      const { indent, ...rest } = req.body;
      inputJson = rest;
    }

    if (Object.keys(inputJson).length === 0) {
      logger.info('[JSON] Received empty object, returning {}');
      return res.status(200).send('{}');
    }

    try {
      const formatted = JSON.stringify(inputJson, (key, value) => {
        if (value === null) return value;
        if (typeof value === 'object' && Object.keys(value).length === 0) return {};
        return value;
      }, indent);

      if (!formatted) {
        throw new Error('Failed to format JSON');
      }

      logger.debug('[JSON] Successfully formatted JSON');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(formatted);
    } catch (circularError) {
      logger.error('[JSON] Circular reference error: ' + circularError.message);
      throw new Error('Cannot format JSON with circular references');
    }
  } catch (error) {
    logger.error(`[JSON] Unexpected error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while formatting JSON. Please check your input!',
      details: error.message
    });
  }
});

router.get('/format', (req, res) => {
  logger.warn('[JSON] GET method not allowed on /format');
  res.status(405).send('Hey, only POST method is allowed!');
});

module.exports = router;