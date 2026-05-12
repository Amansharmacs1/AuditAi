const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// middleware


const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/audit", auditRoutes);
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
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
