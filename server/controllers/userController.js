const User = require("../models/User");

async function createUser(req, res, next) {
  try {
    const { name, email, role, profile } = req.body;

    // Upsert: if verifyToken already created the user as "seeker" during the
    // registration race condition, this corrects the role to what the client sent.
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          role,
          ...(profile ? { profile } : {}),
          ...(role === "recruiter" ? { recruiterStatus: "pending" } : {}),
        },
        $setOnInsert: { email },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function getUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { name, role, profile, isDisabled } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, profile, isDisabled },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", id: user._id });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
};
