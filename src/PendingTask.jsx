import React, { useState, useEffect } from "react";
import "./theme.css";

function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", deadline: "" });

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) {
      setError("⚠️ Please enter task title and deadline.");
      return;
    }
    setError("");
    setTasks(prev => [...prev, { id: Date.now(), ...newTask, status: "Pending" }]);
    setNewTask({ title: "", deadline: "" });
  };

  const completeTask = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, status: "Completed" } : task));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--brand-dark)", textAlign: "center", marginBottom: "1.5rem" }}>Pending Tasks</h1>

      <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input className="mc-input" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
        <input className="mc-input" type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
        <button type="submit" className="btn-teal" style={{ padding: "0.75rem" }}>Add Task</button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

      <h2 style={{ marginTop: "2rem", fontSize: "1.3rem" }}>Your Tasks:</h2>
      {tasks.map(task => (
        <div key={task.id} className="mc-panel" style={{ marginTop: "0.8rem" }}>
          <div className="mc-panel-body">
            <p><strong>{task.title}</strong></p>
            <p>Deadline: {task.deadline}</p>
            <p>Status: {task.status}</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              {task.status === "Pending" && (
                <button className="btn-teal" style={{ padding: "6px 12px" }} onClick={() => completeTask(task.id)}>Mark Completed</button>
              )}
              <button className="btn-outline" style={{ padding: "6px 12px", borderColor: "var(--error)" }} onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingTasks;