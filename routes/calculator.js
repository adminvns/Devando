const express = require('express');
const router = express.Router();

// POST /api/calculator
router.post('/', (req, res) => {
  try {
    const { expression, operation, a, b } = req.body;    if (expression) {      // Sanitize expression (basic check)
      const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (safeExpression !== expression) {
        return res.status(400).json({ error: 'Invalid characters in expression' });
      }

      // Check for division by zero using regex
      if (/\/\s*0(?![.])/g.test(safeExpression)) {
        return res.status(400).json({ error: 'Cant Perform Division by zero' });
      }

      try {
        const result = Function('"use strict"; return (' + safeExpression + ')')();
        
        // Check if result is Infinity or NaN
        if (!Number.isFinite(result)) {
          return res.status(400).json({ error: 'Invalid calculation: result is infinite or undefined' });
        }
        
        return res.json({ expression, result });
      } catch (err) {
        return res.status(400).json({ error: 'Invalid calculation' });
      }
    }

    if (operation && a !== undefined && b !== undefined) {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      let result;

      switch (operation) {
        case 'add': result = numA + numB; break;
        case 'subtract': result = numA - numB; break;
        case 'multiply': result = numA * numB; break;        
        case 'divide':
          if (numB === 0) return res.status(400).json({ error: 'Division by zero' });
          result = numA / numB;
          break;
        case 'power': result = Math.pow(numA, numB); break;
        case 'mod': result = numA % numB; break;
        default:          return res.status(400).json({ error: 'Invalid operation' });
      }

      return res.json({ operation, a: numA, b: numB, result });
    }

    res.status(400).json({ error: 'Provide either expression or operation with a & b' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid calculation' });
  }
});

module.exports = router;
