const User = require("../models/User");

async function createUser(req, res, next) {
  try {
    const { name, email, password, role, profile } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: `plain:${password}`,
      role,
      profile,
    });

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

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
