import express from "express";
import { createSubmission, getSubmissionsForMentor, getSubmissionsForStudent, reviewSubmission } from "../controllers/submissionController.js";
const router = express.Router();

router.post("/", createSubmission);
router.get("/mentor/:mentorId", getSubmissionsForMentor);
router.get("/student/:studentId", getSubmissionsForStudent);
router.put("/:id/review", reviewSubmission);

export default router;