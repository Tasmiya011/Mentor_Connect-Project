// controllers/mentorController.js
import Mentor from "../models/Mentor.js";

export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMentor = async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVolunteerMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isVolunteer: true });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Also add updateMentorCapacity if needed (optional)
export const updateMentorCapacity = async (req, res) => {
  try {
    const { maxMentees } = req.body;
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, { maxMentees }, { new: true });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};