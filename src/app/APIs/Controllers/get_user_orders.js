const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/get_user_orders', (req, res) => {
  res.status(200).end();
});

// Handle GET request
router.get('/get_user_orders', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_email) {
      return res.status(200).json([]);
    }

    // Initialize database handler
    const database = new DatabaseHandler('localhost', 'strategy_solutions', 'postgres', 'kemo4066');
    
    // Query database for user's orders
    const orders = database.getAllRecordsWhere("orders", "email", req.session.user_email);
    
    // Return results as JSON
    res.status(200).json(orders);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;