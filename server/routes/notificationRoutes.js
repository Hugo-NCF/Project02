const express = require("express");
const {
  getNotifications,
  createNotification,
  markRead,
  markAllRead,
  dismissNotification,
} = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// All notification routes require authentication + admin role
router.use(verifyToken, requireRole("admin"));

// Note: /mark-all-read must come before /:id to avoid param collision
router.get("/",                    getNotifications);
router.post("/",                   createNotification);
router.post("/mark-all-read",      markAllRead);
router.patch("/:id/read", validateObjectId("id"), markRead);
router.delete("/:id",     validateObjectId("id"), dismissNotification);

module.exports = router;
