const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    // Firebase UID (string) — compatible with both mock auth and real Firebase
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "jobId is required"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
