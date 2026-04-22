const express = require("express");
const {
  createApplication,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  checkApplication,
} = require("../controllers/applicationController");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validateObjectId = require("../middleware/validateObjectId");
const upload = require("../middleware/upload");

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Seeker: submit application (with optional file upload)
router.post("/", requireRole("seeker"), upload.fields([{ name: "resume", maxCount: 1 }, { name: "coverLetterFile", maxCount: 1 }]), createApplication);

// Seeker: get my applications
router.get("/my", requireRole("seeker"), getMyApplications);

// Seeker: check if already applied to a job
router.get("/check/:jobId", validateObjectId("jobId"), checkApplication);

// Recruiter/Admin: get applications for a specific job
router.get(
  "/job/:jobId",
  validateObjectId("jobId"),
  requireRole("recruiter", "admin"),
  getApplicationsByJob
);

// Recruiter/Admin: update application status
router.patch(
  "/:id/status",
  validateObjectId("id"),
  requireRole("recruiter", "admin"),
  updateApplicationStatus
);

module.exports = router;
