import express from "express";
import {
  createMeeting,
  getMeetingsByMentor,
  getMeetingsByStudent,
  getMeetingSummary
} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/", createMeeting);
router.get("/mentor/:id", getMeetingsByMentor);
router.get("/student/:id", getMeetingsByStudent);
router.get("/:id/summary", getMeetingSummary);

export default router;