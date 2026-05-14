import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "fromModel" },
  fromModel: { type: String, enum: ["Student", "Mentor"], required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "toModel" },
  toModel: { type: String, enum: ["Student", "Mentor"], required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);