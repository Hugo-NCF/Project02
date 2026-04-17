const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["flag", "new_user", "new_job", "application", "system", "recruiter_approval"],
      default: "system",
    },
    icon: {
      type: String,
      default: "notifications",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      maxlength: 2000,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Optional reference to the related document (a User or Job)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedModel: {
      type: String,
      enum: ["User", "Job", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
