import express from "express";
import { 
  getMentors, 
  createMentor, 
  getMentor, 
  getVolunteerMentors 
} from "../controllers/mentorController.js";

const router = express.Router();

router.get("/", getMentors);
router.post("/", createMentor);
router.get("/:id", getMentor);
router.get("/volunteer", getVolunteerMentors);

export default router;   // ← THIS LINE IS CRUCIAL