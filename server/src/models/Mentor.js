import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  expertise: { type: String, default: "" },
  exp: { type: String, default: "0" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  isVolunteer: { type: Boolean, default: false },
  maxMentees: { type: Number, default: 5 },
  mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  trustScore: { type: Number, default: 0 },
  quizAnswers: {
    learningStyle: { type: String, enum: ["visual", "reading", "hands-on", "mixed"], default: "mixed" },
    communication: { type: String, enum: ["chat", "video", "email"], default: "chat" },
    projectSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    availability: { type: String, enum: ["weekdays", "weekends", "flexible"], default: "flexible" },
    isVolunteer: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model("Mentor", mentorSchema);