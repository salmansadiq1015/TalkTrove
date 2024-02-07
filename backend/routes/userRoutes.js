import express from "express";
import {
  UpdateUser,
  allUser,
  deleteUser,
  loginUser,
  registerUser,
  searchUser,
  singleUser,
} from "../controllers/userController.js";
import { requireSignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create User:
router.post("/register", registerUser);
// Login
router.post("/login", loginUser);
// Update Profile
router.put("/update-user", UpdateUser);
// All Users
router.get("/all-users", allUser);
// Delete User
router.delete("/delete-user", deleteUser);
// Single User
router.get("/single-user/:id", singleUser);

// Search User
router.get("/searchUser?", requireSignin, searchUser);

export default router;
