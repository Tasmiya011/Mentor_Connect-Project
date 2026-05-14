import express from "express";
import { matchMentorForStudent } from "../controllers/mentorMatchController.js";

const router = express.Router();
router.post("/match", matchMentorForStudent);

export default router;