import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./theme.css";
import "./StudentProfile.css";

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/students/${id}`)
      .then(res => { 
        if (!res.ok) throw new Error("Student not found"); 
        return res.json(); 
      })
      .then(data => setStudent(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="mc-loading">
      <div className="mc-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );
  
  if (!student) return (
    <div className="mc-loading">
      <p>Student not found.</p>
      <Link to="/students"><button className="back-btn">← Back</button></Link>
    </div>
  );

  // Safely access mentor details (if mentorId is an object)
  const mentor = student.mentorId && typeof student.mentorId === 'object' ? student.mentorId : null;
  const mentorName = mentor?.name || (student.mentorId ? "Assigned (details loading)" : null);

  return (
    <div className="student-profile-container">
      <div className="student-card-large">
        <h2>Student Details</h2>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Semester:</strong> {student.semester || "Not specified"}</p>
        
        <hr />

        <h2>Assigned Mentor</h2>
        {mentor ? (
          <>
            <p><strong>Name:</strong> {mentor.name}</p>
            <p><strong>Email:</strong> {mentor.email}</p>
            <p><strong>Department:</strong> {mentor.dept || "N/A"}</p>
            <p><strong>Experience:</strong> {mentor.exp ? `${mentor.exp} years` : "N/A"}</p>
          </>
        ) : student.mentorId ? (
          <p>Mentor assigned (ID: {student.mentorId}) – refresh to load details.</p>
        ) : (
          <p>No mentor assigned yet. Use AI matching on the dashboard.</p>
        )}
        
        <Link to="/students">
          <button className="back-btn">← Back to Students</button>
        </Link>
      </div>
    </div>
  );
}