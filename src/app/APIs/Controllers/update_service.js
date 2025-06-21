const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/update_service', (req, res) => {
  res.status(200).end();
});

// Handle PUT request
router.put('/update_service', (req, res) => {
  try {
    // Get data from request body
    const { id, ...data } = req.body;
    
    // Validate required fields
    if (!id || !Object.keys(data).length) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Initialize database handler
    const database = new DatabaseHandler();
    
    // Update service in database
    const result = database.update('services', data, { id });

    if (result === 0) {
      // Update successful
      res.status(200).json({
        status: 'success',
        message: 'Service updated successfully'
      });
    } else {
      // Update failed
      res.status(400).json({
        status: 'error',
        message: 'Database error'
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;