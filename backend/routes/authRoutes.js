const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sendLoginVerificationEmail } = require("../utils/emailService");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const createSessionToken = (email) =>
  jwt.sign(
    { email, type: "session" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

// SEND LOGIN LINK (Verification Flow)
router.post("/send-link", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    // create verification token
    const token = jwt.sign(
      { email, type: "verify" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // verification link
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, "");
    const verifyLink = `${frontendUrl}/verify/${token}`;
    
    // send mail via EmailJS
    await sendLoginVerificationEmail(email, verifyLink);

    return res.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });

  } catch (err) {
    console.error("Send Link Error:", err.message);
    return res.status(500).json({
      success: false,
      message: `Email Error: ${err.message}`,
    });
  }
});

// VERIFY LOGIN
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "verify") {
      return res.status(400).json({ success: false, message: "Invalid token type" });
    }

    const sessionToken = createSessionToken(decoded.email);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    return res.json({
      success: true,
      email: decoded.email,
      token: sessionToken,
      expiresAt,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

module.exports = router;