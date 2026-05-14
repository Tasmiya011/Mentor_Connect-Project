import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./theme.css";
import "./Dashboard.css";

// Import JSON datasets (kept exactly as original)
import mentorsData from "./data/mentors.json";
import studentsData from "./data/students.json";
import tasksData from "./data/tasks.json";
import progressData from "./data/progress.json";
import interactionsData from "./data/interactions.json";

export default function Dashboard() {
  const navigate = useNavigate();

  // Calculate counts (original logic – unchanged)
  const totalMentors = mentorsData.length;
  const totalStudents = studentsData.length;
  const scheduledMeetings = interactionsData.length;
  const pendingTasks = tasksData.filter(task => task.status === "Pending").length;
  const mentorAssignments = tasksData.length;
  const totalReports = progressData.length;

  // Prepare stats array for UI's stat cards (matches original data)
  const stats = [
    { label: "Total Mentors",    value: totalMentors,     icon: "👨‍🏫", color: "mc-icon-blue",   link: "/mentors",      linkLabel: "View All" },
    { label: "Total Students",   value: totalStudents,    icon: "👨‍🎓", color: "mc-icon-teal",   link: "/students",     linkLabel: "View All" },
    { label: "Scheduled Meetings", value: scheduledMeetings, icon: "📅", color: "mc-icon-purple", link: "/schedule",     linkLabel: "Open" },
    { label: "Pending Tasks",    value: pendingTasks,     icon: "⏳", color: "mc-icon-orange",  link: "/pendingtask",  linkLabel: "Check" },
    { label: "Mentor Assignments", value: mentorAssignments + " Assigned", icon: "🔗", color: "mc-icon-green", link: "/AssignMentor", linkLabel: "Manage" },
    { label: "Reports",          value: totalReports + " Reports", icon: "📊", color: "mc-icon-pink", link: "/report",      linkLabel: "Open" },
  ];

  // Quick actions (original add/assign/report links)
  const quickActions = [
    { label: "Add Mentor",   icon: "➕", link: "/addmentor",   color: "mc-icon-yellow" },
    { label: "Add Student",  icon: "➕", link: "/addstudent",  color: "mc-icon-teal" },
    { label: "Assign Mentor", icon: "🔗", link: "/AssignMentor", color: "mc-icon-blue" },
    { label: "View Reports", icon: "📊", link: "/report",      color: "mc-icon-purple" },
  ];

  // Navigation items (matches all original menu links)
  const navItems = [
    { icon: "🏠", label: "Dashboard",    to: "/dashboard" },
    { icon: "👨‍🏫", label: "Mentors",      to: "/mentors" },
    { icon: "👨‍🎓", label: "Students",     to: "/students" },
    { icon: "➕",  label: "Add Mentor",   to: "/addmentor" },
    { icon: "➕",  label: "Add Student",  to: "/addstudent" },
    { icon: "🔗",  label: "Assign Mentor", to: "/AssignMentor" },
    { icon: "📊",  label: "Reports",      to: "/report" },
  ];

  // Keep original logout (simple Link to "/") – no localStorage removal
  // If you prefer UI's handleLogout, replace the logout button below.

  return (
    <div className="mc-layout">
      {/* Sidebar - UI structure with original nav items */}
      <aside className="mc-sidebar">
        <div className="mc-sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>
          </svg>
          Mentor<span>Connect</span>
        </div>

        <div className="mc-sidebar-section">Main Menu</div>
        <ul className="mc-sidebar-nav">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link to={item.to} className={window.location.pathname === item.to ? "active" : ""}>
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout – using original style (Link) but placed in UI's logout button area */}
        <Link to="/" className="mc-sidebar-logout">
          <span>🚪</span> Logout
        </Link>
      </aside>

      {/* Main content - UI layout with original stats and quick actions */}
      <main className="mc-main">
        <div className="mc-page-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's an overview of the MentorConnect platform.</p>
        </div>

        {/* Stats Grid - using UI's mc-stat-card but original data */}
        <div className="mc-grid-3" style={{ marginBottom: "2rem" }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="mc-stat-card">
              <div className={"mc-stat-card-icon " + stat.color}>{stat.icon}</div>
              <div className="mc-stat-card-body">
                <div className="mc-stat-card-num">{stat.value}</div>
                <div className="mc-stat-card-label">{stat.label}</div>
                <Link to={stat.link} className="mc-stat-card-link">{stat.linkLabel} →</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Panel - uses dash-quick-action class (now defined) */}
        <div className="mc-panel">
          <div className="mc-panel-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="mc-panel-body">
            <div className="mc-grid-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} to={action.link} className="dash-quick-action">
                  <div className={"mc-stat-card-icon " + action.color} style={{ margin: "0 auto 0.75rem", width: 52, height: 52, fontSize: "1.5rem" }}>
                    {action.icon}
                  </div>
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}