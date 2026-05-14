import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: { type: [String], default: [] },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
  bio: { type: String, default: "" },
  skills: [{ type: String, default: [] }],
  education: { type: String, default: "" },
  location: { type: String, default: "" },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  trustScore: { type: Number, default: 0 },
  quizAnswers: {
    learningStyle: { type: String, enum: ["visual", "reading", "hands-on", "mixed"], default: "mixed" },
    communication: { type: String, enum: ["chat", "video", "email"], default: "chat" },
    projectSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    availability: { type: String, enum: ["weekdays", "weekends", "flexible"], default: "flexible" }
  },
  availability: { type: Map, of: Boolean, default: {} } // e.g. {"2025-05-15": true}
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);