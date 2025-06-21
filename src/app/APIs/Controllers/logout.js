const express = require('express');
const router = express.Router();

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/logout', (req, res) => {
  res.status(200).end();
});

// Handle logout
router.post('/logout', (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to logout'
        });
      }
      
      // Clear session variables
      req.session = null;
      
      // Respond with success
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
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