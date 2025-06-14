const express = require('express');
const router = express.Router();

// POST /api/json/format
router.post('/format', (req, res) => {
  try {
    const indent = parseInt(req.body.indent) || 2;
    const inputJson = req.body;

    if (typeof inputJson !== 'object' || Array.isArray(inputJson) || inputJson === null) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format. Provide a valid JSON object in request body.'
      });
    }

    const formatted = JSON.stringify(inputJson, null, indent);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(formatted);
  } catch (error) {
    console.error('[FORMAT ERROR]', error.message);
    res.status(500).json({
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
