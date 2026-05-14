import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  console.log("🔐 Login body:", req.body);  // debug

  let { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing credentials (username, password, role)" });
  }

  role = role.toLowerCase();
  username = username.trim();

  let user;
  try {
    if (role === "student") {
      user = await Student.findOne({ email: username });
    } else if (role === "mentor") {
      user = await Mentor.findOne({ email: username });
    } else if (role === "admin") {
      user = await Admin.findOne({ email: username });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
      token,
      mentorId: user.mentorId || null,
      expertise: user.expertise || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};