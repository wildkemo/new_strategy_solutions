const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');
const Customer = require('../Models/Customer');

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/register', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/register', (req, res) => {
  try {
    // Check if user is already logged in
    if (req.session && (req.session.logged_in_user || req.session.logged_in_admin)) {
      return res.status(401).json({
        status: 'error',
        message: 'Please logout first before registering'
      });
    }

    // Get data from request body
    const { 
      name, 
      email, 
      phone, 
      gender, 
      password, 
      company_name 
    } = req.body;

    // Validate required fields (similar validation as PHP)
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Initialize database handler
    const dbHandler = new DatabaseHandler('localhost', 'strategy_solutions', 'postgres', 'kemo4066');

    // Create customer object and add to database
    const customer = new Customer();
    customer.setName(name);
    customer.setEmail(email);
    customer.setPhone(phone || '');
    customer.setGender(gender || '');
    customer.setPassword(password);
    customer.setCompanyName(company_name || '');

    const result = customer.addToDB(dbHandler);

    if (result === 0) {
      // Registration successful
      res.status(200).json({
        status: 'success',
        message: 'User registered successfully'
      });
    } else if (result === 2) {
      // User already exists
      res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    } else {
      // Database error
      res.status(500).json({
        status: 'error',
        message: 'An error occurred with the database'
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