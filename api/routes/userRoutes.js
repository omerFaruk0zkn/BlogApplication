const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserBlogs,
  getUserComments,
  addProfileImage,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/profileMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile", authenticateUser, updateUserProfile);
router.get("/profile/my-blogs", authenticateUser, getUserBlogs);
router.get("/profile/my-comments", authenticateUser, getUserComments);
router.post(
  "/profile/upload/profile-image",
  authenticateUser,
  upload.single("profileImage"),
  addProfileImage
);

module.exports = router;
