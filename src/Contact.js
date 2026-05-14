import React, { useState } from "react";
import "./theme.css";
import "./Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent (demo). In production, integrate email API.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2>Contact Us</h2>
        <p>Email: support@mentorconnect.com</p>
        <p>Phone: +91 9876543210</p>
        <hr style={{ margin: "1rem 0" }} />
        <h3>Send a Message</h3>
        <form onSubmit={handleSubmit}>
          <input className="contact-input" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="contact-input" type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <textarea className="contact-input message-box" placeholder="Your Message" value={message} onChange={e => setMessage(e.target.value)} required />
          <button className="contact-btn" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}