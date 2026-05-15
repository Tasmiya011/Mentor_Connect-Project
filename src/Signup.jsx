// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./theme.css";
import "./Signup.css";

// src/pages/Signup.jsx
export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [expertise, setExpertise] = useState("");
  const [exp, setExp] = useState("");
  const [bio, setBio] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate mentor extra fields
    if (role === "mentor" && (!expertise || !exp)) {
      alert("Please enter your expertise and experience");
      setLoading(false);
      return;
    }

    const payload = { name, email, password, role };

    if (role === "mentor") {
      payload.expertise = expertise;
      payload.exp = exp;
      payload.bio = bio;
      payload.isVolunteer = isVolunteer;
    }

    // For students, we no longer send quizAnswers

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="mc-logo signup-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
          </svg>
          MentorConnect
        </div>
        <h2>Create Your Account</h2>
        <p className="signup-sub">Join MentorConnect and get guidance from expert mentors.</p>

        <form onSubmit={handleSignup}>
          <div className="mc-input-group">
            <label>Full Name</label>
            <input className="mc-input" type="text" placeholder="Your full name"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mc-input-group">
            <label>Email Address</label>
            <input className="mc-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mc-input-group">
            <label>Password</label>
            <input className="mc-input" type="password" placeholder="Create a strong password"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mc-input-group">
            <label>Role</label>
            <select className="mc-input mc-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === "mentor" && (
            <>
              <div className="mc-input-group">
                <label>Expertise (e.g., Machine Learning, Web Dev, Cloud)</label>
                <input className="mc-input" type="text" placeholder="Your main tech expertise"
                  value={expertise} onChange={e => setExpertise(e.target.value)} required />
              </div>
              <div className="mc-input-group">
                <label>Experience (years)</label>
                <input className="mc-input" type="text" placeholder="e.g., 5"
                  value={exp} onChange={e => setExp(e.target.value)} required />
              </div>
              <div className="mc-input-group">
                <label>Short Bio</label>
                <textarea className="mc-input" rows="3" placeholder="Tell us about yourself..."
                  value={bio} onChange={e => setBio(e.target.value)} />
              </div>
              <div className="mc-input-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} />
                  🌱 I want to volunteer for underprivileged students (Social Good)
                </label>
              </div>
            </>
          )}

          <button type="submit" className="btn-teal signup-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="signup-login">
          Already have an account? <span onClick={() => navigate("/login")}>Login →</span>
        </p>
      </div>
    </div>
  );
}