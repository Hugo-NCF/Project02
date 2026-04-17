const Bookmark = require("../models/Bookmark");
const Job = require("../models/Job");

// GET /api/bookmarks  — current user's saved jobs
async function getBookmarks(req, res, next) {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.uid })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
}

// POST /api/bookmarks  — save a job { jobId }
async function addBookmark(req, res, next) {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const bookmark = await Bookmark.create({ userId: req.user.uid, jobId });
    await bookmark.populate("jobId");
    res.status(201).json(bookmark);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Job already bookmarked" });
    }
    next(err);
  }
}

// DELETE /api/bookmarks/:jobId  — unsave a job
async function removeBookmark(req, res, next) {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      userId: req.user.uid,
      jobId: req.params.jobId,
    });
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    res.json({ message: "Bookmark removed", jobId: req.params.jobId });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookmarks/check/:jobId  — check if job is saved
async function checkBookmark(req, res, next) {
  try {
    const exists = await Bookmark.exists({
      userId: req.user.uid,
      jobId: req.params.jobId,
    });
    res.json({ bookmarked: !!exists });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBookmarks, addBookmark, removeBookmark, checkBookmark };
