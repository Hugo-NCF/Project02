const Job = require("../models/Job");

async function createJob(req, res, next) {
  try {
    // Always derive recruiterId from the verified token — never trust the client
    const { recruiterId: _ignored, ...payload } = req.body;
    const job = await Job.create({ ...payload, recruiterId: req.user.uid });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

async function getJobs(req, res, next) {
  try {
    const { q, category, location, status, recruiterId, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (status) filter.status = status;
    if (recruiterId) filter.recruiterId = recruiterId;
    if (q) filter.$text = { $search: q };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [items, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Job.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    next(err);
  }
}

async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const existing = await Job.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Job not found" });

    // Owner-or-admin check — recruiters can only edit their own jobs
    const isOwner = String(existing.recruiterId) === String(req.user.uid);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden: you do not own this job" });
    }

    // Don't allow recruiterId to be changed via update
    const { recruiterId: _ignored, ...payload } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const existing = await Job.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Job not found" });

    const isOwner = String(existing.recruiterId) === String(req.user.uid);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden: you do not own this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted", id: existing._id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
