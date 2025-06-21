const express = require('express');
const router = express.Router();

// Set CORS headers
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/delete_service', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/delete_service', async (req, res) => {
  try {
    const input = req.body;
    const data = JSON.parse(input);
    const id = data.id;

    // Connect to database and delete service
    const database = new DatabaseHandler('localhost', 'strategy_solutions', 'postgres', 'kemo4066');
    const op = database.deleteById('services', id);

    if (op === 0) {
      res.status(200).json({
        status: 'success',
        message: 'deleted successfully'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'database error'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;