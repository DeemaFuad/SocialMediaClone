const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
const router = express.Router();
const verifyToken = require("../verifyToken");  // ✅ Ensure this path is correct


// User login (Sign In) route
router.post("/", async (req, res) => {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      console.log("Missing credentials");
      return res.status(400).json({
        message: "Missing credentials",
        received: { username, password: password ? "present" : "missing" },
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password); // Compare with hashed password
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",  // Ensure a secure secret key in production
      { expiresIn: "24h" }  // 24-hour expiration
    );

    console.log("Login successful, token generated");
    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});



module.exports = router;
