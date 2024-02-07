import express from "express";
import {
  createMessages,
  getMessages,
} from "../controllers/messageController.js";
import { requireSignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Messages
router.post("/create-messages", requireSignin, createMessages);
// Display all messages
router.get("/get-messages/:id", getMessages);

export default router;
