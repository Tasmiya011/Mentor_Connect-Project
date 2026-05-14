import express from "express";
import { createTask, getTasksForMentor, getTasksForStudent, updateTask } from "../controllers/progressController.js";
const router = express.Router();

router.post("/", createTask);
router.get("/mentor/:mentorId", getTasksForMentor);
router.get("/student/:studentId", getTasksForStudent);
router.put("/:id", updateTask);

export default router;