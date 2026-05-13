const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sendLoginVerificationEmail, sendPasswordResetEmail } = require("../utils/emailService");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const createSessionToken = (email) =>
  jwt.sign(
    { email, type: "session" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

const createResetToken = (email) =>
  jwt.sign(
    { email, type: "reset" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );


// QUICK LOGIN (Direct Email Entry)
// Warning: This bypasses email verification for simplicity/free-tier constraints.
router.post("/quick-login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const token = createSessionToken(email);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    return res.json({
      success: true,
      token,
      email,
      expiresAt,
      hasPassword: Boolean(user.passwordHash),
      message: "Successfully logged in"
    });
  } catch (err) {
    console.error("Quick Login Error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// SEND LOGIN LINK
router.post("/send-link", async (req, res) => {

  try {

    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // find user
    let user = await User.findOne({ email });

    // create if not exists
    if (!user) {
      user = await User.create({ email });
    }

    // create token
    const token = jwt.sign(
      { email, type: "verify" },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // verification link
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, "");
    const verifyLink = `${frontendUrl}/verify/${token}`;
    // send mail
    await sendLoginVerificationEmail(email, verifyLink);

    return res.json({
      success: true,
      message: "Verification email sent",
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
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    // verify link token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.type && decoded.type !== "verify") {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    const user = await User.findOne({ email: decoded.email });
    const sessionToken = createSessionToken(decoded.email);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    return res.json({
      success: true,
      email: decoded.email,
      token: sessionToken,
      expiresAt,
      hasPassword: Boolean(user?.passwordHash),
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
});

// LOGIN WITH PASSWORD
router.post("/login-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: "Password not set. Verify email once first.",
      });
    }

    const isValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createSessionToken(email);

    return res.json({
      success: true,
      token,
      email,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// SET/UPDATE PASSWORD (requires active session)
router.post("/set-password", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email: req.user.email },
      { passwordHash: hash },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password saved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// SEND RESET PASSWORD LINK
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // Prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message:
          "If the email exists, a reset link has been sent.",
      });
    }

    const resetToken = createResetToken(email);
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, "");
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    // send mail
    await sendPasswordResetEmail(email, resetLink);

    return res.json({
      success: true,
      message:
        "If the email exists, a reset link has been sent.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// RESET PASSWORD USING TOKEN
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.type !== "reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { passwordHash: hash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Password reset successful. Please login with new password.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }
});

module.exports = router;