const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

// Register user
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: 'Insufficient data provided',
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user with same email exists
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({
          status: false,
          message: 'User already exists, please login',
        });

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // create a new user
      const newUser = new User({ email, password: hashedPassword });
      const response = await newUser.save();
      return res.status(201).json({
        status: true,
        user: response,
        message: 'Registration successfull, Please login.',
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Something went wrong, please try again!',
      });
    }
  }
);

// Login user
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: 'Insufficient data provided',
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: 'Invalid credentials' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ status: false, message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });
      return res
        .status(200)
        .json({ status: true, token, message: 'Logged in successfully' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }
);

// Verify token
router.get('/verify', authenticate, async (req, res) => {
  return res.status(200).json({ status: true, auth: true });
});

module.exports = router;
