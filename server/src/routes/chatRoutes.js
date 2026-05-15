// routes/chatRoutes.js
import express from "express";
const router = express.Router();

function getReply(message, userRole = null) {
  const lower = message.toLowerCase().trim();

  // ----- QUICK QUESTIONS (matches Chatbot quickQuestions) -----
  if (lower.includes("how do i get a roadmap") || lower.includes("roadmap") && (lower.includes("get") || lower.includes("generate"))) {
    return "📌 **To get a personalized roadmap:**\n1. Go to the 'Dashboard' tab.\n2. Scroll to 'AI Career Roadmap Generator'.\n3. Enter your career goal (e.g., 'Full Stack Developer').\n4. Choose duration (1/3/6/12 months or custom).\n5. Select your learning style and skill level.\n6. Click 'Generate Roadmap'.\nYou'll see a week‑by‑week plan – downloadable as PDF.";
  }
  if (lower.includes("how to schedule a meeting") || (lower.includes("schedule") && lower.includes("meeting"))) {
    if (userRole === "mentor") {
      return "📅 **As a mentor:**\n1. Go to 'Schedule' tab.\n2. Select one or more students (hold Ctrl).\n3. Pick date and time.\n4. Write a message.\n5. Click 'Schedule Meeting'.\nStudents receive a notification and a Jitsi link.";
    } else {
      return "📅 **As a student:**\nYour mentor schedules meetings for you. You'll receive a notification and can join from the 'Meetings' tab or the dashboard. If you need a meeting, talk to your mentor directly.";
    }
  }
  if (lower.includes("how to assign tasks") || (lower.includes("assign") && lower.includes("task"))) {
    return "✅ **As a mentor:**\n1. Go to 'Tasks' tab.\n2. Click 'Assign Task'.\n3. Fill in title, description, due date.\n4. Select student(s).\n5. Click 'Assign'.\nStudents will see the task in their dashboard and can mark progress.";
  }
  if (lower.includes("how to upload study materials") || (lower.includes("upload") && lower.includes("material")) || (lower.includes("share") && lower.includes("resource"))) {
    return "📚 **As a mentor:**\n1. Go to 'Study Materials' tab.\n2. Click 'Add Material'.\n3. Enter title, description, and a link (Google Drive, PDF URL, etc.).\n4. Select which students can see it.\n5. Save. Students will see it in their 'Study Materials' tab.";
  }
  if (lower.includes("how to give feedback") || (lower.includes("feedback") && (lower.includes("mentor") || lower.includes("student"))) || (lower.includes("give") && lower.includes("feedback"))) {
    return "💬 **Giving feedback:**\n- After a past meeting, go to the 'Meetings' tab.\n- Find the meeting and click 'Give Feedback'.\n- Rate 1‑5 stars and leave an optional comment.\n- Your feedback helps improve the mentoring experience.\n\n**Note:** Feedback is available only for completed meetings (past date).";
  }
  if (lower.includes("whiteboard not working") || (lower.includes("whiteboard") && lower.includes("not"))) {
    return "🖥️ **Whiteboard troubleshooting:**\n1. Allow pop‑ups for this site.\n2. Ensure you're in a meeting that supports whiteboard.\n3. Try refreshing the page.\n4. If it still fails, use the 'Join Video Call' button instead – the whiteboard is optional.\n5. Contact support if the issue persists.";
  }

  // ----- ADDITIONAL COMMON QUESTIONS (shortened for brevity) -----
  if (lower.includes("track progress") || lower.includes("see my progress")) {
    return "📈 **Track your progress:**\n- Dashboard shows your completed tasks, points, and badge count.\n- Meetings attended add 20 points each.\n- Completed tasks add 10 points.\n- You can view detailed analytics in the 'Progress' tab (coming soon).";
  }
  if (lower.includes("points") || lower.includes("badge") || lower.includes("levels")) {
    return "🏅 **Points & Badges:**\n- Attend meetings: +20 points each.\n- Complete tasks: +10 points each.\n- Give feedback: +5 points.\n- Badges unlock at 100, 500, 1000 points.\n- Check your current level on the dashboard!";
  }
  if (lower.includes("join meeting") || lower.includes("how to join")) {
    return "🎥 **Join a meeting:**\n1. Go to 'Meetings' tab.\n2. Find the upcoming meeting.\n3. Click 'Join Meeting' – it opens a Jitsi room.\n4. Allow camera/mic permissions.\nYou can also use the whiteboard and code editor during the call.";
  }
  if (lower.includes("reschedule meeting") || lower.includes("change meeting time")) {
    return "⏰ **Reschedule a meeting:**\nCurrently, only mentors can reschedule. Contact your mentor directly and ask them to reschedule from their 'Schedule' tab.";
  }
  if (lower.includes("cancel meeting")) {
    return "❌ **Cancel a meeting:**\nMentors can cancel meetings from the 'Schedule' tab. As a student, please inform your mentor if you cannot attend.";
  }
  if (lower.includes("update profile") || lower.includes("edit profile")) {
    return "✏️ **Update your profile:**\n1. Go to 'Profile' tab.\n2. Click 'Edit Profile'.\n3. Change your education, skills, or other fields.\n4. Click 'Save'.\nChanges are reflected immediately.";
  }
  if (lower.includes("change password")) {
    return "🔑 **Change password:**\n1. Go to 'Profile' tab.\n2. Click 'Change Password'.\n3. Enter old and new password.\n4. Confirm and save.\nYou'll need to log in again afterward.";
  }
  if (lower.includes("forgot password")) {
    return "❓ **Forgot password?**\nOn the login page, click 'Forgot Password'. Enter your email – we'll send a reset link. Follow the instructions in the email.";
  }
  if (lower.includes("how to use chat") || lower.includes("how to ask")) {
    return "💬 **Using the chat:**\nType any question about the platform. I'll give you step‑by‑step instructions. You can also click on the quick question buttons below for common topics.";
  }
  if (lower.includes("contact mentor")) {
    return "👨‍🏫 **Contact your mentor:**\n- Use the chat feature during meetings.\n- Send a message via the 'Notifications' panel (mentor will see it).\n- Or ask to schedule a one‑on‑one call.";
  }
  if (lower.includes("contact student") && userRole === "mentor") {
    return "👨‍🎓 **Contact your student:**\n- Use the 'Schedule' tab to invite them to a meeting.\n- Send a notification from the mentor dashboard.\n- Reply to their feedback or task submissions.";
  }
  if (lower.includes("submit assignment") || lower.includes("submit project")) {
    return "📎 **Submit an assignment (students):**\n1. Go to 'Submissions' tab.\n2. Click 'New Submission'.\n3. Fill in title, description, and link (GitHub, drive).\n4. Submit.\nYour mentor will review and give feedback.";
  }
  if (lower.includes("view my mentees") && userRole === "mentor") {
    return "👥 **View your mentees:**\nGo to 'My Students' tab. You'll see all assigned students, their emails, interests, and progress.";
  }
  if (lower.includes("view my mentor") && userRole === "student") {
    return "🧑‍🏫 **View your mentor:**\nOn the dashboard, the 'Assigned Mentor' panel shows your mentor's name and expertise. Click on their name to see full profile (if available).";
  }
  if (lower.includes("notification bell") || lower.includes("notifications")) {
    return "🔔 **Notifications:**\n- The bell icon shows unread notifications.\n- Click it to see details.\n- Mark as read to clear the badge.\n- All important updates (new meetings, tasks, feedback) appear here.";
  }
  if (lower.includes("meeting link") || lower.includes("jitsi")) {
    return "🔗 **Meeting links:**\nEach scheduled meeting gets a unique Jitsi link. Click 'Join Meeting' to open it. If pop‑ups are blocked, allow them or copy the link from the meeting card.";
  }
  if (lower.includes("contact support")) {
    return "📧 **Support:**\nEmail support@mentorconnect.com – we'll reply within 24 hours. Or use this chat to get immediate help with common issues.";
  }
  if (lower.includes("login")) {
    return "🔐 **Login:**\nClick 'Login' in the top navigation. Use your registered email and password. If you forgot your password, use 'Forgot Password'.";
  }
  if (lower.includes("signup") || lower.includes("register")) {
    return "📝 **Sign Up:**\nClick 'Sign Up', choose your role (Student or Mentor), fill in the required details, and submit. After approval, you can log in.";
  }
  if (lower.includes("logout")) {
    return "🚪 **Logout:**\nClick the 'Logout' button in the sidebar (left side for students, right side for mentors).";
  }
  if (lower.includes("max mentees")) {
    return "👥 **Max Mentees (mentors only):**\nYou can set a maximum number of mentees in your profile. Once reached, no more students can be assigned to you.";
  }
  if (lower.includes("volunteer mentor")) {
    return "🌱 **Volunteer Mentors:**\nYou can mark yourself as a volunteer in your profile. Students can then filter and request volunteer mentors specifically.";
  }

  // ----- FALLBACK -----
  return "Sorry, I didn't understand that. Could you please rephrase your question? You can also click one of the quick questions below.";
}

router.post("/", (req, res) => {
  const { message, role } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const reply = getReply(message, role);
  res.json({ reply });
});

export default router;