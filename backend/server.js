const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs"); // ✅ YOU FORGOT TO IMPORT THIS
require("dotenv").config();

const clipboardRoutes = require("./routes/clipboards");
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Backend API routes
app.use("/api/clipboards", clipboardRoutes);

// ✅ Serve Frontend (Vite Build)
const __dirnamePath = path.resolve();
const frontendPath = path.join(__dirnamePath, "../frontend/dist");

app.use(express.static(frontendPath));

// ✅ Handle React Routes for Direct Access like /clip/rohit
app.get("*", (req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
