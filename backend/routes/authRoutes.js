const express = require("express");
const dns = require('node:dns');
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
    // Manual DNS lookup to force IPv4
    const resolvedIp = await new Promise((resolve) => {
      dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
        resolve(address || '74.125.142.108'); // Fallback to a known Gmail SMTP IP
      });
    });

    // nodemailer config
    const transporter = nodemailer.createTransport({
      host: resolvedIp,
      port: 587,
      secure: false,
      servername: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
    });

    // send mail
    await transporter.sendMail({
      from: `"AuditAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AuditAI Login Verification",
      html: `
        <div style="font-family:sans-serif">
          <h2>Welcome to AuditAI 🚀</h2>
          <p>Click the button below to login.</p>
          <a href="${verifyLink}" style="background:#145DA0;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:10px;">
            Verify & Login
          </a>
          <p style="margin-top:20px">This link expires in 10 minutes.</p>
        </div>
      `,
    });

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

    // Manual DNS lookup
    const resolvedIp = await new Promise((resolve) => {
      dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
        resolve(address || '74.125.142.108');
      });
    });

    const transporter = nodemailer.createTransport({
      host: resolvedIp,
      port: 587,
      secure: false,
      servername: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AuditAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AuditAI Password Reset",
      html: `
        <div style="font-family:sans-serif">
          <h2>Reset your AuditAI password</h2>
          <p>Click the button below to set a new password.</p>
          <a href="${resetLink}" style="background:#145DA0;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:10px;">
            Reset Password
          </a>
          <p style="margin-top:20px">This link expires in 10 minutes.</p>
        </div>
      `,
    });

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