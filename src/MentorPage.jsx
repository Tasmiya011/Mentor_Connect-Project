// src/pages/MentorPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./theme.css";
import "./MentorDashboard.css";

export default function MentorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scheduleData, setScheduleData] = useState({ studentIds: [], date: "", time: "", message: "" });
  const [scheduling, setScheduling] = useState(false);

  // Task assignment state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", assignedTo: [] });
  const [assigning, setAssigning] = useState(false);

  // Notes upload state
  const [noteFile, setNoteFile] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteAssignedTo, setNoteAssignedTo] = useState([]);
  const [uploading, setUploading] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchAll = async () => {
    try {
      const mRes = await fetch(`${API}/api/mentors/${id}`);
      const mentorData = await mRes.json();
      setMentor(mentorData);

      const sRes = await fetch(`${API}/api/students`);
      const allStudents = await sRes.json();
      const assigned = allStudents.filter(s => s.mentorId?._id === id || s.mentorId === id);
      setStudents(assigned);

      const meetRes = await fetch(`${API}/api/meetings/mentor/${id}`);
      const meetingsData = await meetRes.json();
      setMeetings(Array.isArray(meetingsData) ? meetingsData : []);

      const notRes = await fetch(`${API}/api/notifications/user/${id}?model=Mentor`);
      const notData = Array.isArray(await notRes.json()) ? await notRes.json() : [];
      setNotifications(notData);
      setUnreadCount(notData.filter(n => !n.read).length);

      // Fetch tasks (example – you'll need a backend endpoint)
      const tasksRes = await fetch(`${API}/api/tasks/mentor/${id}`);
      const tasksData = await tasksRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const markNotificationsRead = async () => {
    setUnreadCount(0);
    // optionally call API to mark all read
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (scheduleData.studentIds.length === 0) return alert("Select at least one student");
    if (!scheduleData.date || !scheduleData.time || !scheduleData.message) return alert("Fill all fields");
    const today = new Date().toISOString().slice(0,10);
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
      if (!res.ok) throw new Error("Failed");
      alert("Meeting scheduled!");
      setScheduleData({ studentIds: [], date: "", time: "", message: "" });
      await fetchAll();
    } catch (err) { alert(err.message); }
    finally { setScheduling(false); }
  };

  const generateSummary = async (meetingId) => {
    try {
      const res = await fetch(`${API}/api/meetings/${meetingId}/summary`);
      const data = await res.json();
      alert(`📋 Meeting Summary:\n${data.summary}\n\n✅ Action Items:\n${data.actions.join("\n")}`);
    } catch (err) {
      alert("Failed to generate summary: " + err.message);
    }
  };

  // Task assignment
  const assignTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.dueDate || newTask.assignedTo.length === 0) {
      return alert("Fill all fields and select at least one student");
    }
    setAssigning(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          mentorId: id,
          studentIds: newTask.assignedTo,
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
        }),
      });
      if (!res.ok) throw new Error("Failed to assign task");
      alert("Task assigned successfully!");
      setNewTask({ title: "", description: "", dueDate: "", assignedTo: [] });
      await fetchAll();
    } catch (err) { alert(err.message); }
    finally { setAssigning(false); }
  };

  // Upload notes (file + title) to selected students
  const uploadNotes = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteFile || noteAssignedTo.length === 0) {
      return alert("Please provide a title, select a file, and choose students");
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("title", noteTitle);
    formData.append("file", noteFile);
    formData.append("mentorId", id);
    noteAssignedTo.forEach(sid => formData.append("studentIds", sid));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/notes/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Notes uploaded and shared with students!");
      setNoteTitle("");
      setNoteFile(null);
      setNoteAssignedTo([]);
      document.getElementById("noteFileInput").value = "";
    } catch (err) { alert(err.message); }
    finally { setUploading(false); }
  };

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading...</p></div>;
  if (!mentor) return <div className="mc-loading"><p>Mentor not found.</p></div>;

  const today = new Date().toISOString().slice(0,10);
  const todayMeetings = meetings.filter(m => m.date === today);

  return (
    <div className="mentor-layout">
      {/* SIDEBAR with Notifications, Upload Notes, etc. */}
      <aside className="mentor-sidebar">
        <div className="sidebar-logo">MentorConnect</div>

        {/* Notifications box inside sidebar */}
        <div className="sidebar-notification-box">
          <h4>🔔 Notifications ({unreadCount})</h4>
          {notifications.slice(0, 3).map(n => (
            <div key={n._id} className="sidebar-notification">
              {n.message}
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))}
          {notifications.length === 0 && <div className="sidebar-notification">No new notifications</div>}
          <button className="btn-outline-small" onClick={markNotificationsRead}>Mark all read</button>
        </div>

        {/* Upload Notes section */}
        <div className="sidebar-upload-box">
          <h4>📄 Upload Notes</h4>
          <input type="text" placeholder="Note title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} className="mc-input-small" />
          <input type="file" id="noteFileInput" onChange={e => setNoteFile(e.target.files[0])} className="mc-input-small" />
          <select multiple className="mc-input-small" value={noteAssignedTo} onChange={e => setNoteAssignedTo(Array.from(e.target.selectedOptions, o => o.value))} size="3">
            {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button className="btn-teal-small" onClick={uploadNotes} disabled={uploading}>{uploading ? "Uploading..." : "Upload & Share"}</button>
        </div>

        <ul className="mentor-sidebar-nav">
          <li><button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button></li>
          <li><button className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>📅 Schedule</button></li>
          <li><button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>👨‍🎓 My Students</button></li>
          <li><button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>✅ Assign Tasks</button></li>
          <li><button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>👤 Profile</button></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <main className="mentor-main">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-top">
              <div className="welcome-card">
                <h1>Welcome, {mentor.name}</h1>
                <p>Your mentorship dashboard</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><h2>{students.length}/{mentor.maxMentees || 5}</h2><p>Mentees</p></div>
              <div className="stat-card"><h2>{meetings.length}</h2><p>Meetings</p></div>
              <div className="stat-card"><h2>{notifications.length}</h2><p>Notifications</p></div>
            </div>

            <div className="dashboard-grid">
              <div className="premium-panel">
                <h3>📌 Today's Meetings</h3>
                {todayMeetings.length === 0 ? <p>No meetings today.</p> : todayMeetings.map(m => (
                  <div key={m._id} className="meeting-item">
                    <strong>{m.time}</strong> – {m.message}<br />
                    <button className="btn-teal-small" onClick={() => window.open(`https://meet.jit.si/MentorConnect_${m._id}`, '_blank')}>Join</button>
                    <button className="btn-outline-small" onClick={() => generateSummary(m._id)}>Summary</button>
                  </div>
                ))}
              </div>

              <div className="premium-panel">
                <h3>✅ Assigned Tasks</h3>
                {tasks.slice(0,5).map(t => (
                  <div key={t._id} className="task-item">
                    <strong>{t.title}</strong> – Due: {t.dueDate}<br />
                    <span>Assigned to: {t.studentNames?.join(", ") || t.studentIds?.length} students</span>
                  </div>
                ))}
                {tasks.length === 0 && <p>No tasks assigned yet.</p>}
              </div>
            </div>
          </>
        )}

        {/* Schedule Meeting Tab */}
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

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="premium-panel">
            <h2>👨‍🎓 My Students</h2>
            <div className="table-responsive">
              <table className="mc-table">
                <thead><tr><th>Name</th><th>Email</th><th>Interests</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{(s.interests || []).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assign Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="premium-panel">
            <h2>✅ Assign Task to Mentees</h2>
            <form onSubmit={assignTask}>
              <div className="form-group"><label>Task Title</label><input className="mc-input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="mc-input" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Due Date</label><input className="mc-input" type="date" min={today} value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required /></div>
                <div className="form-group"><label>Assign to (hold Ctrl)</label><select multiple className="mc-input" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: Array.from(e.target.selectedOptions, o => o.value)})} style={{ height: "100px" }}>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select></div>
              </div>
              <button type="submit" className="btn-teal" disabled={assigning}>{assigning ? "Assigning..." : "Assign Task"}</button>
            </form>

            <hr />
            <h3>Previously Assigned Tasks</h3>
            {tasks.map(t => (
              <div key={t._id} className="task-card">
                <strong>{t.title}</strong> – Due {t.dueDate}
                <p>{t.description}</p>
                <small>Assigned to: {t.studentNames?.join(", ") || t.studentIds?.length} students</small>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="premium-panel">
            <h2>👨‍🏫 Mentor Profile</h2>
            <div className="profile-grid">
              <div><p><strong>Name:</strong> {mentor.name}</p><p><strong>Email:</strong> {mentor.email}</p><p><strong>Expertise:</strong> {mentor.expertise}</p><p><strong>Experience:</strong> {mentor.exp} years</p></div>
              {mentor.isVolunteer && <div><span className="skill-badge">🌱 Volunteer Mentor</span></div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}