const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate");

// Register user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: "Insufficient data provided",
      });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // create a new user
      const newUser = new User({ email, password: hashedPassword });

      const response = await newUser.save();
      return res.status(201).json({
        status: true,
        user: response,
        message: "Registration successfull, Please login.",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message:
          err.code === 11000
            ? "User already exists, please login"
            : "Sign up error, please try again!",
        err: err,
      });
    }
  }
);

// Login user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: "Insufficient data provided",
      });
    }

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials" });
      }

      // Generate JWT token
      // for simplicity and demo purpose we are using secret,
      // we should use key pair for a production grade app
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );

      // Set the token in an HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
        secure: true,
        path: "/",
      });

      return res.status(200).json({
        status: true,
        user: { email: user.email, userId: user._id },
        message: "Logged in successfully",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again" });
    }
  }
);

// Verify token
router.get("/verify", authenticate, async (req, res) => {
  const user = req.user;
  delete user.exp;
  delete user.iat;

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });

  // Set the token in an HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
    secure: true,
    path: "/",
  });

  return res
    .status(200)
    .json({ status: true, user, message: "User verified successfully" });
});

// logout
router.get("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res.status(200).json({ status: true, message: "Logout successfull" });
});

module.exports = router;
