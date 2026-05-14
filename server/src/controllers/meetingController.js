// controllers/meetingController.js
import Meeting from "../models/Meeting.js";
import Mentor from "../models/Mentor.js";
import Student from "../models/Student.js";
import Notification from "../models/Notification.js";

export const createMeeting = async (req, res) => {
  try {
    const { mentorId, studentIds, date, time, message } = req.body;

    if (!mentorId) return res.status(400).json({ error: "mentorId required" });
    if (!Array.isArray(studentIds) || !studentIds.length) return res.status(400).json({ error: "Select at least one student" });
    if (!date || !time || !message) return res.status(400).json({ error: "date, time, message required" });

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) return res.status(400).json({ error: "One or more student IDs invalid" });

    const meeting = new Meeting({ mentorId, studentIds, date, time, message });
    await meeting.save();

    // Award badge for first meeting
    for (let studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (student && !student.badges.includes("First Meeting")) {
        student.badges.push("First Meeting");
        await student.save();
      }
    }

    // Notifications
    await Notification.create({ userId: mentorId, userModel: "Mentor", message: `Meeting scheduled: ${date} ${time} - ${message}` });
    for (let sid of studentIds) {
      await Notification.create({ userId: sid, userModel: "Student", message: `Meeting with ${mentor.name} on ${date} at ${time}: ${message}` });
    }

    res.status(201).json({ success: true, meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingsByMentor = async (req, res) => {
  try {
    const meetings = await Meeting.find({ mentorId: req.params.id }).populate("studentIds", "name email");
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingsByStudent = async (req, res) => {
  try {
    const meetings = await Meeting.find({ studentIds: req.params.id }).populate("mentorId", "name email");
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingSummary = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("mentorId", "name")
      .populate("studentIds", "name");
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    const summary = `Meeting on ${meeting.date} at ${meeting.time} between ${meeting.mentorId?.name} and ${meeting.studentIds.map(s => s.name).join(", ")}. Agenda: "${meeting.message}".`;
    const actions = [
      "Review key points discussed",
      "Complete any pending action items",
      "Schedule follow‑up meeting if needed"
    ];
    res.json({ summary, actions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};