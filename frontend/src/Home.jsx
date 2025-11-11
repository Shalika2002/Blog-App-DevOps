import React from "react";
import "./Home.css";

import { Link } from "react-router-dom";

const Home = () => (
  <div className="home-bg">
    <div className="home-container">
      <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 8, color: '#222' }}>Welcome to SnapLink!</h1>
      <p className="home-desc">
        SnapLink is your place to connect, share, and discover amazing blogs from people around the world. <br />
        <span style={{ color: '#1976d2', fontWeight: 500 }}>Sign up</span> to start sharing your own stories, or <span style={{ color: '#1976d2', fontWeight: 500 }}>sign in</span> to join the conversation!
      </p>
      <img className="home-img" src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-583.jpg" alt="Social Media" />
      <Link to="/signup" className="home-cta">Get Started</Link>
    </div>
  </div>
);

export default Home;
