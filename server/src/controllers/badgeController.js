import Student from "../models/Student.js";

export const awardBadge = async (req, res) => {
  try {
    const { studentId, badge } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!student.badges.includes(badge)) {
      student.badges.push(badge);
      await student.save();
    }
    res.json({ message: `Badge "${badge}" awarded`, badges: student.badges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};