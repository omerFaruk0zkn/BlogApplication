const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllBlogs,
  deleteBlog,
  approveComment,
  getAllComments,
  deleteComment,
  updateUserRole,
  getDashboardStats,
  getTrendReports,
  getTimeBasedStats,
  approveBlog,
  filteredBlogs,
  filteredComments,
} = require("../controllers/adminController");
const {
  authenticateUser,
  authenticateAdmin,
} = require("../middleware/authMiddleware");

router.get("/users", authenticateUser, authenticateAdmin, getAllUsers);
router.delete("/users/:id", authenticateUser, authenticateAdmin, deleteUser);
router.patch(
  "/users/:id/role",
  authenticateUser,
  authenticateAdmin,
  updateUserRole
);
router.get("/blogs", authenticateUser, authenticateAdmin, getAllBlogs);
router.delete("/blogs/:id", authenticateUser, authenticateAdmin, deleteBlog);
router.get("/comments", authenticateUser, authenticateAdmin, getAllComments);
router.delete(
  "/comments/:id",
  authenticateUser,
  authenticateAdmin,
  deleteComment
);
router.patch(
  "/blogs/:blogId/approve",
  authenticateUser,
  authenticateAdmin,
  approveBlog
);
router.patch(
  "/comments/:commentId/approve",
  authenticateUser,
  authenticateAdmin,
  approveComment
);
router.get(
  "/dashboard/stats",
  authenticateUser,
  authenticateAdmin,
  getDashboardStats
);
router.get(
  "/dashboard/trends",
  authenticateUser,
  authenticateAdmin,
  getTrendReports
);
router.get(
  "/dashboard/activity",
  authenticateUser,
  authenticateAdmin,
  getTimeBasedStats
);
router.get("/filter/blogs", authenticateUser, authenticateAdmin, filteredBlogs);
router.get(
  "/filter/comments",
  authenticateUser,
  authenticateAdmin,
  filteredComments
);

module.exports = router;
