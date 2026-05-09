const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  tool: String,
  plan: String,
  cost: Number,
  seats: Number,
  totalCost: Number,
  
});


const auditSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },

    tools: [
      {
        tool: String,
        plan: String,
        cost: Number,
        seats: Number,
        totalCost: Number
      },
    ],
    
    totalSavings: {
      type: Number,
      default: 0
    },

    recommendations: [
      {
        tool: String,
        action: String,
        savings: Number,
        reason: String
      }
    ],

    summary: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Audit",
  auditSchema
);