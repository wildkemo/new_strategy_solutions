const express = require('express');
const router = express.Router();

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/validate_request', (req, res) => {
  res.status(200).end();
});

// Handle GET request
router.get('/validate_request', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.logged_in_user) {
      return res.status(401).json({
        status: 'error'
      });
    }

    // User is logged in
    res.status(200).json({
      status: 'success'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;