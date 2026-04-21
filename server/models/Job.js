const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Title is too long"],
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Faculty",
          "Research",
          "Administration",
          "Staff",
          "Postdoc",
          "Adjunct",
          "Student Affairs",
          "Library",
          "Information Technology",
          "Athletics",
          "Development",
          "Communications",
          "Finance",
          "Human Resources",
          "Facilities",
          "Admissions",
          "Registrar",
          "Health Services",
          "Counseling",
          "Dining Services",
          "Other",
        ],
        message: "Invalid category",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salaryMin: {
      type: Number,
      min: [0, "salaryMin cannot be negative"],
    },
    salaryMax: {
      type: Number,
      min: [0, "salaryMax cannot be negative"],
      validate: {
        validator: function (v) {
          return v == null || this.salaryMin == null || v >= this.salaryMin;
        },
        message: "salaryMax must be >= salaryMin",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 10000,
    },
    qualifications: {
      type: String,
      maxlength: 5000,
    },
    deadline: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", institution: "text" });

module.exports = mongoose.model("Job", jobSchema);
