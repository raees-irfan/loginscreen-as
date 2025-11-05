const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/user.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

// Regular user routes (authenticated users - can manage their own profile)
router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);
router.delete("/me", authenticate, deleteMyProfile);

// Admin routes (admin only)
router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/:id", authenticate, isAdmin, getUserById);
router.post("/", authenticate, isAdmin, addUser);
router.put("/:id", authenticate, isAdmin, updateUser);
router.delete("/:id", authenticate, isAdmin, deleteUser);

module.exports = router;

