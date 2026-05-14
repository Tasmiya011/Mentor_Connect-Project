import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./theme.css";

export default function AddMentor() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [exp, setExp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api/mentors";

  useEffect(() => {
    axios.get(API).then((res) => setMentors(res.data));
  }, []);

  const handleAddMentor = async () => {
    if (!name || !email || !dept || !exp || !password) {
      alert("Fill all fields including password");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(API, { name, email, dept, exp, password });
      setMentors([...mentors, res.data.mentor]);
      alert("Mentor added!");
      setName(""); setEmail(""); setDept(""); setExp(""); setPassword("");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    ["token", "role", "user", "loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

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
          <li><Link to="/addmentor" className="active"><span>➕</span> Add Mentor</Link></li>
          <li><Link to="/addstudent"><span>➕</span> Add Student</Link></li>
          <li><Link to="/AssignMentor"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Add Mentor</h1>
          <p>Create a new mentor profile.</p>
        </div>

        <div className="mc-panel" style={{ maxWidth: "600px" }}>
          <div className="mc-panel-body">
            <div className="mc-input-group">
              <label>Full Name</label>
              <input className="mc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Dr. Sarah Johnson" />
            </div>
            <div className="mc-input-group">
              <label>Email</label>
              <input className="mc-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mentor@example.com" />
            </div>
            <div className="mc-input-group">
              <label>Department</label>
              <input className="mc-input" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g., Computer Science" />
            </div>
            <div className="mc-input-group">
              <label>Experience (years)</label>
              <input className="mc-input" type="number" value={exp} onChange={(e) => setExp(e.target.value)} placeholder="e.g., 8" />
            </div>
            <div className="mc-input-group">
              <label>Password</label>
              <input className="mc-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a secure password" />
            </div>
            <button className="btn-teal" onClick={handleAddMentor} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Adding..." : "Add Mentor"}
            </button>
          </div>
        </div>

        <h3 style={{ marginTop: "2rem", fontFamily: "var(--font-display)" }}>Existing Mentors</h3>
        <div className="mc-panel">
          <div className="mc-panel-body">
            {mentors.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No mentors yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {mentors.map((m) => (
                  <li key={m._id} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                    <strong>{m.name}</strong> – {m.email} | {m.dept} | {m.exp} yrs
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