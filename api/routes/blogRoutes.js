const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getRecommendedBlogs,
  toggleLike,
  getPersonalizedBlogs,
  getBlogsByCategory,
  searchBlogs,
} = require("../controllers/blogController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateUser, createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", authenticateUser, updateBlog);
router.delete("/:id", authenticateUser, deleteBlog);
router.put("/:blogId/like", authenticateUser, toggleLike);
router.get("/trending/blogs", getTrendingBlogs);
router.get("/recommended/blogs", authenticateUser, getRecommendedBlogs);
router.get("/personalized/blogs", authenticateUser, getPersonalizedBlogs);
router.get("/filter/:categoryId", getBlogsByCategory);
router.get("/search/blogs", searchBlogs);

module.exports = router;
