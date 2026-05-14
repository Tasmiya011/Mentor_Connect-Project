import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";

export default function AddStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");
  const [password, setPassword] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      const [studentsRes, mentorsRes] = await Promise.all([
        fetch(`${API}/api/students`).then(r => r.json()),
        fetch(`${API}/api/mentors`).then(r => r.json()),
      ]);
      setStudents(studentsRes);
      setMentors(mentorsRes);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async () => {
    if (!name || !email || !semester || !password) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, semester, password, mentorId: mentorId || null }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }
      alert("Student added successfully!");
      setName(""); setEmail(""); setSemester(""); setPassword(""); setMentorId("");
      await fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading...</p></div>;

  return (
    <div className="mc-layout">
      <aside className="mc-sidebar">
        <div className="mc-sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
          </svg>
          Mentor<span>Connect</span>
        </div>
        <div className="mc-sidebar-section">Admin</div>
        <ul className="mc-sidebar-nav">
          <li><Link to="/dashboard"><span>🏠</span> Dashboard</Link></li>
          <li><Link to="/mentors"><span>👨‍🏫</span> Mentors</Link></li>
          <li><Link to="/students"><span>👨‍🎓</span> Students</Link></li>
          <li><Link to="/addmentor"><span>➕</span> Add Mentor</Link></li>
          <li><Link to="/addstudent" className="active"><span>➕</span> Add Student</Link></li>
          <li><Link to="/AssignMentor"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Add Student</h1>
          <p>Register a new student and optionally assign a mentor.</p>
        </div>

        <div className="mc-panel" style={{ maxWidth: "600px" }}>
          <div className="mc-panel-body">
            <div className="mc-input-group"><label>Full Name</label><input className="mc-input" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="mc-input-group"><label>Email</label><input className="mc-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="mc-input-group"><label>Semester</label><input className="mc-input" type="number" value={semester} onChange={e => setSemester(e.target.value)} /></div>
            <div className="mc-input-group"><label>Password</label><input className="mc-input" type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <div className="mc-input-group">
              <label>Assign Mentor (optional)</label>
              <select className="mc-input mc-select" value={mentorId} onChange={e => setMentorId(e.target.value)}>
                <option value="">-- None --</option>
                {mentors.map(m => <option key={m._id} value={m._id}>{m.name} ({m.dept})</option>)}
              </select>
            </div>
            <button className="btn-teal" onClick={handleAddStudent} disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Adding..." : "Add Student"}
            </button>
          </div>
        </div>

        <h3 style={{ marginTop: "2rem", fontFamily: "var(--font-display)" }}>Student List</h3>
        <div className="mc-panel">
          <div className="mc-panel-body">
            {students.length === 0 ? <p>No students yet.</p> : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {students.map(s => (
                  <li key={s._id} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                    <strong>{s.name}</strong> – {s.email} | Sem {s.semester} | Mentor: {s.mentorId?.name || "None"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}