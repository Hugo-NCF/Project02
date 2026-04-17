const express = require("express");
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} = require("../controllers/bookmarkController");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// Bookmarks require a logged-in seeker
router.use(verifyToken, requireRole("seeker"));

// Note: /check/:jobId must come before /:jobId to avoid param collision
router.get("/",                                          getBookmarks);
router.post("/",                                         addBookmark);
router.get("/check/:jobId", validateObjectId("jobId"),   checkBookmark);
router.delete("/:jobId",    validateObjectId("jobId"),   removeBookmark);

module.exports = router;
