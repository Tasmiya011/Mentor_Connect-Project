import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  };

  return (
    <button onClick={toggleDarkMode} className="dark-mode-toggle" style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer" }}>
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}