const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    applicantId: {
      type: String,
      required: [true, "Applicant ID is required"],
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
      trim: true,
    },
    coverLetter: {
      type: String,
      maxlength: [5000, "Cover letter is too long"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "reviewed", "interviewing", "rejected", "accepted"],
        message: "Invalid application status",
      },
      default: "pending",
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications per user per job
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
