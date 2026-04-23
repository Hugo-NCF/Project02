const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validateObjectId = require("../middleware/validateObjectId");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", createUser);
router.get("/me", verifyToken, getMe);
router.get("/", getUsers);
router.get("/:id", validateObjectId("id"), getUserById);
router.put("/:id", validateObjectId("id"), updateUser);
router.delete("/:id", validateObjectId("id"), deleteUser);

module.exports = router;
