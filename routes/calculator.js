const express = require('express');
const router = express.Router();

// Check for potential infinite results in expressions
const checkForInfiniteResults = (expression) => {
  if (expression.includes('**')) {
    const matches = expression.match(/(\d+)\s*\*\*\s*(\d+)/);
    if (matches) {
      const exp = parseFloat(matches[2]);
      if (Math.abs(exp) > 100) {
        return true;
      }
    }
  }
  return false;
};

// Validate and evaluate mathematical expression
const evaluateExpression = (expression) => {
  // Sanitize expression
  const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
  if (safeExpression !== expression) {
    throw new Error('Invalid characters in expression');
  }

  // Check for division by zero
  if (/\/\s*0(?![.])/g.test(safeExpression)) {
    throw new Error('Cannot perform division by zero');
  }

  // Check for potentially infinite results
  if (checkForInfiniteResults(safeExpression)) {      throw new Error('Invalid calculation: result is infinite or undefined');
  }

  // Evaluate and check result
  const result = eval(safeExpression);
  if (!Number.isFinite(result)) {
    throw new Error('Result is infinite or undefined');
  }

  return result;
};

// Perform basic arithmetic operations
const performOperation = (operation, a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  switch (operation) {
    case 'add':
      return numA + numB;
    case 'subtract':
      return numA - numB;
    case 'multiply':
      return numA * numB;
    case 'divide':
      if (numB === 0) throw new Error('Division by zero');
      return numA / numB;
    case 'power':
      if (Math.abs(numB) > 100) throw new Error('Exponent too large');
      return Math.pow(numA, numB);
    case 'mod':
      if (numB === 0) throw new Error('Modulo by zero');
      return numA % numB;
    default:
      throw new Error('Invalid operation');
  }
};

// POST /api/calculator
router.post('/', (req, res) => {
  try {
    const { expression, operation, a, b } = req.body;

    if (expression) {
      try {
        const result = evaluateExpression(expression);
        return res.json({ expression, result });
      } catch (err) {
        console.error('Expression evaluation error:', err);
        return res.status(400).json({ error: err.message });
      }
    }

    if (operation && a !== undefined && b !== undefined) {
      try {
        const result = performOperation(operation, a, b);
        return res.json({ operation, a: parseFloat(a), b: parseFloat(b), result });
      } catch (err) {
        console.error('Operation error:', err);
        return res.status(400).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: 'Provide either expression or operation with a & b' });
  } catch (error) {
    console.error('Calculator route error:', error);
    res.status(400).json({ error: 'Invalid calculation', details: error.message });
  }
});

module.exports = router;
