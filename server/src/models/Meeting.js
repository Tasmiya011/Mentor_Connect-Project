import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }],
  date: { type: String, required: true },
  time: { type: String, required: true },
  message: { type: String, required: true },
  pointsAwarded: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Meeting", meetingSchema);