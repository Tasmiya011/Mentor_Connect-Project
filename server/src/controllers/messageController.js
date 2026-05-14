import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getConversation = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { fromUserId: userId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: userId }
      ]
    }).sort("createdAt");
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const markAsRead = async (req, res) => {
  try {
    await Message.updateMany({ toUserId: req.params.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};