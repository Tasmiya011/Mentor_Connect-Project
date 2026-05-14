// controllers/smartMatchController.js
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import natural from "natural";

const { TfIdf } = natural;

/**
 * POST /api/smart-match/match
 * Body: { studentId }
 * Returns: best mentor based on interests + quiz answers + experience
 */
export const smartMatch = async (req, res) => {
  const { studentId } = req.body;

  try {
    // 1. Fetch student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });
    if (student.mentorId) {
      return res.status(400).json({ error: "You already have a mentor assigned." });
    }
    if (!student.interests || student.interests.length === 0) {
      return res.status(400).json({ error: "Please set your interests first." });
    }

    // 2. Fetch all mentors
    const mentors = await Mentor.find();
    if (mentors.length === 0) {
      return res.status(404).json({ error: "No mentors available yet." });
    }

    // 3. Build TF‑IDF documents (mentor expertise + bio + experience)
    const documents = mentors.map(m =>
      `${m.expertise || ""} ${m.bio || ""} ${m.exp || 0} years`.toLowerCase()
    );
    const studentDoc = student.interests.join(" ").toLowerCase();

    const tfidf = new TfIdf();
    documents.forEach(doc => tfidf.addDocument(doc));

    // 4. Compute scores for each mentor
    const scores = [];
    for (let i = 0; i < mentors.length; i++) {
      let tfidfScore = 0;
      tfidf.tfidfs(studentDoc, (index, measure) => {
        if (index === i) tfidfScore = measure;
      });

      // 5. Add quiz compatibility score (if both have quiz answers)
      let quizScore = 0;
      if (student.quizAnswers && mentors[i].quizAnswers) {
        const sq = student.quizAnswers;
        const mq = mentors[i].quizAnswers;
        if (sq.learningStyle === mq.learningStyle) quizScore += 0.3;
        if (sq.communication === mq.communication) quizScore += 0.3;
        if (sq.availability === mq.availability) quizScore += 0.2;
        if (sq.projectSize === mq.projectSize) quizScore += 0.2;
      }

      // 6. Small bonus for volunteer mentors (social good)
      let volunteerBonus = mentors[i].isVolunteer ? 0.2 : 0;

      const totalScore = tfidfScore + quizScore + volunteerBonus;
      scores.push({ mentor: mentors[i], totalScore });
    }

    // 7. Pick best mentor
    scores.sort((a,b) => b.totalScore - a.totalScore);
    const best = scores[0];
    if (!best || best.totalScore === 0) {
      // fallback to first mentor
      best.mentor = mentors[0];
      best.totalScore = 0.1;
    }

    // 8. Auto‑assign
    student.mentorId = best.mentor._id;
    await student.save();

    // 9. Add student to mentor’s mentees list (optional)
    await Mentor.findByIdAndUpdate(best.mentor._id, {
      $addToSet: { mentees: student._id }
    });

    // 10. Return result
    res.json({
      message: `✨ Assigned to ${best.mentor.name} (match score: ${best.totalScore.toFixed(2)})`,
      mentor: {
        id: best.mentor._id,
        name: best.mentor.name,
        expertise: best.mentor.expertise,
        exp: best.mentor.exp,
        isVolunteer: best.mentor.isVolunteer || false
      }
    });
  } catch (err) {
    console.error("Smart match error:", err);
    res.status(500).json({ error: err.message });
  }
};