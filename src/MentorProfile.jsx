import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./theme.css";

export default function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/mentors/${id}`)
      .then(res => res.json())
      .then(data => setMentor(data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/students`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(s => s.mentorId && s.mentorId._id === id);
        setAssignedStudents(filtered);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (!mentor) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading mentor profile...</p></div>;

  return (
    <div className="mc-layout">
      <aside className="mc-sidebar">
        <div className="mc-sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
          </svg>
          Mentor<span>Connect</span>
        </div>
        <div className="mc-sidebar-section">Mentor</div>
        <ul className="mc-sidebar-nav">
          <li><Link to={`/mentorpage/${id}`}><span>🏠</span> Dashboard</Link></li>
          <li><Link to="#" className="active"><span>👤</span> My Profile</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Mentor Profile</h1>
          <p>Your details and assigned mentees.</p>
        </div>

        <div className="mc-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="mc-panel-header"><h3>Profile Information</h3></div>
          <div className="mc-panel-body">
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <div className="mc-avatar mc-avatar-lg">{mentor.name?.charAt(0)}</div>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--brand-dark)" }}>{mentor.name}</h2>
                <p><strong>Email:</strong> {mentor.email}</p>
                <p><strong>Department:</strong> {mentor.dept}</p>
                <p><strong>Experience:</strong> {mentor.exp} years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mc-panel">
          <div className="mc-panel-header">
            <h3>Assigned Students</h3>
            <span className="mc-badge mc-badge-teal">{assignedStudents.length}</span>
          </div>
          <div className="mc-panel-body">
            {assignedStudents.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No students assigned yet.</p>
            ) : (
              <table className="mc-table">
                <thead><tr><th>Name</th><th>Email</th><th>Semester</th></tr></thead>
                <tbody>
                  {assignedStudents.map(s => (
                    <tr key={s._id}>
                      <td>{s.name}</td><td>{s.email}</td><td><span className="mc-badge mc-badge-blue">Sem {s.semester}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}