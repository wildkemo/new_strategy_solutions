const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/update_user_info', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/update_user_info', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_email) {
      return res.status(401).json({
        status: 'error',
        message: 'User not logged in'
      });
    }

    // Get data from request body
    const { 
      currentPassword, 
      name, 
      confirmPassword, 
      company_name,
      ...restData 
    } = req.body;

    // If password is being changed, verify current password
    if (currentPassword) {
      // Initialize database handler
      const database = new DatabaseHandler();

      // Get user's current password from database
      const currentPasswordFromDB = database.getOneValue(
        'customers', 
        'password', 
        'email', 
        req.session.user_email
      );

      // If passwords don't match, return error
      if (currentPassword !== currentPasswordFromDB) {
        return res.status(403).json({
          status: 'error',
          message: 'Wrong Password'
        });
      }
    }

    // Update user information
    const updateData = { ...restData };
    delete updateData.currentPassword;
    delete updateData.confirmPassword;

    // Initialize database handler
    const database = new DatabaseHandler();
    
    // Update customer record
    const customerUpdateResult = database.update(
      'customers', 
      updateData, 
      { email: req.session.user_email }
    );

    // Prepare data for orders update
    const ordersUpdateData = {
      name,
      email: req.session.user_email,
      company_name
    };

    // Update orders record
    const ordersUpdateResult = database.update(
      'orders',
      ordersUpdateData,
      { email: req.session.user_email }
    );

    // Check update results
    if (customerUpdateResult === 0 && ordersUpdateResult === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'User information updated successfully'
      });
    } else {
      return res.status(400).json({
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