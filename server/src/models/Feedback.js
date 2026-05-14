import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fromModel: { type: String, enum: ["Student", "Mentor"], required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  toModel: { type: String, enum: ["Student", "Mentor"], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", feedbackSchema);