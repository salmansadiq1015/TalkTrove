import express from "express";
import {
  addUser,
  createChat,
  deleteGroup,
  fetchChat,
  groupChat,
  removeUser,
  renameGroup,
} from "../controllers/chatController.js";
import { requireSignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create chat message
router.post("/create-chat", requireSignin, createChat);

// Fetch Chat
router.get("/getChats/:id", fetchChat);

// Create Chat Room Controller(Group Chat)
router.post("/GroupChat", requireSignin, groupChat);

// Rename Group
router.put("/update-group", requireSignin, renameGroup);

// Remove User form group
router.put("/remove-user", removeUser);

// Add User to group
router.put("/add-user", addUser);

// Delete Group
router.delete("/delete-chatRoom/:id", deleteGroup);

export default router;
