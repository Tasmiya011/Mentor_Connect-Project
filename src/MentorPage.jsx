// src/pages/MentorPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./theme.css";
import "./MentorDashboard.css";

export default function MentorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scheduleData, setScheduleData] = useState({ studentIds: [], date: "", time: "", message: "" });
  const [scheduling, setScheduling] = useState(false);

  // Materials
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: "", description: "", link: "" });

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Meeting");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ studentId: "", title: "", description: "", dueDate: "" });

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editExpertise, setEditExpertise] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editExp, setEditExp] = useState("");

  // Level calculation
  const getLevelInfo = (points) => {
    if (points >= 1000) return { name: 'Ace', icon: '🦅', color: '#ffd700', next: null, pointsToNext: 0 };
    if (points >= 500) return { name: 'Platinum', icon: '💎', color: '#b0c4de', next: 'Ace', pointsToNext: 1000 - points };
    if (points >= 250) return { name: 'Gold', icon: '🥇', color: '#ffd700', next: 'Platinum', pointsToNext: 500 - points };
    if (points >= 100) return { name: 'Silver', icon: '🥈', color: '#c0c0c0', next: 'Gold', pointsToNext: 250 - points };
    return { name: 'Bronze', icon: '🥉', color: '#cd7f32', next: 'Silver', pointsToNext: 100 - points };
  };

  // Persist calendar events
  useEffect(() => {
    const stored = localStorage.getItem(`mentorCalendarEvents_${id}`);
    if (stored) setCalendarEvents(JSON.parse(stored));
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`mentorCalendarEvents_${id}`, JSON.stringify(calendarEvents));
  }, [calendarEvents, id]);

  const addCalendarEvent = () => {
    if (!selectedDate || !eventTitle) return alert("Fill date and title");
    const newEvent = { id: Date.now(), date: selectedDate, title: eventTitle, type: eventType, completed: false };
    setCalendarEvents([...calendarEvents, newEvent]);
    setEventTitle("");
  };

  const completeEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter(ev => ev.id !== eventId));
  };

  // Fetch all data
  const fetchAll = async () => {
    try {
      const mentorRes = await fetch(`${API}/api/mentors/${id}`);
      if (!mentorRes.ok) throw new Error(`Mentor fetch failed: ${mentorRes.status}`);
      const mentorData = await mentorRes.json();
      setMentor(mentorData);
      setEditName(mentorData.name || "");
      setEditExpertise(mentorData.expertise || "");
      setEditBio(mentorData.bio || "");
      setEditExp(mentorData.exp?.toString() || "");

      const studentsRes = await fetch(`${API}/api/students`);
      if (!studentsRes.ok) throw new Error(`Students fetch failed: ${studentsRes.status}`);
      const allStudents = await studentsRes.json();
      const assigned = allStudents.filter(s => s.mentorId?._id === id || s.mentorId === id);
      setStudents(assigned);

      const meetingsRes = await fetch(`${API}/api/meetings/mentor/${id}`);
      if (!meetingsRes.ok) throw new Error(`Meetings fetch failed: ${meetingsRes.status}`);
      const meetingsData = await meetingsRes.json();
      setMeetings(Array.isArray(meetingsData) ? meetingsData : []);

      const notifRes = await fetch(`${API}/api/notifications/user/${id}?model=Mentor`);
      if (!notifRes.ok) throw new Error(`Notifications fetch failed: ${notifRes.status}`);
      const notifData = await notifRes.json();
      setNotifications(Array.isArray(notifData) ? notifData : []);
      setUnreadCount(notifData.filter(n => !n.read).length);

      const matsRes = await fetch(`${API}/api/materials/mentor/${id}`);
      if (matsRes.ok) {
        const matsData = await matsRes.json();
        setMaterials(Array.isArray(matsData) ? matsData : []);
      } else {
        setMaterials([]);
      }

      // Fetch tasks (from localStorage for demo)
      const storedTasks = localStorage.getItem(`mentorTasks_${id}`);
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      else setTasks([]);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (mentor) {
      localStorage.setItem(`mentorTasks_${mentor._id}`, JSON.stringify(tasks));
    }
  }, [tasks, mentor]);

  const markNotificationsRead = async () => {
    setUnreadCount(0);
    setShowNotifDropdown(false);
  };

  // Schedule meeting
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (scheduleData.studentIds.length === 0) return alert("Select at least one student");
    if (!scheduleData.date || !scheduleData.time || !scheduleData.message) return alert("Fill all fields");
    const today = new Date().toISOString().slice(0, 10);
    if (scheduleData.date < today) return alert("Cannot schedule meeting in the past");

    setScheduling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          mentorId: id,
          studentIds: scheduleData.studentIds,
          date: scheduleData.date,
          time: scheduleData.time,
          message: scheduleData.message,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Meeting scheduled!");
      setScheduleData({ studentIds: [], date: "", time: "", message: "" });
      await fetchAll();
    } catch (err) { alert(err.message); }
    finally { setScheduling(false); }
  };

  // Add material
  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.link) return alert("Title and link required");
    try {
      const res = await fetch(`${API}/api/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: id,
          title: newMaterial.title,
          description: newMaterial.description,
          link: newMaterial.link
        })
      });
      if (res.ok) {
        alert("Material added!");
        setNewMaterial({ title: "", description: "", link: "" });
        fetchAll();
      } else alert("Failed to add");
    } catch (err) { alert("Error"); }
  };

  // ==================== TASKS ====================
  const assignTask = () => {
    if (!newTask.studentId || !newTask.title || !newTask.dueDate) {
      alert("Please select a student, enter title and due date");
      return;
    }
    const studentName = students.find(s => s._id === newTask.studentId)?.name || "Unknown";
    const task = {
      id: Date.now(),
      mentorId: id,
      studentId: newTask.studentId,
      studentName,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setNewTask({ studentId: "", title: "", description: "", dueDate: "" });
    alert("Task assigned successfully!");

    // Also save to student's localStorage (so student can see it)
    const studentTasksKey = `studentTasks_${newTask.studentId}`;
    const existing = localStorage.getItem(studentTasksKey);
    const studentTasks = existing ? JSON.parse(existing) : [];
    studentTasks.push(task);
    localStorage.setItem(studentTasksKey, JSON.stringify(studentTasks));
  };

  const markTaskCompleted = (taskId) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t);
    setTasks(updated);
    // Update student's copy as well
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const studentTasksKey = `studentTasks_${task.studentId}`;
      const existing = localStorage.getItem(studentTasksKey);
      let studentTasks = existing ? JSON.parse(existing) : [];
      studentTasks = studentTasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t);
      localStorage.setItem(studentTasksKey, JSON.stringify(studentTasks));
      // Notify mentor (add a notification)
      const notif = {
        id: Date.now(),
        userId: id,
        message: `Task "${task.title}" completed by ${task.studentName}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const storedNotifs = localStorage.getItem(`mentorNotifications_${id}`);
      const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      notifs.unshift(notif);
      localStorage.setItem(`mentorNotifications_${id}`, JSON.stringify(notifs));
      // Also update UI notifications
      setNotifications([notif, ...notifications]);
      setUnreadCount(unreadCount + 1);
    }
  };

  // Edit profile
  const saveProfile = async () => {
    try {
      const res = await fetch(`${API}/api/mentors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          expertise: editExpertise,
          bio: editBio,
          exp: parseInt(editExp) || 0
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setMentor(updated);
        setIsEditingProfile(false);
        alert("Profile updated!");
      } else alert("Update failed");
    } catch (err) { alert("Error"); }
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
  const currentLevel = getLevelInfo(mentor?.points || 0);
  const points = mentor?.points || 0;

  return (
    <div className="mentor-layout">
      <aside className="mentor-sidebar">
        <div className="sidebar-logo">MentorConnect</div>
        <ul className="mentor-sidebar-nav">
          <li><button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button></li>
          <li><button className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>📅 Schedule</button></li>
          <li><button className={activeTab === "meetings" ? "active" : ""} onClick={() => setActiveTab("meetings")}>🎥 Meetings</button></li>
          <li><button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>👨‍🎓 My Students</button></li>
          <li><button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>✅ Tasks</button></li>
          <li><button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}>📚 Materials</button></li>
          <li><button className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>📅 Calendar</button></li>
          <li><button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>👤 Profile</button></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <main className="mentor-main">
        {/* Notification Bell (kept, but removed bottom panel) */}
        <div style={{ position: "relative", textAlign: "right", marginBottom: "1rem" }}>
          <button className="btn-icon" onClick={() => setShowNotifDropdown(!showNotifDropdown)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", position: "relative" }}>
            🔔 {unreadCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-10px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem" }}>{unreadCount}</span>}
          </button>
          {showNotifDropdown && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">🔔 Notifications</div>
              {notifications.slice(0, 5).map(n => <div key={n._id} className="notif-item"><p>{n.message}</p><small>{new Date(n.createdAt).toLocaleString()}</small></div>)}
              <button className="btn-teal" onClick={markNotificationsRead} style={{ width: "100%", marginTop: "0.5rem" }}>Mark all read</button>
            </div>
          )}
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-top">
              <div className="welcome-card">
                <h1>Welcome, {mentor?.name}</h1>
                <p>Your mentorship dashboard</p>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><h2>{students.length}/{mentor?.maxMentees || 5}</h2><p>Mentees</p></div>
              <div className="stat-card"><h2>{meetings.length}</h2><p>Meetings</p></div>
              <div className="stat-card"><h2>{tasks.length}</h2><p>Assigned Tasks</p></div>
            </div>

            <div className="premium-panel">
              <h3>🏆 Mentor Achievement Level</h3>
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
                {(mentor?.badges || []).map((b, idx) => (
                  <span key={idx} className="skill-badge" style={{ background: '#fef3c7', color: '#92400e' }}>🏅 {b}</span>
                ))}
                {(!mentor?.badges || mentor.badges.length === 0) && <span>No badges yet. Continue mentoring!</span>}
              </div>
            </div>

            <div className="premium-panel">
              <h3>📌 Today's Meetings</h3>
              {meetings.filter(m => m.date === today).length === 0 ? (
                <p>No meetings today.</p>
              ) : (
                meetings.filter(m => m.date === today).map(m => (
                  <div key={m._id} className="meeting-item">
                    <strong>{m.time}</strong> – {m.message}<br />
                    <div className="meeting-actions">
                      <button className="btn-teal" onClick={() => window.open(`https://meet.jit.si/MentorConnect_${m._id}`, '_blank')}>Join</button>
                      <button className="btn-outline whiteboard-btn" onClick={() => window.open(`/whiteboard/${m._id}`, '_blank')}>Whiteboard</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Removed the "Recent Notifications" panel */}
          </>
        )}

        {activeTab === "schedule" && (
          <div className="premium-panel">
            <h2>📅 Schedule a Meeting</h2>
            <form onSubmit={handleSchedule}>
              <div className="form-group">
                <label>Select Students (hold Ctrl for multiple)</label>
                <select multiple className="mc-input" value={scheduleData.studentIds} onChange={e => setScheduleData({...scheduleData, studentIds: Array.from(e.target.selectedOptions, o => o.value)})} style={{ height: "120px" }}>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Date</label><input className="mc-input" type="date" min={today} value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} required /></div>
                <div className="form-group"><label>Time</label><input className="mc-input" type="time" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Message</label><textarea className="mc-input" rows="3" value={scheduleData.message} onChange={e => setScheduleData({...scheduleData, message: e.target.value})} required /></div>
              <button type="submit" className="btn-teal" disabled={scheduling}>{scheduling ? "Scheduling..." : "Schedule Meeting"}</button>
            </form>
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
                  <p><strong>Students:</strong> {m.studentIds?.map(s => s.name).join(", ")}</p>
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
                  <p><strong>Students:</strong> {m.studentIds?.map(s => s.name).join(", ")}</p>
                  <p>{m.message}</p>
                </div>
              ))}
              {pastMeetings.length === 0 && <p className="no-data">No past meetings yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="premium-panel">
            <h2>👨‍🎓 My Students</h2>
            <table className="mc-table">
              <thead><tr><th>Name</th><th>Email</th><th>Interests</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{(s.interests || []).join(", ")}</td>
                    <td><button className="btn-outline" onClick={() => alert(`Messaging coming soon – chat with ${s.name}`)}>Message</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="premium-panel">
            <h2>✅ Assign Tasks to Students</h2>
            <div className="calendar-grid">
              <select className="mc-input" value={newTask.studentId} onChange={e => setNewTask({...newTask, studentId: e.target.value})}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input className="mc-input" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              <textarea className="mc-input" rows="2" placeholder="Description (optional)" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              <input className="mc-input" type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
            </div>
            <button className="btn-teal" onClick={assignTask}>➕ Assign Task</button>

            <h3 style={{ marginTop: "2rem" }}>Assigned Tasks</h3>
            <div className="tasks-grid">
              {tasks.length === 0 ? (
                <p>No tasks assigned yet.</p>
              ) : (
                tasks.map(task => (
                  <div className="task-card" key={task.id}>
                    <h4>{task.title}</h4>
                    <p><strong>Student:</strong> {task.studentName}</p>
                    <p><strong>Due:</strong> {task.dueDate}</p>
                    <p><strong>Status:</strong> <span className={task.status === "Completed" ? "task-status completed" : "task-status pending"}>{task.status}</span></p>
                    {task.description && <p><strong>Description:</strong> {task.description}</p>}
                    {task.status === "Pending" && (
                      <button className="btn-outline" onClick={() => markTaskCompleted(task.id)}>Mark as Completed (manually)</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="premium-panel">
            <h2>📚 Upload Study Materials</h2>
            <div className="calendar-grid">
              <input className="mc-input" placeholder="Title" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} />
              <input className="mc-input" placeholder="Description (optional)" value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} />
              <input className="mc-input" placeholder="Link (URL)" value={newMaterial.link} onChange={e => setNewMaterial({...newMaterial, link: e.target.value})} />
            </div>
            <button className="btn-teal" onClick={handleAddMaterial}>➕ Add Material</button>

            <h3 style={{ marginTop: "2rem" }}>Your Shared Materials</h3>
            <div className="materials-grid">
              {materials.length === 0 ? (
                <p>No materials uploaded yet.</p>
              ) : (
                materials.map((mat, idx) => (
                  <div className="material-card" key={idx}>
                    <div className="material-icon">📘</div>
                    <h3>{mat.title}</h3>
                    <p>{mat.description || "No description"}</p>
                    <a href={mat.link} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "inline-block", marginTop: "0.5rem" }}>Open</a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="premium-panel">
            <h2>📅 My Calendar</h2>
            <div className="calendar-grid">
              <input type="date" className="mc-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              <input className="mc-input" placeholder="Event / Task" value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
              <select className="mc-input" value={eventType} onChange={e => setEventType(e.target.value)}>
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

        {activeTab === "profile" && (
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">{mentor?.name?.charAt(0).toUpperCase()}</div>
              <div className="profile-title">
                <h2>Mentor Profile</h2>
                <p>Manage your professional information</p>
              </div>
              {!isEditingProfile ? (
                <button className="btn-outline edit-btn" onClick={() => setIsEditingProfile(true)}>✏️ Edit Profile</button>
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
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  {isEditingProfile ? <input className="mc-input" value={editName} onChange={e => setEditName(e.target.value)} /> : <span className="info-value">{mentor?.name}</span>}
                </div>
                <div className="info-row"><span className="info-label">Email</span><span className="info-value">{mentor?.email}</span></div>
                <div className="info-row">
                  <span className="info-label">Experience (years)</span>
                  {isEditingProfile ? <input className="mc-input" type="number" value={editExp} onChange={e => setEditExp(e.target.value)} /> : <span className="info-value">{mentor?.exp} years</span>}
                </div>
              </div>
              <div className="profile-info-card">
                <h3>🎓 Professional Details</h3>
                <div className="info-row">
                  <span className="info-label">Expertise</span>
                  {isEditingProfile ? <input className="mc-input" value={editExpertise} onChange={e => setEditExpertise(e.target.value)} placeholder="e.g., Full Stack, AI/ML" /> : <span className="info-value">{mentor?.expertise || "Not set"}</span>}
                </div>
                <div className="info-row">
                  <span className="info-label">Bio</span>
                  {isEditingProfile ? <textarea className="mc-input" rows="3" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell about your mentoring style..." /> : <span className="info-value">{mentor?.bio || "No bio added yet"}</span>}
                </div>
                {mentor?.isVolunteer && <div className="info-row"><span className="info-label">Volunteer</span><span className="mc-badge mc-badge-green">🌱 Volunteer Mentor</span></div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}