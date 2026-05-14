// controllers/roadmapController.js (no OpenAI required)
export const generateRoadmap = async (req, res) => {
  const { goal, duration, skills, learningStyle } = req.body;
  
  // Pre‑defined roadmap templates (you can expand these)
  const templates = {
    "web development": {
      title: "Full Stack Web Developer Roadmap",
      weeks: [
        { week: 1, tasks: ["HTML & CSS fundamentals", "Responsive design"], resources: ["MDN Web Docs", "Flexbox Froggy"] },
        { week: 2, tasks: ["JavaScript basics", "DOM manipulation"], resources: ["JavaScript.info", "You Don't Know JS"] },
        { week: 3, tasks: ["React.js introduction", "Components & Props"], resources: ["React Official Tutorial"] },
        { week: 4, tasks: ["Backend with Node.js", "Express.js"], resources: ["Node.js Docs"] }
      ],
      recommendedMentorExpertise: ["Web Development", "React", "Node.js"]
    },
    "data science": {
      title: "Data Science Roadmap",
      weeks: [
        { week: 1, tasks: ["Python basics", "NumPy & Pandas"], resources: ["Kaggle Learn Python"] },
        { week: 2, tasks: ["Data visualization (Matplotlib, Seaborn)"], resources: ["DataCamp"] },
        { week: 3, tasks: ["Machine Learning (Scikit‑learn)"], resources: ["Hands‑on ML book"] }
      ],
      recommendedMentorExpertise: ["Data Science", "Python", "Machine Learning"]
    },
    // add more as needed
  };
  
  const lowerGoal = goal.toLowerCase();
  let roadmap = null;
  for (const [key, template] of Object.entries(templates)) {
    if (lowerGoal.includes(key)) {
      roadmap = template;
      break;
    }
  }
  if (!roadmap) {
    roadmap = {
      title: `Roadmap for ${goal}`,
      weeks: [{ week: 1, tasks: ["Define your learning path", "Find a mentor on MentorConnect"], resources: [] }],
      recommendedMentorExpertise: ["General Mentorship"]
    };
  }
  res.json({ success: true, roadmap });
};