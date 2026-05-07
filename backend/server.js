const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/audit", auditRoutes);
app.use("/api/ai", require("./routes/aiRoutes"));
// test route
app.get("/", (req, res) => {
  res.send("Audit AI Backend Running 🚀");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server Running Successfully`);
  console.log(`👉 Local: http://localhost:${PORT}`);
  console.log(`👉 API Base: http://localhost:${PORT}/api`);
  console.log("=================================");
});