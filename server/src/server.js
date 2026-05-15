import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";
import "express-async-errors";
import mentorMatchRoutes from "./routes/mentorMatch.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chatRoutes.js";
import mentorRoutes from "./routes/mentors.js";
import studentRoutes from "./routes/students.js";
import assignRoutes from "./routes/assign.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import roadmapRoutes from "./routes/roadmap.js";
import smartMatchRoutes from "./routes/smartMatch.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", MONGO_URI);

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/assign", assignRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/mentor-match", mentorMatchRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/smart-match", smartMatchRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/", (req, res) => res.send({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (room) => socket.join(room));

  socket.on("code-change", ({ room, code }) => {
    socket.to(room).emit("code-update", code);
  });

  socket.on("whiteboard-draw", ({ room, data }) => {
    socket.to(room).emit("whiteboard-update", data);
  });

  socket.on("whiteboard-update", ({ room, data }) => {
    socket.to(room).emit("whiteboard-update", data);
  });

  socket.on("whiteboard-clear", ({ room }) => {
    socket.to(room).emit("whiteboard-clear");
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Start server
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    server.listen(PORT, () => console.log(`Server with socket running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();