require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
const healthRouter = require('./routes/health');
const logger = require('./logger');

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

// Root Endpoint - Devando API Landing Info
app.get('/', (req, res) => {
    res.status(200).json({
      name: 'Devando API Suite',
      version: '1.0.0',
      status: '✅ Up and Running',
      message: 'Welcome to Devando - Developer Tools API Service, Navigate to /index.html for UI and read the docs for using our API services in your application!',
      toolsAvailable: [
        'JSON Formatter',
        'URL Encoder/Decoder',
        'Text Encoder/Decoder',
        'Hash Generator',
        'Password Generator',
        'UUID Generator',
        'Lorem Ipsum Generator',
        'Timezone Converter',
        'Regex Matcher',
        'Calculator'
      ],
      docs: 'Read the documentation at https://github.com/adminvns/Devnado/blob/main/README.md '
    });
  });

//index.html renderer
app.use(express.static(path.join(__dirname, 'public')));
  
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

//health check
app.use('/api/health', healthRouter);

// Error Handlers
// 404 - Not Found Handler
app.use((req, res) => {
  logger.error(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'The requested resource was not found',
    details: {
      method: req.method,
      path: req.originalUrl,
      suggestion: 'Please check the API documentation for available endpoints',
      docs: 'https://github.com/adminvns/Devnado/blob/main/README.md'
    }
  });
});

// 500 - Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  logger.error(`${statusCode} - ${errorMessage}`, {
    error: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    ip: req.ip
  });

  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : errorMessage,
    requestId: req.id, // Useful for tracking errors in logs
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Devando is live at http://localhost:${PORT}`);
  });
}

module.exports = app;