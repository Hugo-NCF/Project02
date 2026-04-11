const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", validateObjectId("id"), getJobById);
router.put("/:id", validateObjectId("id"), updateJob);
router.delete("/:id", validateObjectId("id"), deleteJob);

module.exports = router;
