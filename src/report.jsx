import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";

export default function Report() {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/api/assign`);
        const data = await res.json();
        setStudentList(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading report...</p></div>;

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
          <li><Link to="/AssignMentor"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report" className="active"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Mentor–Mentee Report</h1>
        </div>
        <div className="mc-panel">
          <table className="mc-table">
            <thead>
              <tr><th>Student Name</th><th>Mentor Name</th><th>Department</th><th>Mentor Experience</th></tr>
            </thead>
            <tbody>
              {studentList.map((student, idx) => {
                const mentor = student.mentorId;
                return (
                  <tr key={student._id} style={{ backgroundColor: idx % 2 === 0 ? "var(--bg-page)" : "white" }}>
                    <td>{student.name}</td><td>{mentor?.name || "Not Assigned"}</td><td>{mentor?.dept || "-"}</td><td>{mentor?.exp || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}