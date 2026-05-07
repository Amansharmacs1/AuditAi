const express = require("express");
const router = express.Router();
const Audit = require("../models/Audit");

// 🟢 POST - Save full audit session
router.post("/", async (req, res) => {
  try {
    const { tools } = req.body;

    const enrichedTools = tools.map((t) => ({
      ...t,
      totalCost: t.cost * t.seats,
    }));

    const newAudit = new Audit({
      tools: enrichedTools,
    });

    const saved = await newAudit.save();

    res.status(201).json({
      success: true,
      message: "Audit saved successfully 🚀",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving data",
      error: error.message,
    });
  }
});

// 🟢 GET - fetch all audits
router.get("/", async (req, res) => {
  try {
    const data = await Audit.find();

    const formatted = data.map((item) => ({
      id: item._id,
      tools: item.tools,
      totalSessionCost: item.tools.reduce(
        (sum, t) => sum + t.totalCost,
        0
      ),
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
});



router.get("/latest", async (req, res) => {
  try {
    const latest = await Audit.findOne().sort({ _id: -1 });

    res.json({
      success: true,
      data: latest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 DELETE - clear all
router.delete("/", async (req, res) => {
  try {
    await Audit.deleteMany();
    res.json({
      success: true,
      message: "All data deleted 🧹",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting data",
      error: error.message,
    });
  }
});

module.exports = router;