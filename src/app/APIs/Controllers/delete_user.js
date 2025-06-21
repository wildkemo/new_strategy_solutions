const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler'); // Make sure this path is correct

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/delete_user', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/delete_user', (req, res) => {
  try {
    // Initialize database handler
    const database = new DatabaseHandler(
      'localhost', 
      'test2', 
      'root', 
      ''
    );
    
    // Get data from request body
    const { id, email } = req.body;
    
    // Delete user records
    const deleteOrdersResult = database.deleteByString("orders", "email", email);
    const deleteCustomersResult = database.deleteByString("customers", "email", email);
    
    if (deleteOrdersResult === 0 && deleteCustomersResult === 0) {
      res.status(200).json({
        status: 'success',
        message: 'Deleted successfully'
      });
    } else {
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