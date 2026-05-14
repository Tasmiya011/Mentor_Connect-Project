// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";   // ensure this file exists at src/pages/DarkModeToggle.jsx
import "./theme.css";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);

  const checkLogin = (path) => {
    const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("loggedUser") || "null")?.token;
    if (!token) { alert("Please login first"); navigate("/login"); return; }
    navigate(path);
  };

  const handleLogout = () => {
    ["token","role","user","loggedUser"].forEach(k => localStorage.removeItem(k));
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token") || !!JSON.parse(localStorage.getItem("loggedUser") || "null")?.token;

  const features = [
    { icon: "🤖", title: "AI Mentor Matching", desc: "Smart TF‑IDF matching based on your interests & quiz", detail: "Our algorithm analyzes your skills and preferences to find the best mentor for you, with a compatibility score." },
    { icon: "🗺️", title: "AI Roadmap Generator", desc: "Personalised learning path with PDF download", detail: "Generate a week‑by‑week roadmap tailored to your goals, then download it as a PDF for offline use." },
    { icon: "🎨", title: "Collaborative Whiteboard", desc: "Real‑time shared canvas in meetings", detail: "During meetings, both mentor and student can draw, write, and share ideas on a shared whiteboard – perfect for technical mentoring." },
    { icon: "📝", title: "Meeting Summaries", desc: "Automatic recap + action items", detail: "After each meeting, generate a concise summary and actionable next steps, directly in the dashboard." },
    { icon: "🏅", title: "Gamification Badges", desc: "Earn achievements for milestones", detail: "Get a 'First Meeting' badge automatically, with more badges coming soon to celebrate your progress." },
    { icon: "🌱", title: "Social Good Mentoring", desc: "Connect with volunteer mentors", detail: "Filter mentors who offer free mentorship to underprivileged students – our social impact initiative." },
    { icon: "✨", title: "More Features Soon", desc: "AI meeting notes, calendar sync & more", detail: "We're constantly improving MentorConnect. Next up: automatic meeting transcripts, calendar integration, and advanced analytics for mentors." }
  ];

  const popularMentors = [
    { name: "Dr. Aditya Sharma", field: "Machine Learning" },
    { name: "Priya Mehta", field: "Web Development" },
    { name: "Rahul Verma", field: "Data Science" },
    { name: "Neha Gupta", field: "Cyber Security" },
  ];

  const stats = [
    { label: "AI Matches", value: "500+" },
    { label: "Roadmaps Generated", value: "200+" },
    { label: "Mentors", value: "20+" },
    { label: "Satisfaction", value: "95%" },
  ];

  const doubledFeatures = [...features, ...features];

  return (
    <div className="mc-homepage">
      <nav className="mc-nav">
        <div className="mc-nav-inner">
          <a href="/" className="mc-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
            </svg>
            MentorConnect
          </a>
          <div className="mc-nav-links">
            <a href="/">Home</a>
            <button onClick={() => checkLogin("/mentors")}>Mentors</button>
            <button onClick={() => {
              const user = JSON.parse(localStorage.getItem("loggedUser") || "null");
              if (!user) { alert("Please login first"); navigate("/login"); return; }
              if (user.role === "student") navigate(`/studentpage/${user._id}`);
              else navigate("/students");
            }}>Students</button>
            <a href="/contact">Contact</a>
            <DarkModeToggle />
            {isLoggedIn ? (
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="nav-login" onClick={() => navigate("/login")}>Login</button>
                <button className="nav-signup" onClick={() => navigate("/signup")}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section – Professional & Concise */}
      <section className="mc-hero">
        <div className="mc-hero-inner">
          <div className="mc-hero-text">
            <div className="mc-hero-badge">AI‑Powered Platform</div>
            <h1>MentorConnect</h1>
            <p className="mc-hero-tagline">Smart mentorship with AI tools</p>
            <p className="mc-hero-desc">
              AI matching, roadmap generator, collaborative whiteboard, and meeting summaries.
            </p>
            <div className="mc-hero-btns">
              <button className="btn-teal" onClick={() => navigate("/login")}>Get Started</button>
              <button className="btn-outline" onClick={() => navigate("/login")}>Explore Features</button>
            </div>
          </div>
          <div className="mc-hero-visual">
            <div className="mc-compass-ring">🧭</div>
          </div>
        </div>
      </section>

      <div className="mc-section">
        <h2 className="mc-section-title">Why MentorConnect?</h2>
        <div className="mc-underline"></div>
        <div className="mc-grid-4">
          <div className="marquee-track">
            {doubledFeatures.map((f, idx) => (
              <div key={idx} className="mc-card hp-feature-card">
                <div className="hp-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <button className="hp-view-btn" onClick={() => setModalContent(f)}>View Details →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hp-popular-bg">
        <div className="mc-section">
          <h2 className="mc-section-title">Popular Mentors</h2>
          <div className="mc-underline"></div>
          <div className="hp-popular-grid">
            {popularMentors.map((mentor, idx) => (
              <div key={idx} className="hp-popular-card">
                <div className="hp-mentor-avatar">{mentor.name.charAt(0)}</div>
                <div className="hp-mentor-badge">Expert</div>
                <h4>{mentor.name}</h4>
                <p>{mentor.field}</p>
                <button className="btn-teal" style={{ marginTop: "0.5rem", width: "100%" }} onClick={() => navigate("/login")}>
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mc-stats">
        {stats.map((stat, idx) => (
          <div className="mc-stat" key={idx}>
            <div className="mc-stat-num">{stat.value}</div>
            <div className="mc-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <footer className="mc-footer">
        <p>© {new Date().getFullYear()} MentorConnect – AI‑Driven Mentorship</p>
        <small>Built for Hackathon – AI Matching · Roadmap PDF · Whiteboard · Summaries · Badges · Social Good</small>
      </footer>

      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">{modalContent.icon}</div>
            <h3>{modalContent.title}</h3>
            <p>{modalContent.detail}</p>
            <button className="btn-teal" onClick={() => setModalContent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}