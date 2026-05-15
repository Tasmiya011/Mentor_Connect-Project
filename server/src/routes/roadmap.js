// routes/roadmap.js
import express from "express";
const router = express.Router();

// Helper: convert duration string to number of weeks
function getWeeksFromDuration(duration) {
  const lower = duration.toLowerCase();
  // "8 weeks" → 8, "12 weeks" → 12
  const weeksMatch = lower.match(/(\d+)\s*weeks?/);
  if (weeksMatch) return parseInt(weeksMatch[1]);
  // "3 months" → 12, "6 months" → 24
  const monthsMatch = lower.match(/(\d+)\s*months?/);
  if (monthsMatch) return parseInt(monthsMatch[1]) * 4;
  // "1 Month", "2 month" etc.
  if (lower.includes("month")) {
    const num = parseInt(lower) || 1;
    return num * 4;
  }
  // Default fallback
  return 4;
}

// Generate a realistic weekly plan
function generateWeeklyPlan(goal, totalWeeks, skills, learningStyle, level) {
  // Base progression topics (extend as needed)
  const topicTemplates = [
    `Introduction to ${goal}`,
    `Core Fundamentals of ${goal}`,
    `Essential Tools & Environment Setup`,
    `Hands‑on Practice: Basic Projects`,
    `Intermediate Concepts in ${goal}`,
    `Advanced Techniques & Best Practices`,
    `Real‑World Project – Part 1`,
    `Real‑World Project – Part 2`,
    `Performance Optimization & Testing`,
    `Deployment & CI/CD Basics`,
    `Portfolio & Interview Preparation`,
    `Final Review & Next Steps`
  ];

  const weeks = [];
  for (let i = 0; i < totalWeeks; i++) {
    const weekNum = i + 1;
    // Cycle through topics, but add week-specific variation
    const templateIndex = i % topicTemplates.length;
    let topic = topicTemplates[templateIndex];
    // Make each week distinct by appending week number or adding nuance
    topic = `${topic} (Week ${weekNum})`;

    // Generate 3 tasks per week, each different
    const tasks = [
      `Study & practice: ${topic}`,
      `Complete an exercise related to ${topic.split('(')[0].trim()}`,
      `Write a short summary or build a small component for ${topic.split('(')[0].trim()}`
    ];

    weeks.push({
      week: weekNum,
      topic: topic,
      tasks: tasks
    });
  }
  return weeks;
}

router.post("/generate", async (req, res) => {
  try {
    const { goal, duration, skills, learningStyle, level } = req.body;

    if (!goal || !duration) {
      return res.status(400).json({ error: "Goal and duration are required" });
    }

    const totalWeeks = getWeeksFromDuration(duration);
    console.log(`Generating roadmap: goal="${goal}", duration="${duration}" → ${totalWeeks} weeks`);

    const weeks = generateWeeklyPlan(goal, totalWeeks, skills, learningStyle, level);

    const roadmap = {
      title: `Roadmap to become a ${goal} (${duration})`,
      weeks: weeks,
      recommendedMentorExpertise: [goal.split(" ")[0], "Career Guidance"]
    };

    res.json({ roadmap });
  } catch (err) {
    console.error("Roadmap generation error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;