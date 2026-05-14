import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./theme.css";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.trim(),   // ✅ backend expects "username"
          password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data));
      if (role === "student") navigate(`/StudentPage/${data._id}`);
      else if (role === "mentor") navigate(`/MentorPage/${data._id}`);
      else if (role === "admin") navigate("/Dashboard");
      else if (role === "hod") navigate(`/HodPage/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["student", "mentor", "admin"];

  return (
    <div className="login-page-wrapper">
      <div className="login-left">
        <div className="login-left-content">
          <div className="mc-logo login-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
            </svg>
            MentorConnect
          </div>
          <h2>AI-Based Student<br/>Guidance System</h2>
          <p>Connect with expert mentors tailored to your skills, interests and career goals.</p>
          <div className="login-features">
            {["Personalised matching","Smart recommendations","Scheduled meetings","Real-time notifications"].map((f,i) => (
              <div key={i} className="login-feature-item"><span className="login-check">✓</span> {f}</div>
            ))}
          </div>
        </div>
        <div className="login-compass-bg">🧭</div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Login to MentorConnect</h2>
          <p className="login-sub">Please enter your credentials to continue.</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="login-role-group">
              {roles.map(r => (
                <label key={r} className={`login-role-pill ${role === r ? "active" : ""}`}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={e => setRole(e.target.value)} />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </label>
              ))}
            </div>
            <button type="submit" className="login-btn login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="login-register">Don't have an account? <span onClick={() => navigate("/signup")}>Register →</span></p>
          <p className="login-bottom-note">Built as your guide. Let's make mentorship a reality!</p>
        </div>
      </div>
    </div>
  );
}