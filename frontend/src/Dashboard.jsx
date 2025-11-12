import React, { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Please add some text or an image");
      return;
    }
    try {
      setPosting(true);
      setMessage("");
      const data = new FormData();
      data.append("text", text.trim());
      if (image) data.append("image", image);
      // Optional: send username later when auth exists
      await axios.post("http://localhost:3000/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText("");
      setImage(null);
      setPreview(null);
      setMessage("Post added! Check Home to see it.");
    } catch (err) {
      setMessage("Failed to post. Is the backend running?");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Create a Post</h2>
        <p className="dashboard-welcome">Share an update with your friends. Add text and an optional image.</p>

        <form className="post-form" onSubmit={submitPost}>
          <textarea
            className="post-input"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          {preview && (
            <div className="post-image-preview">
              <img src={preview} alt="preview" />
              <button type="button" className="remove-img" onClick={() => { setImage(null); setPreview(null); }}>Remove</button>
            </div>
          )}

          <div className="post-actions">
            <label className="upload-btn">
              <input type="file" accept="image/*" onChange={onFileChange} hidden />
              Add Photo
            </label>
            <button className="submit-post" type="submit" disabled={posting}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {message && <div className="post-message">{message}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
