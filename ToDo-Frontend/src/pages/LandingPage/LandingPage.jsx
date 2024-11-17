import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/add-todos");
  };

  return (
    <div className="container">
      <div className="img-container">
        <img src="/todo.png" alt="Todo App Illustration" className="image" />
      </div>
      <div className="landing-content">
        <h1 className="title">Welcome to NoteDown</h1>
        <p className="description">
          Organize your tasks efficiently and stay productive. Add, track, and
          complete your daily tasks easily with our NoteDown App!
        </p>
        <button onClick={handleGetStarted} className="button">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
