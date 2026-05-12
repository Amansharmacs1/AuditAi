const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// middleware
const safeFrontendOrigin = (() => {
  try {
    if (!process.env.FRONTEND_URL) return null;
    return new URL(process.env.FRONTEND_URL).origin;
  } catch (err) {

    console.warn('Invalid FRONTEND_URL:', process.env.FRONTEND_URL);

    return null;
  }
})();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',

  safeFrontendOrigin,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true
}));

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
