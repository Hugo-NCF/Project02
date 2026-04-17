const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications — submit an application
async function createApplication(req, res, next) {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

    // Validate job exists and is active
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.status !== "active") {
      return res.status(400).json({ error: "This position is no longer accepting applications" });
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ error: "The application deadline has passed" });
    }

    // Check for duplicate
    const existing = await Application.findOne({
      jobId,
      applicantId: req.user.uid,
    });
    if (existing) {
      return res.status(409).json({ error: "You have already applied for this position" });
    }

    // If file was uploaded via multer, use that path
    const finalResumeUrl = req.file
      ? `/uploads/${req.file.filename}`
      : resumeUrl;

    if (!finalResumeUrl) {
      return res.status(400).json({ error: "Resume is required" });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.uid,
      resumeUrl: finalResumeUrl,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/my — get current user's applications
async function getMyApplications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = { applicantId: req.user.uid };

    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate("jobId")
        .sort({ dateApplied: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Application.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/job/:jobId — get applications for a specific job (recruiter)
async function getApplicationsByJob(req, res, next) {
  try {
    const { jobId } = req.params;

    // Verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (String(job.recruiterId) !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ error: "You don't have access to this job's applications" });
    }

    const items = await Application.find({ jobId }).sort({ dateApplied: -1 });

    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/applications/:id/status — update application status (recruiter/admin)
async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("jobId");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Only the job's recruiter or admin can update status
    const job = application.jobId;
    if (String(job.recruiterId) !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/check/:jobId — check if current user already applied
async function checkApplication(req, res, next) {
  try {
    const existing = await Application.findOne({
      jobId: req.params.jobId,
      applicantId: req.user.uid,
    });
    res.json({ applied: !!existing });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  checkApplication,
};
