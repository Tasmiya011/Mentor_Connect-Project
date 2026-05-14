import express from "express";
import { sendMessage, getConversation, markAsRead } from "../controllers/messageController.js";
const router = express.Router();

router.post("/", sendMessage);
router.get("/:userId/:otherUserId", getConversation);
router.put("/read/:userId", markAsRead);

export default router;