import Progress from "../models/Progress.js";

export const createTask = async (req, res) => {
  try {
    const task = new Progress(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTasksForMentor = async (req, res) => {
  try {
    const tasks = await Progress.find({ mentorId: req.params.mentorId }).populate("studentId", "name email");
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTasksForStudent = async (req, res) => {
  try {
    const tasks = await Progress.find({ studentId: req.params.studentId }).populate("mentorId", "name");
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateTask = async (req, res) => {
  try {
    const { status, mentorFeedback } = req.body;
    const task = await Progress.findByIdAndUpdate(req.params.id, { status, mentorFeedback, completedAt: status === "completed" ? new Date() : undefined }, { new: true });
    res.json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
};