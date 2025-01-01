const express = require("express");
const {
  authenticateUser,
  authenticateAdmin,
} = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getPopularComments,
  getAllComments,
} = require("../controllers/commentController");
const router = express.Router();

router.post("/", authenticateUser, addComment);
router.get("/", getAllComments);
router.get("/:blogId", getCommentsByBlog);
router.put("/:id", authenticateUser, updateComment);
router.delete("/:id", authenticateUser, deleteComment);
router.put("/:id/like", authenticateUser, likeComment);
router.put("/:id/dislike", authenticateUser, dislikeComment);
router.get("/:blogId/popular", getPopularComments);

module.exports = router;
