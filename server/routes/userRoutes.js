const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validateObjectId = require("../middleware/validateObjectId");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// POST /users is the post-registration sync — must come from an authenticated Firebase session
router.post("/", verifyToken, createUser);

// Current user — any authenticated user
router.get("/me", verifyToken, getMe);

// Admin-only — listing users is sensitive (PII)
router.get("/", verifyToken, requireRole("admin"), getUsers);
router.get("/:id", verifyToken, requireRole("admin"), validateObjectId("id"), getUserById);

// Update / delete — owner-or-admin (enforced in controller)
router.put("/:id", verifyToken, validateObjectId("id"), updateUser);
router.delete("/:id", verifyToken, validateObjectId("id"), deleteUser);

module.exports = router;
