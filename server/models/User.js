const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [120, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w.+-]+@[\w-]+\.[\w.-]+$/, "Invalid email address"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: {
        values: ["seeker", "recruiter", "admin"],
        message: "Role must be seeker, recruiter, or admin",
      },
      default: "seeker",
    },
    profile: {
      phone: { type: String, trim: true },
      bio: { type: String, maxlength: 2000 },
      company: { type: String, trim: true },
      resumeUrl: { type: String, trim: true },
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    // Recruiter approval flow — set to "pending" when creating recruiter accounts
    recruiterStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
