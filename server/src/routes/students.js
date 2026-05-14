import express from "express";
import {
  getStudents,
  createStudent,
  getStudent,
  getAllStudents,
  updateStudent           // ← add this
} from "../controllers/studentController.js";
import { assignMentorToStudent } from "../controllers/assignController.js";
import { awardBadge } from "../controllers/badgeController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.post("/", createStudent);
router.post("/:id/award-badge", awardBadge);
router.get("/:id", getStudent);
router.put("/:id", updateStudent);          // ← for interests & profile
router.put("/:id/assign", assignMentorToStudent);

export default router;