const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  tool: String,
  plan: String,
  cost: Number,
  seats: Number,
  totalCost: Number,
});

const auditSchema = new mongoose.Schema({
  tools: [toolSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audit", auditSchema);