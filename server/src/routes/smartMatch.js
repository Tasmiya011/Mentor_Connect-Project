// routes/smartMatch.js
import express from "express";
import Mentor from "../models/Mentor.js";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/match", async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const interests = student.interests || [];
    if (interests.length === 0) {
      return res.status(400).json({ message: "Please set your interests first" });
    }

    // Find mentors whose expertise matches any interest
    const mentors = await Mentor.find({
      expertise: { $in: interests }
    });

    if (mentors.length === 0) {
      return res.status(404).json({ message: "No mentors found matching your interests" });
    }

    // Assign the first mentor (simplest logic)
    const selected = mentors[0];
    student.mentorId = selected._id;
    await student.save();

    res.json({
      message: `🎉 Great! We've connected you with ${selected.name}.`,
      mentor: selected
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during matching" });
  }
});

export default router;