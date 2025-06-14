const express = require('express');
const router = express.Router();

// POST /api/json/format
router.post('/format', (req, res) => {
  try {
    // Handle null or undefined body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format. Request body is required.'
      });
    }

    // Validate input is an object (not array or null)
    if (Array.isArray(req.body) || req.body === null) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format. Provide a valid JSON object in request body.'
      });
    }

    // Extract indent from body if present
    const indent = req.body.indent || 2;
    let inputJson = req.body;

    // If indent was provided in the body, remove it from the input
    if ('indent' in req.body) {
      const { indent, ...rest } = req.body;
      inputJson = rest;
    }

    // Handle empty objects
    if (Object.keys(inputJson).length === 0) {
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

      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(formatted);    } catch (circularError) {
      console.error('[FORMAT ERROR] Circular reference detected:', circularError);
      throw new Error('Cannot format JSON with circular references');
    }
  } catch (error) {
    console.error('[FORMAT ERROR]', error.message);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while formatting JSON. Please check your input!',
      details: error.message
    });
  }
});

router.get('/format', (req, res) => {
    res.status(405).send("hey only a POST method allowed!");
    console.log("Error: User hit GET Method!");
});

module.exports = router;
