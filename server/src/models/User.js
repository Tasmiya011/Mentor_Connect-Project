import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },   // plain password
    role: { type: String, enum: ["student", "mentor", "admin", "hod"], required: true },

    assignedMentees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
    ],
  },
  { timestamps: true }
);

// ❌ NO HASHING
// ❌ NO bcrypt
// ❌ NO comparePassword

export default mongoose.model("User", userSchema);
