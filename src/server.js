const express = require('express');
const { getTotalDowntime, getCurrentDowntime } = require('./urlChecker');

const app = express();
const PORT = 3000;

// Expose an endpoint for retrieving downtime information
app.get('/downtime', (req, res) => {
  res.json({
    totalDowntime: getTotalDowntime(),
    currentDowntime: getCurrentDowntime(),
  });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Downtime information server is running at http://localhost:${PORT}`);
  });
}

module.exports = {
  startServer,
};