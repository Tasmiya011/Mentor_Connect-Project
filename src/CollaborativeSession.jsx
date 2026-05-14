import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

const socket = io("http://localhost:5000");

export default function CollaborativeSession({ roomId, initialCode }) {
  const [code, setCode] = useState(initialCode || "// Start coding...");
  const canvasRef = useRef(null);
  let drawing = false;

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("code-update", (newCode) => setCode(newCode));
    socket.on("whiteboard-update", (data) => drawOnCanvas(data));
    return () => { socket.off("code-update"); socket.off("whiteboard-update"); };
  }, [roomId]);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    socket.emit("code-change", { room: roomId, code: value });
  };

  const startDrawing = (e) => { drawing = true; draw(e); };
  const stopDrawing = () => { drawing = false; };
  const draw = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 4, 4);
    socket.emit("whiteboard-draw", { room: roomId, data: { x, y } });
  };
  const drawOnCanvas = ({ x, y }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 4, 4);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ flex: 1 }}>
        <h4>Collaborative Code Editor</h4>
        <CodeMirror value={code} options={{ mode: "javascript", theme: "material", lineNumbers: true }} onChange={handleCodeChange} />
      </div>
      <div style={{ flex: 1 }}>
        <h4>Whiteboard</h4>
        <canvas ref={canvasRef} width={500} height={400} style={{ border: "1px solid #ccc" }}
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
      </div>
    </div>
  );
}