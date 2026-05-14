import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";

export default function AssignMentor() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const loadData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch(`${API}/api/mentors`).then(r => r.json()),
        fetch(`${API}/api/students`).then(r => r.json()),
      ]);
      setMentors(Array.isArray(mRes) ? mRes : []);
      setStudents(Array.isArray(sRes) ? sRes : []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedMentor) {
      setFilteredStudents([]);
      return;
    }
    const mentor = mentors.find(m => m._id === selectedMentor);
    if (!mentor || !mentor.dept) {
      setFilteredStudents(students);
      return;
    }
    const filtered = students.filter(s => s.dept && s.dept.toLowerCase() === mentor.dept.toLowerCase());
    setFilteredStudents(filtered.length ? filtered : students);
  }, [selectedMentor, mentors, students]);

  const assignMentor = async () => {
    if (!selectedMentor || !selectedStudent) {
      alert("Please select both mentor and student.");
      return;
    }
    setAssigning(true);
    try {
      const res = await fetch(`${API}/api/students/${selectedStudent}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: selectedMentor }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Assignment failed");
      }
      alert("Mentor assigned successfully!");
      await loadData();
      setSelectedMentor("");
      setSelectedStudent("");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAssigning(false);
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
          <li><Link to="/addstudent"><span>➕</span> Add Student</Link></li>
          <li><Link to="/AssignMentor" className="active"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Assign Mentor to Student</h1>
          <p>Match a student with a mentor (department‑wise suggestions).</p>
        </div>

        <div className="mc-panel" style={{ maxWidth: "600px" }}>
          <div className="mc-panel-body">
            <div className="mc-input-group">
              <label>Select Mentor</label>
              <select className="mc-input mc-select" value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}>
                <option value="">-- Choose Mentor --</option>
                {mentors.map(m => <option key={m._id} value={m._id}>{m.name} ({m.dept || "No Dept"})</option>)}
              </select>
            </div>

            {selectedMentor && (
              <div className="mc-input-group">
                <label>Select Student</label>
                <select className="mc-input mc-select" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                  <option value="">-- Choose Student --</option>
                  {filteredStudents.map(s => <option key={s._id} value={s._id}>{s.name} {s.mentorId ? "(Already assigned)" : ""}</option>)}
                </select>
              </div>
            )}

            <button className="btn-teal" onClick={assignMentor} disabled={assigning} style={{ width: "100%" }}>
              {assigning ? "Assigning..." : "Assign Mentor"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}