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

// models/Student.js
studentSchema.methods.getLevel = function() {
  const points = this.points || 0;
  if (points >= 1000) return { name: 'Ace', icon: '🦅', color: '#ffd700' };
  if (points >= 500) return { name: 'Platinum', icon: '💎', color: '#b0c4de' };
  if (points >= 250) return { name: 'Gold', icon: '🥇', color: '#ffd700' };
  if (points >= 100) return { name: 'Silver', icon: '🥈', color: '#c0c0c0' };
  return { name: 'Bronze', icon: '🥉', color: '#cd7f32' };
};

export default mongoose.model("Student", studentSchema);