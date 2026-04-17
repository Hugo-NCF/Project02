const express = require("express");
const {
  getAdminUsers,
  getPendingRecruiters,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  approveRecruiter,
  rejectRecruiter,
  getAdminJobs,
  updateAdminJob,
  deleteAdminJob,
} = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole("admin"));

// ── User Management ────────────────────────────────────────────────────────
// Note: /pending-recruiters must come before /:id to avoid param collision
router.get("/users/pending-recruiters", getPendingRecruiters);
router.get("/users",                                     getAdminUsers);
router.get("/users/:id",    validateObjectId("id"),      getAdminUser);
router.patch("/users/:id",  validateObjectId("id"),      updateAdminUser);
router.delete("/users/:id", validateObjectId("id"),      deleteAdminUser);

// ── Recruiter Approval Flow ────────────────────────────────────────────────
router.post("/users/:id/approve", validateObjectId("id"), approveRecruiter);
router.post("/users/:id/reject",  validateObjectId("id"), rejectRecruiter);

// ── Job Management ─────────────────────────────────────────────────────────
router.get("/jobs",               getAdminJobs);
router.patch("/jobs/:id", validateObjectId("id"), updateAdminJob);
router.delete("/jobs/:id", validateObjectId("id"), deleteAdminJob);

module.exports = router;
