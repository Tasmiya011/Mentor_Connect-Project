// src/controllers/notificationController.js
import Notification from "../models/Notification.js";

/**
 * GET /api/notifications/user/:id?model=Student
 */
export const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userModel = req.query.model;
    if (!userModel) return res.status(400).json({ message: "model query param required (Student|Mentor)" });

    const notes = await Notification.find({ userId, userModel }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Notif fetch error:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

/**
 * PUT /api/notifications/:id/read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!note) return res.status(404).json({ message: "Notification not found" });
    res.json(note);
  } catch (err) {
    console.error("Notif mark read error:", err);
    res.status(500).json({ message: "Error updating notification" });
  }
};
