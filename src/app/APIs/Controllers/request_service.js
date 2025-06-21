const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const DatabaseHandler = require('../Models/DatabaseHandler');
const Order = require('../Models/Order');

// Set CORS headers to match the original PHP file
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.17:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS request
router.options('/request_service', (req, res) => {
  res.status(200).end();
});

// Handle POST request
router.post('/request_service', (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_email) {
      return res.status(401).json({
        status: 'error',
        message: 'User not logged in'
      });
    }

    // Check if the email in the session matches the one in the request
    if (req.session.user_email !== req.body.email) {
      return res.status(403).json({
        status: 'error',
        message: 'This is not your email'
      });
    }

    // Initialize database handler
    const dbHandler = new DatabaseHandler();

    // Create order object
    const order = new Order();
    order.setEmail(req.body.email);
    order.setServiceDescription(req.body.service_description);
    order.setServiceType(req.body.service_type);

    // Add order to database
    const result = order.addToDB(dbHandler);

    if (result === 0) {
      // Order added successfully, now send email

      // Setup nodemailer transporter
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'internova.official@gmail.com',
          pass: 'ozps yvxc kepw caxa' // Note: This is the same as the PHP code, but in production, use environment variables
        }
      });

      // Use a try-catch for the email sending
      transporter.sendMail({
        from: 'internova.official@gmail.com',
        to: req.body.email,
        subject: 'Your Service Request Confirmation',
        html: `
          <h1>Thank You for Your Submission!</h1>
          <p>Hello ${order.getName()},</p>
          <p>We have received your service request and will get back to you shortly.</p>
          <p><strong>Service Type:</strong> ${order.getServiceType()}</p>
          <p><strong>Service Description:</strong> ${order.getServiceDescription()}</p>
          <p>Best regards,<br>Strategy Solutions</p>
        `
      }).then(() => {
        // Email sent successfully
        res.status(200).json({
          status: 'success'
        });
      }).catch((error) => {
        console.error('Error sending email:', error);
        res.status(500).json({
          status: 'error',
          message: 'Failed to send email'
        });
      });

    } else if (result === 1) {
      res.status(500).json({
        status: 'error',
        message: 'Database error'
      });
    } else if (result === 2) {
      res.status(400).json({
        status: 'error',
        message: 'User is not registered'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Unknown error'
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