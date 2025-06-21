const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../Models/DatabaseHandler');



// Handle preflight OPTIONS request
router.options('/login', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/login', async (req, res) => {
  try {
    const input = req.body;
    const data = JSON.parse(input);
    const { action, email, password } = data;

    // Check if user is already logged in
    if (req.session && (req.session.logged_in_user || req.session.logged_in_admin)) {
      return res.status(400).json({
        status: 'error',
        message: 'logout first before you can login again'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Email'
      });
    }

    // Create database handler
    const database = new DatabaseHandler('localhost', 'strategy_solutions', 'postgres', 'kemo4066');

    if (action === 'login') {
      // User login
      const authentication = database.authenticateUser('customers', 'email', 'password', email, password);

      if (authentication === 0) {
        // Authentication successful
        req.session.user_email = email;
        req.session.logged_in_user = true;
        req.session.logged_in_admin = false;

        return res.json({
          status: 'success-user',
          message: 'redirect to users page'
        });
      } else if (authentication === 1) {
        // Wrong password
        return res.status(400).json({
          status: 'error',
          message: 'Wrong Password'
        });
      } else if (authentication === 2) {
        // User not found
        return res.status(400).json({
          status: 'error',
          message: 'User does not exist'
        });
      }
    } else if (action === 'login-as-admin') {
      // Admin login
      const authentication = database.authenticateUser('admins', 'email', 'password', email, password);

      if (authentication === 0) {
        // Authentication successful
        req.session.user_email = email;
        req.session.logged_in_user = false;
        req.session.logged_in_admin = true;

        return res.json({
          status: 'success-admin',
          message: 'redirect to admin page'
        });
      } else if (authentication === 1) {
        // Wrong password
        return res.status(400).json({
          status: 'error',
          message: 'Wrong Password'
        });
      } else if (authentication === 2) {
        // User not found
        return res.status(400).json({
          status: 'error',
          message: 'User does not exist'
        });
      }
    } else {
      // Invalid action
      return res.status(400).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Helper function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = router;