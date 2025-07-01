const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const clipboardRoutes = require("./routes/clipboards");
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// API Routes
app.use("/api/clipboards", clipboardRoutes);

// Serve frontend build
const path = require("path");
const __dirnamePath = path.resolve();

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirnamePath, "../frontend/dist")));

// All other routes → index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
