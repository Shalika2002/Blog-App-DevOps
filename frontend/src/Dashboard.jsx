import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Welcome to Your Dashboard</h2>
        <p className="dashboard-welcome">
          Glad to have you here, <b>SnapLinker!</b>
        </p>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>View and edit your profile information.</p>
          </div>
          <div className="dashboard-card">
            <h3>My Posts</h3>
            <p>See your recent posts and activity.</p>
          </div>
          <div className="dashboard-card">
            <h3>Explore</h3>
            <p>Discover new posts and connect with others.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
