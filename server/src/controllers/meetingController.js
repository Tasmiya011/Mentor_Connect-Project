import mongoose from "mongoose";
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

    const today = new Date().toISOString().slice(0,10);
    if (date < today) {
      return res.status(400).json({ error: "Cannot schedule meeting in the past" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) return res.status(400).json({ error: "Invalid student ID(s)" });

    const meeting = new Meeting({ mentorId, studentIds, date, time, message });
    await meeting.save();

    // Award "First Meeting" badge to students who don't have it yet
    for (const student of students) {
      if (student.badges && !student.badges.includes("First Meeting")) {
        student.badges.push("First Meeting");
        await student.save();
      }
    }

    // Notify mentor
    await Notification.create({ userId: mentorId, userModel: "Mentor", message: `Meeting scheduled: ${date} ${time} - ${message}` });
    // Notify each student
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
    const meetings = await Meeting.find({ mentorId: req.params.id })
      .populate("studentIds", "name email")
      .populate("mentorId", "name email");
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingsByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(studentId);
    const meetings = await Meeting.find({ studentIds: objectId })
      .populate("mentorId", "name email")
      .populate("studentIds", "name email");
    res.json(meetings);
  } catch (err) {
    console.error("Student meetings error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingSummary = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("mentorId", "name")
      .populate("studentIds", "name");
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Award points if meeting is in the past and points not yet awarded
    const today = new Date().toISOString().slice(0,10);
    if (meeting.date < today && !meeting.pointsAwarded) {
      // Award 20 points to each student
      for (let studentId of meeting.studentIds) {
        const student = await Student.findById(studentId);
        if (student) {
          student.points = (student.points || 0) + 20;
          // Ensure badges array exists
          if (!student.badges) student.badges = [];
          if (!student.badges.includes("Meeting Attended")) {
            student.badges.push("Meeting Attended");
          }
          await student.save();
        }
      }
      meeting.pointsAwarded = true;
      await meeting.save();
    }

    const summary = `Meeting on ${meeting.date} at ${meeting.time} between ${meeting.mentorId?.name} and ${meeting.studentIds.map(s => s.name).join(", ")}. Agenda: "${meeting.message}".`;
    const actions = [
      "Review meeting notes",
      "Complete any pending tasks discussed",
      "Schedule follow‑up if needed"
    ];
    res.json({ summary, actions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};