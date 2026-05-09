const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    teamSize: {
      type: String, // e.g. "1-10", "11-50", "51-200", "200+"
      default: "",
    },
    tools: [
      {
        tool: String,
        plan: String,
        cost: Number,
        seats: Number,
        totalCost: Number,
      },
    ],
    totalSpend: {
      type: Number,
      default: 0,
    },
    totalSavings: {
      type: Number,
      default: 0,
    },
    recommendations: [
      {
        tool: String,
        action: String,
        savings: Number,
        reason: String,
      },
    ],
    aiSummary: {
      type: String,
      default: "",
    },
    publicShareId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
