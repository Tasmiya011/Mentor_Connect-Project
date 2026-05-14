import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./theme.css";
import "./becomementor.css";

export default function BecomeMentor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !dept || !experience || !bio) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dept, exp: experience, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Mentor Registered Successfully!");
        setName(""); setDept(""); setExperience(""); setBio("");
        navigate("/mentors");
      } else {
        alert(data.message || "Error creating mentor");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mentor-form-container">
      <div className="mentor-form-box">
        <h2>Become a Mentor</h2>
        <form onSubmit={handleSubmit}>
          <input className="mentor-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="mentor-input" placeholder="Department / Expertise" value={dept} onChange={e => setDept(e.target.value)} />
          <input className="mentor-input" placeholder="Experience (e.g., 5 years)" value={experience} onChange={e => setExperience(e.target.value)} />
          <textarea className="mentor-input bio-box" placeholder="Short Bio (Who are you? What can you teach?)" value={bio} onChange={e => setBio(e.target.value)} />
          <button className="mentor-btn-submit" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <p className="back-link" onClick={() => navigate("/")}>⬅ Back to Home</p>
      </div>
    </div>
  );
}