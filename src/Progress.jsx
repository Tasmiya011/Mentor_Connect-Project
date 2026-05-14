import React, { useState } from "react";
import "./theme.css";
import "./Progress.css";

function Progress() {
  const [progressList] = useState([
    { id: 1, name: "Student A", task: "Module 1", completion: "70%" },
    { id: 2, name: "Student B", task: "Project Setup", completion: "40%" },
    { id: 3, name: "Student C", task: "UI Design", completion: "90%" },
  ]);

  return (
    <div className="progress-container">
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--brand-dark)", marginBottom: "1.5rem" }}>Student Progress</h1>
      <table className="progress-table">
        <thead><tr><th>Student</th><th>Task</th><th>Completion</th></tr></thead>
        <tbody>
          {progressList.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td><td>{item.task}</td>
              <td><div className="progress-bar"><div className="progress-fill" style={{ width: item.completion }}>{item.completion}</div></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Progress;