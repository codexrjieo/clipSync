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
const __dirnamePath = path.resolve();
const frontendPath = path.join(__dirnamePath, "../frontend/dist");

app.use(express.static(frontendPath));

// Only send index.html for non-API and non-static routes
app.get("*", (req, res) => {
  const requestedPath = path.join(frontendPath, req.path);

  // If the file exists, serve it directly
  if (fs.existsSync(requestedPath)) {
    res.sendFile(requestedPath);
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
