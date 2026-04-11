const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", validateObjectId("id"), getUserById);
router.put("/:id", validateObjectId("id"), updateUser);
router.delete("/:id", validateObjectId("id"), deleteUser);

module.exports = router;
