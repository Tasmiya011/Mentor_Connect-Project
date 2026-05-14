import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// POST: Assign a mentor to a student
router.post("/", async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { mentorId },
      { new: true }
    ).populate("mentorId", "name dept exp email");

    res.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cannot assign mentor" });
  }
});

// GET all with populated mentor
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("mentorId", "name dept exp email");
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
