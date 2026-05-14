import Student from "../models/Student.js";
import Notification from "../models/Notification.js";

export const checkInactivity = async () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const inactiveStudents = await Student.find({ lastActivity: { $lt: twoWeeksAgo } });
  for (let s of inactiveStudents) {
    await Notification.create({
      userId: s._id,
      userModel: "Student",
      message: "⚠️ You haven't had a meeting in 2 weeks. Schedule one now!"
    });
  }
};