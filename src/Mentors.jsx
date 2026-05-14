import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";
import "./Mentors.css";

export default function Mentors() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view mentors");
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/api/mentors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setMentors(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [navigate]);

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  if (loading) return <div className="mc-loading"><div className="mc-spinner"></div><p>Loading mentors...</p></div>;

  return (
    <div className="mc-layout">
      <aside className="mc-sidebar">
        <div className="mc-sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
          </svg>
          Mentor<span>Connect</span>
        </div>
        <div className="mc-sidebar-section">Explore</div>
        <ul className="mc-sidebar-nav">
          <li><Link to="/dashboard"><span>🏠</span> Dashboard</Link></li>
          <li><Link to="/mentors" className="active"><span>👨‍🏫</span> Mentors</Link></li>
          <li><Link to="/students"><span>👨‍🎓</span> Students</Link></li>
          <li><Link to="/AssignMentor"><span>🔗</span> Assign Mentor</Link></li>
          <li><Link to="/report"><span>📊</span> Reports</Link></li>
        </ul>
        <button className="mc-sidebar-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
      </aside>

      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Expert Mentors</h1>
          <p>Connect with industry professionals in your field of interest.</p>
        </div>
        <div className="mentors-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {mentors.map(mentor => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-avatar">{mentor.name?.charAt(0).toUpperCase()}</div>
              <h4>{mentor.name}</h4>
              <p className="mentor-exp">Experience: {mentor.exp} years</p>
              {mentor.expertise && <p className="mentor-exp">Expertise: {mentor.expertise}</p>}
              <Link to={`/mentor/${mentor._id}`}>
                <button className="view-profile-btn">View Profile →</button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}