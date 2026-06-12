# MentorConnect 🚀

MentorConnect is a full-stack mentor-mentee collaboration platform designed to bridge the gap between students and mentors through personalized guidance, structured learning, and real-time interaction.

It provides students with career roadmaps, meeting scheduling, study materials, task tracking, and collaborative learning tools, while mentors can manage mentees, assign tasks, schedule meetings, and share resources.

## ✨ Features

### 👨‍🎓 Student Features

- Personalized student dashboard
- AI-powered roadmap generator
- Generate roadmaps based on:
  - Career goal
  - Duration
  - Additional requirements
- Schedule and manage meetings
- Interactive calendar
- Add:
  - Meetings
  - Reminders
  - Tasks
- View assigned mentor details
- Access study materials shared by mentors
- Track mentor-assigned tasks
- Profile section with achievements and skills
- Real-time notifications
- Integrated AI chatbot assistant

---

### 👨‍🏫 Mentor Features

- Mentor dashboard
- Manage assigned mentees
- Schedule meetings
- Assign tasks to students
- Upload study materials and resources
- Provide feedback to students
- Manage mentor profile
- Track mentee progress

---

### 🤖 MentorConnect Assistant

The platform includes an AI-powered assistant that helps users navigate the application.

It can answer questions related to:

- Roadmap generation
- Meeting scheduling
- Task assignment
- Feedback process
- Study material uploads
- Whiteboard troubleshooting
- Dashboard usage
- Notifications
- Account-related queries

Quick question suggestions provide a chatbot experience similar to modern support assistants.

---

### 🎨 UI Highlights

- Premium modern dashboard design
- Responsive layout
- Gradient-based theme
- Interactive stat cards
- Enhanced sidebar navigation
- Professional chatbot interface
- Mobile-friendly experience

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- CSS3
- Fetch API

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT Authentication

### Additional Integrations

- Jitsi Meet (Video Meetings)
- Collaborative Whiteboard
- AI Chat Assistant

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Tasmiya011/Mentor_Connect-Project.git
```

### 2. Navigate to the Project

```bash
cd Mentor_Connect-Project
```
## Frontend Setup

```bash
cd mentormentee
npm install
npm start
```

Frontend runs on:
http://localhost:3000
```

## Backend Setup

Open a new terminal:

```bash
cd backend
npm install
npm start
```

Backend runs on:
```
http://localhost:5000
```
## Environment Variables

Create a `.env` file in the backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Future Enhancements

- Email notifications
- Password reset functionality
- AI-based mentor matching improvements
- Resume analysis
- Interview preparation assistant
- Progress analytics dashboard
- Real-time chat between mentors and students
- Cloud storage for study materials
- Deployment on AWS/Vercel


## 📄 License

This project is licensed under the [MIT License](LICENSE).

**MentorConnect — Learn, Connect, Grow.**
