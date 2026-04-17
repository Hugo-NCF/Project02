const Notification = require("../models/Notification");

// GET /api/notifications
async function getNotifications(req, res, next) {
  try {
    const { type, read, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (type && type !== "all") filter.type = type;
    if (read === "true") filter.read = true;
    if (read === "false") filter.read = false;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Notification.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    next(err);
  }
}

// POST /api/notifications
async function createNotification(req, res, next) {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/:id/read
async function markRead(req, res, next) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

// POST /api/notifications/mark-all-read
async function markAllRead(req, res, next) {
  try {
    const result = await Notification.updateMany({ read: false }, { read: true });
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/notifications/:id
async function dismissNotification(req, res, next) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification dismissed", id: notification._id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  createNotification,
  markRead,
  markAllRead,
  dismissNotification,
};
