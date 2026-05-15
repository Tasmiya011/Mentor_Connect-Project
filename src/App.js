import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage.js";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Contact from "./Contact.js";

import Dashboard from "./Dashboard.jsx";
import Mentors from "./Mentors.jsx";
import Students from "./Students.jsx";
import MentorProfile from "./MentorProfile.jsx";
import StudentProfile from "./StudentProfile.jsx";
import BecomeMentor from "./becomementor.js";
import StudentPage from "./StudentPage.jsx";
import MentorPage from "./MentorPage";
import Assign from "./AssignMentor.jsx";
import Report from "./report.jsx";
import Addmentor from "./addmentor.jsx";
import Addstudent from "./addstudent.jsx";
import Chatbot from "./chatbot.jsx";

import Schedule from "./Schedule.jsx";
import Progress from "./Progress.jsx";
import PendingTask from "./PendingTask.jsx";
import WhiteboardPage from "./WhiteboardPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/students" element={<Students />} />
        <Route path="/mentor/:id" element={<MentorProfile />} />
        <Route path="/student/:id" element={<StudentProfile />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />

        <Route path="/schedule" element={<Schedule />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/pendingtask" element={<PendingTask />} />

        <Route path="/studentpage/:id" element={<StudentPage />} />
        <Route path="/mentorpage/:id" element={<MentorPage />} />
        <Route path="/AssignMentor" element={<Assign />} />
        <Route path="/report" element={<Report />} />
        <Route path="/addmentor" element={<Addmentor />} />
        <Route path="/addstudent" element={<Addstudent />} />
        <Route path="/whiteboard/:meetingId" element={<WhiteboardPage />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
