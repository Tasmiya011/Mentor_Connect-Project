import Feedback from "../models/Feedback.js";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import Meeting from "../models/Meeting.js";

export const submitFeedback = async (req, res) => {
  try {
    const { meetingId, rating, comment, fromUserId, fromModel, toUserId, toModel } = req.body;
    
    const existing = await Feedback.findOne({ meetingId, fromUserId });
    if (existing) return res.status(400).json({ error: "Feedback already submitted for this meeting" });

    const feedback = new Feedback({ meetingId, fromUserId, fromModel, toUserId, toModel, rating, comment });
    await feedback.save();

    // Update trust score
    const avg = await Feedback.aggregate([
      { $match: { toUserId: feedback.toUserId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const trustScore = avg[0]?.avgRating || 0;
    if (toModel === "Student") await Student.findByIdAndUpdate(toUserId, { trustScore });
    else await Mentor.findByIdAndUpdate(toUserId, { trustScore });

    res.json({ message: "Feedback submitted", trustScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrustScore = async (req, res) => {
  try {
    const { userId, model } = req.params;
    let user;
    if (model === "Student") user = await Student.findById(userId).select("trustScore");
    else user = await Mentor.findById(userId).select("trustScore");
    res.json({ trustScore: user?.trustScore || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};