import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import Admin from "../models/Admin.js";

export const signupUser = async (req, res) => {
  // Debug log – remove after verification
  console.log("📨 Signup request body:", req.body);

  const { name, email, password, role, expertise, exp, bio } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields (name, email, password, role)" });
  }

  try {
    let existingUser;
    if (role === "student") existingUser = await Student.findOne({ email });
    else if (role === "mentor") existingUser = await Mentor.findOne({ email });
    else if (role === "admin") existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let newUser;
    if (role === "student") {
      newUser = new Student({ name, email, password });
    } else if (role === "mentor") {
      newUser = new Mentor({ name, email, password, expertise, exp, bio });
    } else if (role === "admin") {
      newUser = new Admin({ name, email, password });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await newUser.save();
    res.status(201).json({ message: "Account created successfully", _id: newUser._id });
  } catch (err) {
    console.error("Signup error:", err);
    // Handle duplicate key error explicitly
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists (duplicate key)" });
    }
    res.status(500).json({ message: "Server error" });
  }
};