const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV === 'test' // Be silent during tests
    })
    // new transports.File({ filename: 'logs/devando.log' }) // optional file log
  ]
})

module.exports = logger
