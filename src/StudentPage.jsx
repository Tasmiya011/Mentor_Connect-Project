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

  // Calendar events (persisted)
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Meeting");

  // Feedback modal
  const [showFeedback, setShowFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Study Materials modal
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Static data
  const [tasks] = useState([
    { title: "Complete React Authentication", due: "Tomorrow", status: "Pending" },
    { title: "Prepare ML Project PPT", due: "Friday", status: "In Progress" }
  ]);
  const [materials] = useState([
    { title: "React Complete Guide", type: "PDF", url: "https://react.dev/learn", description: "Official React documentation with interactive examples." },
    { title: "AI/ML Beginner Roadmap", type: "Video", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", description: "Step‑by‑step video to start ML journey." },
    { title: "DSA Interview Sheet", type: "Document", url: "https://docs.google.com/document/d/example", description: "Curated list of important DSA questions." }
  ]);

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editEducation, setEditEducation] = useState("");
  const [editSkills, setEditSkills] = useState("");

  // ==================== LEVEL CALCULATION ====================
  const getLevelInfo = (points) => {
    if (points >= 1000) return { name: 'Ace', icon: '🦅', color: '#ffd700', next: null, pointsToNext: 0 };
    if (points >= 500) return { name: 'Platinum', icon: '💎', color: '#b0c4de', next: 'Ace', pointsToNext: 1000 - points };
    if (points >= 250) return { name: 'Gold', icon: '🥇', color: '#ffd700', next: 'Platinum', pointsToNext: 500 - points };
    if (points >= 100) return { name: 'Silver', icon: '🥈', color: '#c0c0c0', next: 'Gold', pointsToNext: 250 - points };
    return { name: 'Bronze', icon: '🥉', color: '#cd7f32', next: 'Silver', pointsToNext: 100 - points };
  };

  // ==================== PERSIST CALENDAR EVENTS ====================
  useEffect(() => {
    const stored = localStorage.getItem(`calendarEvents_${id}`);
    if (stored) setCalendarEvents(JSON.parse(stored));
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`calendarEvents_${id}`, JSON.stringify(calendarEvents));
  }, [calendarEvents, id]);

  const addCalendarEvent = () => {
    if (!selectedDate || !eventTitle) return alert("Please fill date and title");
    const newEvent = { id: Date.now(), date: selectedDate, title: eventTitle, type: eventType, completed: false };
    setCalendarEvents([...calendarEvents, newEvent]);
    setEventTitle("");
  };

  const completeEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter(ev => ev.id !== eventId));
  };

  // ==================== FEEDBACK ====================
  const submitFeedback = async () => {
    if (!showFeedback) return;
    try {
      await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: showFeedback.meetingId,
          fromUserId: id,
          fromModel: "Student",
          toUserId: showFeedback.mentorId,
          toModel: "Mentor",
          rating,
          comment
        })
      });
      alert("Thank you for your feedback!");
    } catch (err) {
      alert("Failed to submit feedback");
    }
    setShowFeedback(null);
    setRating(5);
    setComment("");
  };

  // ==================== FETCH DATA ====================
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

  // ==================== ROADMAP ====================
  const generateRoadmap = async () => {
    let finalDuration = durationOption;
    if (durationOption === "Custom") {
      if (!customDuration.trim()) return alert("Enter custom duration (e.g., 8 weeks)");
      finalDuration = customDuration.trim();
    }
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
      if (!data.roadmap) throw new Error("No roadmap generated");
      let html = `<h1 style="color:#4f46e5;">${data.roadmap.title}</h1>`;
      data.roadmap.weeks.forEach(week => {
        html += `
          <div style="margin-bottom:1rem; padding:1rem; border:1px solid #ddd; border-radius:14px;">
            <h3>Week ${week.week}: ${week.topic || ""}</h3>
            <ul>${week.tasks.map(t => `<li>${t}</li>`).join("")}</ul>
          </div>
        `;
      });
      setRoadmapHtml(html);
      setShowRoadmap(true);
    } catch (err) {
      alert("Roadmap generation failed: " + err.message);
    }
  };

  const downloadRoadmap = () => {
    const element = document.getElementById("roadmap-content");
    if (element) html2pdf().from(element).save("AI-Roadmap.pdf");
  };

  // ==================== MEETING SUMMARY ====================
  const generateSummary = async (meetingId) => {
    try {
      const res = await fetch(`${API}/api/meetings/${meetingId}/summary`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`📋 Meeting Summary:\n\n${data.summary}\n\n✅ Action Items:\n${data.actions.join("\n")}`);
      // Refresh student data to show updated points
      fetchAll();
    } catch (err) {
      alert("Summary not available yet. Please wait until after the meeting.");
    }
  };

  // ==================== UTILITIES ====================
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
      } else alert("Update failed");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleLogout = () => {
    ["token", "role", "user", "loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="mc-loading">
        <div className="mc-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcomingMeetings = meetings.filter(m => m.date >= today);
  const pastMeetings = meetings.filter(m => m.date < today);
  const currentLevel = getLevelInfo(student?.points || 0);
  const points = student?.points || 0;

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

            {/* Achievements Panel - Level + Points */}
            <div className="premium-panel">
              <h3>🏆 Achievement Level</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '3rem' }}>{currentLevel.icon}</div>
                <div>
                  <h2 style={{ margin: 0, color: currentLevel.color }}>{currentLevel.name}</h2>
                  <p style={{ margin: 0 }}>{points} points</p>
                </div>
              </div>
              {currentLevel.next && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ background: '#e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (points / (currentLevel.pointsToNext + points)) * 100)}%`, background: '#14b8a6', height: '10px' }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{currentLevel.pointsToNext} points until {currentLevel.next}</p>
                </div>
              )}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(student?.badges || []).map((b, idx) => (
                  <span key={idx} className="skill-badge" style={{ background: '#fef3c7', color: '#92400e' }}>🏅 {b}</span>
                ))}
                {(!student?.badges || student.badges.length === 0) && <span>No badges yet. Schedule your first meeting!</span>}
              </div>
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
                <p>No notifications yet.</p>
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
                  <button className="btn-outline complete-btn" onClick={() => completeEvent(event.id)}>✅ Complete</button>
                </div>
              ))}
              {calendarEvents.length === 0 && <p>No events. Add one above!</p>}
            </div>
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="meetings-grid">
            <h3 className="section-heading">📅 Upcoming Meetings</h3>
            <div className="meeting-cards-grid">
              {upcomingMeetings.map(m => (
                <div className="meeting-card" key={m._id}>
                  <div className="meeting-header">
                    <h3>📅 {m.date}</h3>
                    <span>⏰ {m.time}</span>
                  </div>
                  <p>{m.message}</p>
                  <div className="meeting-actions">
                    <button className="btn-teal" onClick={() => window.open(`https://meet.jit.si/MentorConnect_${m._id}`, "_blank")}>Join Video Call</button>
                    <button className="btn-outline whiteboard-btn" onClick={() => window.open(`/whiteboard/${m._id}`, '_blank')}>🎨 Whiteboard</button>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && <p className="no-data">No upcoming meetings.</p>}
            </div>

            <h3 className="section-heading" style={{ marginTop: "2rem" }}>✅ Past Meetings</h3>
            <div className="meeting-cards-grid">
              {pastMeetings.map(m => (
                <div className="meeting-card past-meeting" key={m._id}>
                  <div className="meeting-header">
                    <h3>📅 {m.date}</h3>
                    <span>⏰ {m.time}</span>
                  </div>
                  <p>{m.message}</p>
                  <div className="meeting-actions">
                    <button className="btn-outline summary-btn" onClick={() => generateSummary(m._id)}>📝 Summary</button>
                    <button className="btn-outline feedback-btn" onClick={() => setShowFeedback({ meetingId: m._id, mentorId: m.mentorId?._id })}>💬 Feedback</button>
                  </div>
                </div>
              ))}
              {pastMeetings.length === 0 && <p className="no-data">No past meetings yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <>
            <div className="materials-grid">
              {materials.map((m, idx) => (
                <div className="material-card" key={idx}>
                  <div className="material-icon">📘</div>
                  <h3>{m.title}</h3>
                  <p>{m.type}</p>
                  <button className="btn-outline" onClick={() => setSelectedMaterial(m)}>Open</button>
                </div>
              ))}
            </div>
            {selectedMaterial && (
              <div className="modal-overlay" onClick={() => setSelectedMaterial(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <h3>{selectedMaterial.title}</h3>
                  <p>{selectedMaterial.description}</p>
                  <p><strong>Type:</strong> {selectedMaterial.type}</p>
                  <a href={selectedMaterial.url} target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ display: "inline-block", marginTop: "1rem", textDecoration: "none" }}>
                    🔗 Access Material
                  </a>
                  <button className="btn-outline" onClick={() => setSelectedMaterial(null)} style={{ marginTop: "1rem", display: "block" }}>Close</button>
                </div>
              </div>
            )}
          </>
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
                  <input type="text" className="mc-input" value={editEducation} onChange={(e) => setEditEducation(e.target.value)} placeholder="e.g., B.Tech Computer Science" />
                ) : (
                  <p className="info-value">{student?.education || "Not added yet"}</p>
                )}
                <h3 style={{ marginTop: "1.5rem" }}>⚙️ Skills & Interests</h3>
                {isEditingProfile ? (
                  <>
                    <textarea className="mc-input" rows="3" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} placeholder="React, Node.js, AI (comma separated)" />
                    <small className="field-hint">Separate skills with commas</small>
                  </>
                ) : (
                  <div className="skills-wrap">
                    {student?.skills?.length ? student.skills.map((skill, idx) => <span key={idx} className="skill-badge">{skill}</span>) : <p>No skills added yet</p>}
                  </div>
                )}
                <h3 style={{ marginTop: "1.5rem" }}>🏅 Badges & Level</h3>
                <div className="skills-wrap">
                  <span className="skill-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{currentLevel.icon} {currentLevel.name}</span>
                  {(student?.badges || []).map((b, idx) => (
                    <span key={idx} className="skill-badge" style={{ background: '#fef3c7', color: '#92400e' }}>🏅 {b}</span>
                  ))}
                  {(!student?.badges || student.badges.length === 0) && <p>No badges yet. Keep learning!</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal-overlay" onClick={() => setShowFeedback(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Anonymous Feedback</h3>
            <p>Rate your meeting (1‑5):</p>
            <select className="mc-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>)}
            </select>
            <textarea className="mc-input" rows="3" placeholder="Your comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button className="btn-teal" onClick={submitFeedback}>Submit Feedback</button>
              <button className="btn-outline" onClick={() => setShowFeedback(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}