import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setMessage("Please add some text or an image.");
      return;
    }
    try {
      setPosting(true);
      setMessage("");
      const data = new FormData();
      data.append("text", text.trim());
      data.append("username", user?.username || "Anonymous");
      if (image) data.append("image", image);
      await axios.post("http://localhost:3000/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText("");
      setImage(null);
      setPreview(null);
      navigate("/");
    } catch (err) {
      setMessage("Failed to post. Is the backend running?");
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="dashboard-bg">
      <div className="dashboard-container">
        <header>
          <h2 className="dashboard-title">Create a Post</h2>
          <p className="dashboard-welcome">
            Share an update with your friends. Add text, upload a photo, and keep your community inspired.
          </p>
        </header>

        <div className="dashboard-steps">
          <div className="dashboard-step">
            <span>1. Capture</span>
            <p>Write what is on your mind or highlight the moments that matter most.</p>
          </div>
          <div className="dashboard-step">
            <span>2. Add detail</span>
            <p>Attach a vibrant image to bring your story to life.</p>
          </div>
          <div className="dashboard-step">
            <span>3. Share</span>
            <p>Post instantly to reach your friends and followers on SnapLink.</p>
          </div>
        </div>

        <form className="post-form" onSubmit={submitPost}>
          <label className="post-label" htmlFor="post-text">
            What would you like to share?
          </label>
          <textarea
            id="post-text"
            className="post-input"
            placeholder="Drop your thoughts, inspirations, or announcements…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />

          {preview && (
            <div className="post-image-preview">
              <img src={preview} alt="Post preview" />
              <button
                type="button"
                className="remove-img"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              >
                Remove
              </button>
            </div>
          )}

          <div className="post-actions">
            <label className="upload-btn">
              <input type="file" accept="image/*" onChange={onFileChange} hidden />
              Add Photo
            </label>
            <button className="submit-post" type="submit" disabled={posting}>
              {posting ? "Posting…" : "Post now"}
            </button>
          </div>
        </form>

        {message && <div className="post-message">{message}</div>}
      </div>
    </section>
  );
};

export default Dashboard;
