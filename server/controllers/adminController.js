const User = require("../models/User");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { sendEmail, recruiterApprovedEmail, recruiterRejectedEmail } = require("../utils/email");

// ── Users ──────────────────────────────────────────────────────────────────

// GET /api/admin/users
async function getAdminUsers(req, res, next) {
  try {
    const { role, q, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (role && role !== "all") filter.role = role;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      User.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/pending-recruiters
async function getPendingRecruiters(req, res, next) {
  try {
    const users = await User.find({
      role: "recruiter",
      recruiterStatus: "pending",
    }).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id
async function getAdminUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id
async function updateAdminUser(req, res, next) {
  try {
    const { name, role, isDisabled, recruiterStatus, profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isDisabled, recruiterStatus, profile },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteAdminUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", id: user._id });
  } catch (err) {
    next(err);
  }
}

// ── Recruiter Approval Flow ────────────────────────────────────────────────

// POST /api/admin/users/:id/approve
async function approveRecruiter(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { recruiterStatus: "approved" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    await Notification.create({
      type: "recruiter_approval",
      icon: "verified_user",
      title: `Recruiter Approved: ${user.name}`,
      body: `${user.name} (${user.email}) has been approved and can now post job listings.`,
      relatedId: user._id,
      relatedModel: "User",
    });

    const { subject, html, text } = recruiterApprovedEmail(user.name);
    await sendEmail({ to: user.email, subject, html, text });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users/:id/reject
async function rejectRecruiter(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { recruiterStatus: "rejected" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    await Notification.create({
      type: "recruiter_approval",
      icon: "person_off",
      title: `Recruiter Rejected: ${user.name}`,
      body: `${user.name} (${user.email})'s recruiter application has been rejected.`,
      relatedId: user._id,
      relatedModel: "User",
    });

    const { subject, html, text } = recruiterRejectedEmail(user.name);
    await sendEmail({ to: user.email, subject, html, text });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// ── Jobs ───────────────────────────────────────────────────────────────────

// GET /api/admin/jobs
async function getAdminJobs(req, res, next) {
  try {
    const { status, q, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { institution: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

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

// PATCH /api/admin/jobs/:id
async function updateAdminJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/jobs/:id
async function deleteAdminJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted", id: job._id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
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
};
