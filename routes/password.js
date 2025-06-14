const express = require('express');
const router = express.Router();

// Constants for password generation limits
const MAX_PASSWORD_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 4;

router.post('/', (req, res) => {
  let {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
  } = req.body;

  // Validate length
  length = parseInt(length);
  if (isNaN(length) || length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
    return res.status(400).send(`Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`);
  }

  // Ensure at least one character type is selected
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    return res.status(400).send('At least one character type must be selected');
  }

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}<>?,.';

  let charset = '';
  if (includeUppercase) charset += upper;
  if (includeLowercase) charset += lower;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  if (!charset) {
    return res.status(400).send('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  res.send(password);
});

module.exports = router;
