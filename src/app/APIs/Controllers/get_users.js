const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');
const User = require('../Models/User'); // Assuming there's a User model

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/get_users', (req, res) => {
  res.status(200).end();
});

// Handle GET request
router.get('/get_users', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_email) {
      return res.status(401).json([]);
    }

    // Initialize database handler
    const dbHandler = new DatabaseHandler();

    // Query database for all users
    const users = dbHandler.getAllRecords('users');

    // Return results as JSON
    res.status(200).json(users);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;