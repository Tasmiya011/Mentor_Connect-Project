import express from "express";
import { submitFeedback, getTrustScore } from "../controllers/feedbackController.js";
const router = express.Router();

router.post("/", submitFeedback);
router.get("/:model/:userId", getTrustScore);

export default router;