// src/seed.js
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import Mentor from "./models/Mentor.js";
import Student from "./models/Student.js";
import fs from "fs";
import path from "path";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
await connectDB(MONGO_URI);

const dataDir = path.resolve("src", "data"); // server/src/data

const loadJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));

async function seed() {
  try {
    await Mentor.deleteMany({});
    await Student.deleteMany({});

    const mentors = loadJson("mentors.json"); // must be array with { id, name, ... }
    const students = loadJson("students.json");

    // We will insert mentors and ignore their original numeric id; create new ObjectId versions.
    const createdMentors = await Mentor.insertMany(mentors.map(m => ({
      name: m.name || m.fullName || "Unknown",
      email: m.email || "",
      dept: m.dept || "",
      exp: m.exp || ""
    })));

    // Map old mentor numeric id -> new ObjectId if your students.json references numeric mentor ids
    const mentorMap = {};
    if (mentors && mentors.length) {
      mentors.forEach((m, i) => {
        mentorMap[m.id] = createdMentors[i]._id;
      });
    }

    // Create students — map mentorId if present
    const studentsToInsert = students.map(s => ({
      name: s.name,
      email: s.email || "",
      semester: s.semester || null,
      mentorId: s.mentorId ? mentorMap[s.mentorId] : null
    }));

    await Student.insertMany(studentsToInsert);

    console.log("Seeding finished");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
