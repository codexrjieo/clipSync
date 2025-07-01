const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const clipboardRoutes = require("./routes/clipboards");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/clipboards", clipboardRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

const __dirnamePath = path.resolve();

app.use(express.static(path.join(__dirnamePath, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "../frontend/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
