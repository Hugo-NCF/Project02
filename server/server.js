require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const path = require("path");

// Ensure uploads directory exists (multer crashes on first upload if missing)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded resumes
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "campus-careers-api" });
});

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5050;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Campus Careers API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
