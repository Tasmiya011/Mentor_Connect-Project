import React, { useState, useEffect } from "react";
import "./theme.css";

function Schedule({ userId, role }) {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const [newMeeting, setNewMeeting] = useState({ mentorId: "", menteeId: "", date: "", time: "", agenda: "" });

  useEffect(() => {
    fetch("http://localhost:5000/meetings")
      .then(res => res.json())
      .then(data => {
        if (role === "mentor") setMeetings(data.filter(m => m.mentorId == userId));
        else setMeetings(data.filter(m => m.menteeId == userId));
      });
  }, [userId, role]);

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    if (!newMeeting.mentorId || !newMeeting.menteeId || !newMeeting.date || !newMeeting.time || !newMeeting.agenda) {
      setError("⚠️ Please fill all fields.");
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:5000/addMeeting", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMeeting),
      });
      const data = await res.json();
      setMeetings(prev => [...prev, data.meeting]);
      setNewMeeting({ mentorId: "", menteeId: "", date: "", time: "", agenda: "" });
      alert("Meeting scheduled successfully!");
    } catch (err) {
      console.error(err);
      setError("Error scheduling meeting");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--brand-dark)", textAlign: "center" }}>Schedule Meeting</h1>
      <form onSubmit={handleAddMeeting} style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "1.5rem 0" }}>
        <input className="mc-input" placeholder="Mentor ID" value={newMeeting.mentorId} onChange={e => setNewMeeting({...newMeeting, mentorId: e.target.value})} />
        <input className="mc-input" placeholder="Mentee ID" value={newMeeting.menteeId} onChange={e => setNewMeeting({...newMeeting, menteeId: e.target.value})} />
        <input className="mc-input" type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
        <input className="mc-input" type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
        <input className="mc-input" placeholder="Agenda / Topic" value={newMeeting.agenda} onChange={e => setNewMeeting({...newMeeting, agenda: e.target.value})} />
        <button type="submit" className="btn-teal">Schedule Meeting</button>
      </form>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <h2>Your Meetings:</h2>
      {meetings.map(m => (
        <div key={m._id} className="mc-panel" style={{ marginTop: "0.8rem" }}>
          <div className="mc-panel-body"><strong>{m.agenda}</strong><br />{m.date} — {m.time}<br />Status: {m.status}</div>
        </div>
      ))}
    </div>
  );
}

export default Schedule;