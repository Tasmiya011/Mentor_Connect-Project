import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

export const assignMentorToStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Update student without triggering password validation
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { mentorId },
      { new: true, runValidators: false }
    );

    // Optional: add student to mentor's mentees array
    if (mentor.mentees) {
      await Mentor.findByIdAndUpdate(
        mentorId,
        { $addToSet: { mentees: id } }
      );
    }

    res.status(200).json({
      message: "Mentor assigned successfully",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Assign Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
