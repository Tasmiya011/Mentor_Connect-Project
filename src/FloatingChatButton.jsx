import React from "react";
import { useNavigate } from "react-router-dom";
import "./theme.css";

export default function FloatingChatButton() {
  const navigate = useNavigate();
  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px", width: "56px", height: "56px",
      borderRadius: "50%", backgroundColor: "var(--teal)", color: "#fff",
      fontSize: "28px", textAlign: "center", lineHeight: "56px", cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 9999,
    }} onClick={() => navigate("/chatbot")}>
      💬
    </div>
  );
}