const express = require('express');
const router = express.Router();

// POST /api/calculator
router.post('/', (req, res) => {
  try {
    const { expression, operation, a, b } = req.body;

    if (expression) {
      // Sanitize expression (basic check)
      const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (safeExpression !== expression) {
        return res.status(400).send('Invalid characters in expression');
      }

      const result = Function('"use strict"; return (' + safeExpression + ')')();
      return res.json({ expression, result });
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
          if (numB === 0) return res.status(400).send('Division by zero');
          result = numA / numB;
          break;
        case 'power': result = Math.pow(numA, numB); break;
        case 'mod': result = numA % numB; break;
        default:
          return res.status(400).send('Invalid operation');
      }

      return res.json({ operation, a: numA, b: numB, result });
    }

    res.status(400).send('Provide either expression or operation with a & b');
  } catch {
    res.status(400).send('Invalid calculation');
  }
});

module.exports = router;
