const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authenticateAdmin,
} = require("../middleware/authMiddleware");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", getAllCategories);
router.post("/", authenticateUser, authenticateAdmin, createCategory);
router.put("/:id", authenticateUser, authenticateAdmin, updateCategory);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteCategory);

module.exports = router;
