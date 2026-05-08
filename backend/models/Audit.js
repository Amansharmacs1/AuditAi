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
      
      },
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