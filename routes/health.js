const express = require('express');
const router = express.Router();

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `Up from past ${hours ? `${hours} hour${hours !== 1 ? 's' : ''} ` : ''}${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
}

router.get('/', (req, res) => {
  const uptimeInSeconds = process.uptime();

  res.status(200).json({
    status: 'ok',
    message: 'Health check passed Successfully!',
    uptime: formatUptime(uptimeInSeconds),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;