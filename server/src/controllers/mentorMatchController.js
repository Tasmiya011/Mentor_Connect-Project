import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

export const matchMentorForStudent = async (req, res) => {
  const { studentId } = req.body;
  console.log("Match request for student:", studentId);
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.mentorId) return res.status(400).json({ message: "You already have a mentor." });
    if (!student.interests || student.interests.length === 0) {
      return res.status(400).json({ message: "Please set your interests first." });
    }
    const mentors = await Mentor.find();
    if (mentors.length === 0) return res.status(404).json({ message: "No mentors available yet." });

    let bestMentor = null;
    let maxScore = -1;
    for (const mentor of mentors) {
      let score = 0;
      const expertise = (mentor.expertise || "").toLowerCase();
      for (const interest of student.interests) {
        if (expertise.includes(interest.toLowerCase())) score += 2;
      }
      score += (parseFloat(mentor.exp) || 0) / 5;
      if (score > maxScore) {
        maxScore = score;
        bestMentor = mentor;
      }
    }
    if (!bestMentor) bestMentor = mentors[0];

    student.mentorId = bestMentor._id;
    await student.save();
    await Mentor.findByIdAndUpdate(bestMentor._id, { $addToSet: { mentees: studentId } });

    res.json({ message: `✅ Assigned to ${bestMentor.name}`, mentor: bestMentor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};