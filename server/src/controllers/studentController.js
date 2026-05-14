import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

// Get all students (with mentor populated)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("mentorId", "name email expertise exp");
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get single student by ID
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("mentorId", "name email expertise exp");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating student" });
  }
};

// Update student (for interests, profile, etc.)
export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// (Optional) If you need a legacy getStudents, keep it but ensure no conflict.
export const getStudents = getAllStudents; // alias if needed