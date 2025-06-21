const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');



// Handle preflight OPTIONS request
router.options('/get_current_user', (req, res) => {
  res.status(200).end();
});

// Handle GET request
router.get('/get_current_user', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_email) {
      return res.status(401).json([]);
    }

    // Initialize database handler
    const dbHandler = new DatabaseHandler('localhost', 'strategy_solutions', 'postgres', 'kemo4066');

    // Query database for current user
    const user = dbHandler.getAllRecordsWhere('customers', 'email', req.session.user_email);

    // Return results as JSON
    res.status(200).json(user);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;