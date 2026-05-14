import React, { useState, useRef, useEffect } from "react";
import "./theme.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
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
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      return data.reply || "I'm not sure how to respond.";
    } catch (err) {
      console.error(err);
      return "⚠️ Sorry, I'm having trouble connecting. Please try again later.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setLoading(true);
    const botReply = await sendToAI(userText);
    setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Small circular toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--teal, #2c7a7b)",
            border: "none",
            color: "white",
            fontSize: "28px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          💬
        </button>
      )}

      {/* Full chat window (only when open) */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "350px",
          maxWidth: "calc(100vw - 40px)",
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
          overflow: "hidden",
          fontFamily: "var(--font-body, 'Inter', sans-serif)",
          zIndex: 9999,
        }}>
          {/* Header */}
          <div style={{
            background: "var(--teal, #2c7a7b)",
            color: "white",
            padding: "12px 16px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span>💬 MentorConnect Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div style={{
            height: "380px",
            overflowY: "auto",
            padding: "12px",
            background: "var(--bg-page, #f8fafc)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "20px" }}>
                👋 Ask me anything about mentors, meetings, or the platform!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "8px 14px",
                  borderRadius: "18px",
                  background: msg.sender === "user" ? "var(--teal, #2c7a7b)" : "#e2e8f0",
                  color: msg.sender === "user" ? "white" : "black",
                  wordWrap: "break-word",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "#e2e8f0", padding: "8px 14px", borderRadius: "18px" }}>Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px",
            borderTop: "1px solid var(--border, #e2e8f0)",
            background: "#fff",
            display: "flex",
            gap: "8px",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid var(--border, #cbd5e1)",
                borderRadius: "2rem",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--teal, #2c7a7b)",
                border: "none",
                color: "white",
                borderRadius: "2rem",
                padding: "6px 16px",
                cursor: "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}