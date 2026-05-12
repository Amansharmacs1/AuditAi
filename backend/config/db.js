const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB Error ❌", err.message);
    // Don't exit on connection failure - allow server to start
    // This helps with debugging on Render
    console.error("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;