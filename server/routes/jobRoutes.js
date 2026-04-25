const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const validateObjectId = require("../middleware/validateObjectId");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// Public — anyone can browse jobs
router.get("/", getJobs);
router.get("/:id", validateObjectId("id"), getJobById);

// Protected — only recruiters create jobs; recruiters/admins can update/delete (ownership enforced in controller)
router.post("/", verifyToken, requireRole("recruiter"), createJob);
router.put("/:id", verifyToken, requireRole("recruiter", "admin"), validateObjectId("id"), updateJob);
router.delete("/:id", verifyToken, requireRole("recruiter", "admin"), validateObjectId("id"), deleteJob);

module.exports = router;
