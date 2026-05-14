import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view students");
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/api/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setStudents(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [navigate]);

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading students...</p></div>;

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
          <li><Link to="/students" className="active"><span>👨‍🎓</span> Students</Link></li>
          <li><Link to="/AssignMentor"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>All Students</h1>
          <p>List of registered students and their assigned mentors.</p>
        </div>
        <div className="mc-panel">
          <table className="mc-table">
            <thead>
              <tr><th>Student</th><th>Email</th><th>Mentor</th><th>Action</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="mc-avatar" style={{ width: 32, height: 32, fontSize: "0.85rem" }}>{s.name?.charAt(0)}</div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{s.email}</td>
                  <td>
                    {s.mentorId?.name ? (
                      <span className="mc-badge mc-badge-green">{s.mentorId.name}</span>
                    ) : (
                      <span className="mc-badge mc-badge-yellow">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/student/${s._id}`}>
                      <button className="btn-teal" style={{ padding: "5px 14px", fontSize: "0.78rem" }}>View →</button>
                    </Link>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}