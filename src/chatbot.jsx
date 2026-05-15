import React, { useState, useRef, useEffect } from "react";
import "./theme.css";

const quickQuestions = [
  { label: "How do I get a roadmap?", icon: "🗺️" },
  { label: "How to schedule a meeting?", icon: "📅" },
  { label: "How to assign tasks?", icon: "📋" },
  { label: "How to upload study materials?", icon: "📖" },
  { label: "How to give feedback?", icon: "💬" },
  { label: "Whiteboard not working?", icon: "🖥️" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 I'm your MentorConnect assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendToAI = async (text) => {
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      return data.reply || "No response found.";
    } catch (err) {
      console.error(err);
      return "⚠️ Unable to connect to assistant.";
    }
  };

  const handleSend = async (customText = null) => {
    const userText = customText || input;
    if (!userText.trim() || loading) return;
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setLoading(true);
    const reply = await sendToAI(userText);
    setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          style={{
            position: "fixed",
            bottom: "22px",
            right: "22px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#0d9488",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(13,148,136,0.4)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "22px",
            right: "22px",
            width: "400px",
            height: isMinimized ? "68px" : "min(620px, calc(100vh - 44px))",  // ← dynamic height
            background: "#eef2f7",
            borderRadius: "20px",
            overflow: "hidden",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(15,23,42,0.20)",
            transition: "height 0.3s ease",
          }}
        >
          {/* ── HEADER ── */}
          <div
            style={{
              background: "#0d9488",
              padding: "13px 16px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              💬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1rem", fontWeight: "700" }}>
                MentorConnect Assistant
              </div>
              <div style={{ fontSize: "0.78rem", opacity: 0.9, marginTop: "1px" }}>
                We're here to help you! 💚
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                background: "transparent", border: "none", color: "white",
                cursor: "pointer", fontSize: "18px", padding: "4px 6px", opacity: 0.85,
              }}
            >
              —
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent", border: "none", color: "white",
                cursor: "pointer", fontSize: "16px", padding: "4px 6px", opacity: 0.85,
              }}
            >
              ✕
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* ── SCROLLABLE BODY ── */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

                {/* QUICK QUESTIONS */}
                <div style={{ padding: "14px 14px 8px 14px", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      color: "#64748b",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Quick Questions
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q.label)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          color: "#1e293b",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          lineHeight: "1.35",
                          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 10px rgba(13,148,136,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.06)"}
                      >
                        <span
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "7px",
                            background: "#ccfbf1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          {q.icon}
                        </span>
                        <span style={{ paddingTop: "3px" }}>{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CHAT MESSAGES */}
                <div
                  style={{
                    padding: "8px 14px 14px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      {msg.sender === "bot" && (
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "white",
                            border: "2px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            flexShrink: 0,
                          }}
                        >
                          🤖
                        </div>
                      )}
                      <div
                        style={{
                          maxWidth: "75%",
                          padding: "11px 15px",
                          borderRadius: msg.sender === "user"
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                          fontSize: "0.88rem",
                          lineHeight: "1.55",
                          background: msg.sender === "user" ? "#0d9488" : "white",
                          color: msg.sender === "user" ? "white" : "#1e293b",
                          boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                      <div
                        style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: "white", border: "2px solid #e2e8f0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "18px", flexShrink: 0,
                        }}
                      >
                        🤖
                      </div>
                      <div
                        style={{
                          background: "white", padding: "11px 15px",
                          borderRadius: "16px 16px 16px 4px",
                          fontSize: "0.88rem", color: "#64748b",
                          boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
                        }}
                      >
                        Typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* ── INPUT BAR ── */}
              <div
                style={{
                  padding: "12px 14px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "10px",
                  background: "white",
                  flexShrink: 0,
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "999px",
                    padding: "11px 18px",
                    outline: "none",
                    fontSize: "0.9rem",
                    background: "#f8fafc",
                    color: "#1e293b",
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "11px 20px",
                    background: loading ? "#94d5cf" : "#0d9488",
                    color: "white",
                    fontWeight: "700",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}