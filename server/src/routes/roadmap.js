import express from "express";
const router = express.Router();

// Simple working route
router.post("/generate", (req, res) => {
  const { goal, duration } = req.body;
  let weeksCount = 4;
  if (duration === "3 Months") weeksCount = 12;
  else if (duration === "6 Months") weeksCount = 24;
  else if (duration === "12 Months") weeksCount = 48;
  else if (duration === "1 Month") weeksCount = 4;
  else {
    const match = duration.match(/(\d+)\s*(week|month)/i);
    if (match) weeksCount = match[2] === "month" ? parseInt(match[1]) * 4 : parseInt(match[1]);
  }
  
  const weeks = [];
  for (let i = 1; i <= weeksCount; i++) {
    weeks.push({ week: i, tasks: [`Week ${i} task`, `Practice ${goal}`] });
  }
  res.json({ roadmap: { title: `${goal} roadmap`, weeks } });
});

export default router;