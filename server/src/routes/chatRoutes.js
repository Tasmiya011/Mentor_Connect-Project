// routes/chatRoutes.js
import express from "express";
const router = express.Router();

// Simple in‑memory responses (no external API needed)
const responses = {
  hello: "Hello! How can I help you today?",
  mentor: "You can browse mentors from your dashboard or use AI match to find the best fit.",
  meeting: "To schedule a meeting, go to your dashboard and click 'Schedule Meeting'.",
  task: "You can manage tasks from the 'Pending Tasks' section.",
  default: "I'm here to assist you with MentorConnect. Ask me about mentors, meetings, or tasks!"
};

router.post("/", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const lowerMsg = message.toLowerCase();
  let reply = responses.default;
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) reply = responses.hello;
  else if (lowerMsg.includes("mentor")) reply = responses.mentor;
  else if (lowerMsg.includes("meeting")) reply = responses.meeting;
  else if (lowerMsg.includes("task")) reply = responses.task;
  res.json({ reply });
});

export default router;