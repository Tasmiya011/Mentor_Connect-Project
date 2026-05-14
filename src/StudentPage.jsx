// src/pages/StudentPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./theme.css";
import "./StudentDashboard.css";

export default function StudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [interestsInput, setInterestsInput] = useState("");

  // Roadmap
  const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
  const [durationOption, setDurationOption] = useState("3 Months");
  const [customDuration, setCustomDuration] = useState("");
  const [learningStyle, setLearningStyle] = useState("Mixed");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [roadmapHtml, setRoadmapHtml] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Calendar
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Meeting");
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Static data
  const [tasks] = useState([
    { title: "Complete React Authentication", due: "Tomorrow", status: "Pending" },
    { title: "Prepare ML Project PPT", due: "Friday", status: "In Progress" }
  ]);
  const [materials] = useState([
    { title: "React Complete Guide", type: "PDF" },
    { title: "AI/ML Beginner Roadmap", type: "Video" },
    { title: "DSA Interview Sheet", type: "Document" }
  ]);

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editEducation, setEditEducation] = useState("");
  const [editSkills, setEditSkills] = useState("");

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const studentRes = await fetch(`${API}/api/students/${id}`);
      const studentData = await studentRes.json();
      setStudent(studentData);
      setInterestsInput((studentData.interests || []).join(", "));

      const mentorId = studentData.mentorId?._id || studentData.mentorId;
      if (mentorId) {
        const mentorRes = await fetch(`${API}/api/mentors/${mentorId}`);
        setMentor(await mentorRes.json());
      }

      const meetingsRes = await fetch(`${API}/api/meetings/student/${id}`);
      const meetingsData = await meetingsRes.json();
      setMeetings(Array.isArray(meetingsData) ? meetingsData : []);

      const notifRes = await fetch(`${API}/api/notifications/user/${id}?model=Student`);
      const notifData = await notifRes.json();
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    ["token", "role", "user", "loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  const updateInterests = async () => {
    const interestsArray = interestsInput.split(",").map(s => s.trim()).filter(s => s);
    await fetch(`${API}/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: interestsArray })
    });
    alert("Interests updated!");
  };

  const requestAIMentor = async () => {
    try {
      const res = await fetch(`${API}/api/smart-match/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id })
      });
      const data = await res.json();
      alert(data.message || "Mentor matched!");
      fetchAll();
    } catch (err) {
      alert("Failed to match mentor");
    }
  };

  // FIXED: Roadmap generation with logging
  const generateRoadmap = async () => {
    let finalDuration = durationOption;
    if (durationOption === "Custom") {
      if (!customDuration.trim()) {
        alert("Please enter a custom duration (e.g., 8 weeks, 2 months)");
        return;
      }
      finalDuration = customDuration.trim();
    }

    console.log("Sending duration to backend:", finalDuration);

    try {
      const res = await fetch(`${API}/api/roadmap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: careerGoal,
          duration: finalDuration,
          skills: interestsInput,
          learningStyle,
          level: skillLevel
        })
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!data.roadmap) throw new Error("No roadmap generated");
      if (!data.roadmap.weeks || data.roadmap.weeks.length === 0) throw new Error("No weeks in roadmap");

      // Warn if 3 months but only 1 week
      if (finalDuration === "3 Months" && data.roadmap.weeks.length === 1) {
        alert("⚠️ Backend returned only 1 week for 3 months. Please update your backend to generate multiple weeks based on duration.");
      }

      const html = `
        <div>
          <h1 style="color:#4f46e5; margin-bottom:20px;">${data.roadmap.title}</h1>
          ${data.roadmap.weeks.map(week => `
            <div style="margin-bottom:20px; padding:18px; border:1px solid #ddd; border-radius:14px;">
              <h3>Week ${week.week}</h3>
              <ul>${week.tasks.map(task => `<li>${task}</li>`).join("")}</ul>
            </div>
          `).join("")}
        </div>
      `;
      setRoadmapHtml(html);
      setShowRoadmap(true);
    } catch (err) {
      console.error(err);
      alert("Roadmap generation failed: " + err.message);
    }
  };

  const downloadRoadmap = () => {
    const element = document.getElementById("roadmap-content");
    html2pdf().from(element).save("AI-Roadmap.pdf");
  };

  const addCalendarEvent = () => {
    if (!selectedDate || !eventTitle) {
      alert("Please fill all fields");
      return;
    }
    const newEvent = { id: Date.now(), date: selectedDate, title: eventTitle, type: eventType };
    setCalendarEvents([...calendarEvents, newEvent]);
    setEventTitle("");
  };

  const generateSummary = async (meetingId) => {
    try {
      const res = await fetch(`${API}/api/meetings/${meetingId}/summary`);
      const data = await res.json();
      alert(data.summary);
    } catch (err) {
      alert("Failed to generate summary");
    }
  };

  const startEditing = () => {
    setEditEducation(student?.education || "");
    setEditSkills((student?.skills || []).join(", "));
    setIsEditingProfile(true);
  };

  const saveProfile = async () => {
    const skillsArray = editSkills.split(",").map(s => s.trim()).filter(s => s);
    try {
      const res = await fetch(`${API}/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ education: editEducation, skills: skillsArray })
      });
      if (res.ok) {
        const updatedStudent = await res.json();
        setStudent(updatedStudent);
        setIsEditingProfile(false);
        alert("Profile updated!");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return (
      <div className="mc-loading">
        <div className="mc-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date());

  return (
    <div className="student-page-layout">
      <aside className="student-sidebar">
        <div className="sidebar-logo">MentorConnect</div>
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
        <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>🔔 Notifications</button>
        <button className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>📅 Schedule</button>
        <button className={activeTab === "meetings" ? "active" : ""} onClick={() => setActiveTab("meetings")}>🎥 Meetings</button>
        <button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}>📚 Study Materials</button>
        <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>✅ My Tasks</button>
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>👤 Profile</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <main className="student-main">
        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-top">
              <div className="welcome-card">
                <h1>Welcome, {student?.name}</h1>
                <p>Your smart mentorship dashboard</p>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><h2>{meetings.length}</h2><p>Meetings</p></div>
              <div className="stat-card"><h2>{notifications.length}</h2><p>Notifications</p></div>
              <div className="stat-card"><h2>{tasks.length}</h2><p>Tasks</p></div>
            </div>
            <div className="dashboard-grid">
              <div className="premium-panel">
                <h3>👨‍🏫 Assigned Mentor</h3>
                {mentor ? (
                  <>
                    <p><strong>{mentor.name}</strong></p>
                    <p>{mentor.expertise}</p>
                  </>
                ) : (
                  <p>No mentor assigned yet. Use AI matching below.</p>
                )}
              </div>
              <div className="premium-panel">
                <h3>🤖 AI Mentor Matching</h3>
                <input className="mc-input" value={interestsInput} onChange={(e) => setInterestsInput(e.target.value)} placeholder="React, AI, ML" />
                <div className="action-row">
                  <button className="btn-teal" onClick={updateInterests}>Save Interests</button>
                  {!mentor ? (
                    <button className="btn-outline" onClick={requestAIMentor}>Find Mentor</button>
                  ) : (
                    <button className="btn-outline" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>✓ Mentor Assigned</button>
                  )}
                </div>
              </div>
            </div>
            <div className="premium-panel">
              <h3>🗺️ AI Career Roadmap Generator</h3>
              <div className="roadmap-grid">
                <input className="mc-input" placeholder="Career Goal" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} />
                <div className="duration-selector">
                  <select className="mc-input" value={durationOption} onChange={(e) => setDurationOption(e.target.value)}>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>12 Months</option>
                    <option>Custom</option>
                  </select>
                  {durationOption === "Custom" && (
                    <input className="mc-input" placeholder="e.g., 8 weeks, 2 months" value={customDuration} onChange={(e) => setCustomDuration(e.target.value)} />
                  )}
                </div>
                <select className="mc-input" value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
                  <option>Visual</option><option>Practical</option><option>Mixed</option>
                </select>
                <select className="mc-input" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <button className="btn-teal" onClick={generateRoadmap}>✨ Generate Roadmap</button>
            </div>
            {showRoadmap && (
              <div className="premium-panel">
                <div id="roadmap-content" dangerouslySetInnerHTML={{ __html: roadmapHtml }} />
                <button className="btn-outline" onClick={downloadRoadmap}>📄 Download PDF</button>
              </div>
            )}
          </>
        )}

        {activeTab === "notifications" && (
          <div className="premium-panel">
            <h2>🔔 All Notifications</h2>
            <div className="notifications-full-list">
              {notifications.length === 0 ? (
                <p style={{ color: "var(--text-light)", padding: "20px", textAlign: "center" }}>No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="notification-item-full">
                    <div className="notification-message">{n.message}</div>
                    <small>{new Date(n.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="premium-panel">
            <h2>📅 Smart Calendar</h2>
            <div className="calendar-grid">
              <input type="date" className="mc-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              <input className="mc-input" placeholder="Task / Meeting" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              <select className="mc-input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option>Meeting</option><option>Task</option><option>Reminder</option>
              </select>
            </div>
            <button className="btn-teal" onClick={addCalendarEvent}>Add Event</button>
            <div className="events-grid">
              {calendarEvents.map(event => (
                <div className="event-card" key={event.id}>
                  <h4>{event.title}</h4>
                  <p>{event.date}</p>
                  <span>{event.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="meetings-grid">
            {upcomingMeetings.map(m => (
              <div className="meeting-card" key={m._id}>
                <div className="meeting-header">
                  <h3>📅 {m.date}</h3>
                  <span>⏰ {m.time}</span>
                </div>
                <p>{m.message}</p>
                <div className="meeting-actions">
                  <button className="btn-teal" onClick={() => window.open(`https://meet.jit.si/MentorConnect_${m._id}`, "_blank")}>Join Meeting</button>
                  <button className="btn-outline" onClick={() => generateSummary(m._id)}>Summary</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="materials-grid">
            {materials.map((m, idx) => (
              <div className="material-card" key={idx}>
                <h3>{m.title}</h3>
                <p>{m.type}</p>
                <button className="btn-outline">Open</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="tasks-grid">
            {tasks.map((task, idx) => (
              <div className="task-card" key={idx}>
                <h3>{task.title}</h3>
                <p>Due: {task.due}</p>
                <span className="task-status pending">{task.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">{student?.name?.charAt(0).toUpperCase()}</div>
              <div className="profile-title">
                <h2>My Profile</h2>
                <p>Manage your personal information</p>
              </div>
              {!isEditingProfile ? (
                <button className="btn-outline edit-btn" onClick={startEditing}>✏️ Edit Profile</button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-teal" onClick={saveProfile}>💾 Save</button>
                  <button className="btn-outline" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                </div>
              )}
            </div>
            <div className="profile-content">
              <div className="profile-info-card">
                <h3>📋 Basic Information</h3>
                <div className="info-row"><span className="info-label">Full Name</span><span className="info-value">{student?.name}</span></div>
                <div className="info-row"><span className="info-label">Email Address</span><span className="info-value">{student?.email}</span></div>
                <div className="info-row"><span className="info-label">Semester</span><span className="info-value">{student?.semester || "Not set"}</span></div>
              </div>
              <div className="profile-info-card">
                <h3>🎓 Education</h3>
                {isEditingProfile ? (
                  <input type="text" className="mc-input" value={editEducation} onChange={(e) => setEditEducation(e.target.value)} placeholder="e.g., B.Tech Computer Science, 3rd Year" />
                ) : (
                  <p className="info-value">{student?.education || "Not added yet"}</p>
                )}
                <h3 style={{ marginTop: "1.5rem" }}>⚙️ Skills & Interests</h3>
                {isEditingProfile ? (
                  <>
                    <textarea className="mc-input" rows="3" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} placeholder="React, Node.js, AI, ML (comma separated)" />
                    <small className="field-hint">Separate skills with commas</small>
                  </>
                ) : (
                  <div className="skills-wrap">
                    {student?.skills?.length ? student.skills.map((skill, idx) => <span key={idx} className="skill-badge">{skill}</span>) : <p className="info-value">No skills added yet</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}