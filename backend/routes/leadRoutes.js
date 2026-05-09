const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const leadController = require("../controllers/leadController");

// 🛡️ ABUSE PROTECTION: Rate Limiting
// Limits each IP to 5 requests per 15 minutes for the lead capture endpoint
// This prevents automated bots from spamming the DB and racking up LLM/Email API costs.
const leadSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: { success: false, message: "Too many audit requests from this IP, please try again after 15 minutes" },
});

// POST /api/leads/create
// Creates a new lead, runs the audit engine, generates AI summary, and returns the share URL
router.post("/create", leadSubmitLimiter, leadController.createLead);

// GET /api/leads/share/:shareId
// Fetches the anonymized public audit details
router.get("/share/:shareId", leadController.getSharedAudit);

module.exports = router;
