import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  title: { type: String, required: true },
  description: String,
  githubLink: String,
  codeSnippet: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);