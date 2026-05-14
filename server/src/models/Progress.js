import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  task: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["pending", "completed", "rejected"], default: "pending" },
  mentorFeedback: String,
  dueDate: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Progress", progressSchema);