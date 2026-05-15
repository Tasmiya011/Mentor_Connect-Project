// frontend/src/pages/WhiteboardPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const API = "http://localhost:5000";

export default function WhiteboardPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [code, setCode] = useState(`// Write your JavaScript code here
console.log("Hello from collaborative editor!");

// Example: add two numbers
const a = 5;
const b = 3;
console.log("Sum:", a + b);
`);
  const [output, setOutput] = useState("");

  // Drawing tools state
  const [tool, setTool] = useState("pen"); // "pen" or "eraser"
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const ctxRef = useRef(null);

  // Connect to socket
  useEffect(() => {
    const newSocket = io(API);
    setSocket(newSocket);
    newSocket.emit("join-room", meetingId);

    newSocket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    newSocket.on("whiteboard-update", (data) => {
      if (!ctxRef.current) return;
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(data.x1, data.y1);
      ctx.lineTo(data.x2, data.y2);
      ctx.stroke();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [meetingId]);

  // Setup canvas after render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = brushSize;
      context.strokeStyle = color;
      ctxRef.current = context;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Update brush style when tool/color/size changes
  useEffect(() => {
    if (!ctxRef.current) return;
    if (tool === "eraser") {
      ctxRef.current.strokeStyle = "#ffffff"; // eraser = white
      ctxRef.current.lineWidth = brushSize;
    } else {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [tool, color, brushSize]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;

    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    x = Math.min(Math.max(0, x), canvas.width);
    y = Math.min(Math.max(0, y), canvas.height);
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const { x, y } = getCanvasCoordinates(e);
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    ctxRef.current.lastX = x;
    ctxRef.current.lastY = y;
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawingRef.current || !ctxRef.current) return;
    const { x, y } = getCanvasCoordinates(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    // Broadcast to others
    if (socket) {
      socket.emit("whiteboard-draw", {
        room: meetingId,
        data: { x1: ctxRef.current.lastX, y1: ctxRef.current.lastY, x2: x, y2: y },
      });
    }
    ctxRef.current.lastX = x;
    ctxRef.current.lastY = y;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    if (ctxRef.current) ctxRef.current.beginPath();
  };

  const clearCanvas = () => {
    if (!ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Code execution
  const runCode = () => {
    // Capture console.log output
    let logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(" "));
      originalLog(...args);
    };
    try {
      // Use Function constructor to evaluate code safely (has access to console)
      const func = new Function(code);
      func();
      setOutput(logs.join("\n"));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      console.log = originalLog;
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit("code-change", { room: meetingId, code: newCode });
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ background: "#1e293b", color: "white", padding: "0.75rem 1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem" }}>← Back</button>
        <h2 style={{ flex: 1, fontSize: "1rem" }}>Collaborative Session: {meetingId}</h2>
        <button onClick={() => setActiveTab("whiteboard")} style={{ background: activeTab === "whiteboard" ? "#14b8a6" : "#475569", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", color: "white", cursor: "pointer" }}>🎨 Whiteboard</button>
        <button onClick={() => setActiveTab("code")} style={{ background: activeTab === "code" ? "#14b8a6" : "#475569", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", color: "white", cursor: "pointer" }}>💻 Code Editor</button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Side toolbar (only for whiteboard tab) */}
        {activeTab === "whiteboard" && (
          <div style={{ width: "220px", background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>🖌️ Tool</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setTool("pen")} style={{ background: tool === "pen" ? "#14b8a6" : "#e2e8f0", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", flex: 1 }}>Pen</button>
                <button onClick={() => setTool("eraser")} style={{ background: tool === "eraser" ? "#14b8a6" : "#e2e8f0", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", flex: 1 }}>Eraser</button>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>🎨 Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "100%", height: "40px", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>✏️ Brush Size: {brushSize}px</label>
              <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>
            <button onClick={clearCanvas} style={{ background: "#ef4444", color: "white", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}>🗑️ Clear Canvas</button>
          </div>
        )}

        {/* Main content area */}
        <div style={{ flex: 1, background: activeTab === "whiteboard" ? "#fff" : "#1e1e2f", position: "relative" }}>
          {activeTab === "whiteboard" && (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ width: "100%", height: "100%", cursor: "crosshair", display: "block" }}
            />
          )}

          {activeTab === "code" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <textarea
                value={code}
                onChange={handleCodeChange}
                style={{ flex: 2, fontFamily: "monospace", fontSize: "14px", padding: "1rem", background: "#1e1e2f", color: "#fff", border: "none", outline: "none", resize: "none" }}
              />
              <div style={{ background: "#0f172a", borderTop: "1px solid #334155", padding: "0.5rem" }}>
                <button onClick={runCode} style={{ background: "#14b8a6", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", marginBottom: "0.5rem" }}>▶ Run Code</button>
                <div style={{ background: "#1e293b", color: "#cbd5e1", padding: "0.75rem", borderRadius: "6px", fontFamily: "monospace", fontSize: "12px", maxHeight: "150px", overflowY: "auto" }}>
                  <strong>Console Output:</strong>
                  <pre style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{output || "No output yet. Click Run Code."}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}