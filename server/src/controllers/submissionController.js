import Submission from "../models/Submission.js";

export const createSubmission = async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json(submission);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSubmissionsForMentor = async (req, res) => {
  try {
    const submissions = await Submission.find({ mentorId: req.params.mentorId }).populate("studentId", "name email");
    res.json(submissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSubmissionsForStudent = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.params.studentId }).populate("mentorId", "name email");
    res.json(submissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(req.params.id, { status, feedback }, { new: true });
    res.json(submission);
  } catch (err) { res.status(500).json({ error: err.message }); }
};