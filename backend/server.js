const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs"); // ✅ ADD THIS
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
    useNewUrlParser: true, // ✅ Optional in latest Mongoose
    useUnifiedTopology: true, // ✅ Optional in latest Mongoose
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// API Routes
app.use("/api/clipboards", clipboardRoutes);

// Serve frontend build
const __dirnamePath = path.resolve(); // current absolute path
const frontendPath = path.join(__dirnamePath, "../frontend/dist");

// Serve static files from frontend
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for client-side routing
app.get("*", (req, res) => {
  const requestedPath = path.join(frontendPath, req.path);

  if (fs.existsSync(requestedPath)) {
    res.sendFile(requestedPath);
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
