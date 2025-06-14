require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jsonRoute = require('./routes/json');
const base64Router = require('./routes/base64');
const hashRouter = require('./routes/hash');
const passwordRouter = require('./routes/password');
const urlRouter = require('./routes/url');
const timezoneRouter = require('./routes/timezone');
const calculatorRouter = require('./routes/calculator');
const loremRouter = require('./routes/loremRouter');
const regexRouter = require('./routes/regexRouter');
const uuidRouter = require('./routes/uuid');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter (basic tier)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests, upgrade to premium for unlimited access',
    upgrade_url: 'https://your-premium-link.com'
  }
});
app.use('/api/', limiter);

// API Key check
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.PREMIUM_API_KEY) {
    req.isPremium = true;
  }
  next();
};
app.use(checkApiKey);

// Placeholder root
app.get('/', (req, res) => {
  res.json({
    name: 'Devando API',
    version: '1.0.0',
    endpoints: 'Coming Soon...',
    status: 'Up and Running'
  });
});

//Json router
app.use('/api/json', jsonRoute);

//base64 router
app.use('/api/base64', base64Router);

//hashing router
app.use('/api/generateHash', hashRouter);

//password generator router
app.use('/api/generatePassword', passwordRouter);

//urlencoder router
app.use('/api/url', urlRouter);

//timezone router
app.use('/api/timezone', timezoneRouter);

//calculator router
app.use('/api/calculator', calculatorRouter);

// uuid router
app.use('/api/uuid', uuidRouter);

//lorem router
app.use('/api/lorem', loremRouter);

//regex router
app.use('/api/regex', regexRouter);

// Error Handling
app.use((req, res) => res.status(404).json({ error: 'Error 404 !Not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!Internal Server Error!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Devando is live at http://localhost:${PORT}`);
});