import React, { useEffect, useState } from "react";
import "./Home.css";

import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/posts");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        setError("Couldn't load posts. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home-bg">
      <div className="home-container">
        <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 8, color: '#222' }}>Welcome to SnapLink!</h1>
        <p className="home-desc">
          SnapLink is your place to connect, share, and discover amazing posts from people around the world.
        </p>
        <Link to="/signup" className="home-cta">Create a post</Link>
      </div>

      <div className="feed">
        {loading && <div className="feed-info">Loading posts…</div>}
        {error && <div className="feed-error">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="feed-info">No posts yet. Be the first from the Dashboard!</div>
        )}
        {posts.map((p) => (
          <div className="post-card" key={p._id}>
            <div className="post-header">
              <div className="post-user">{p.username || 'Anonymous'}</div>
              <div className="post-time">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
            {p.imageUrl && (
              <img className="post-image" src={`http://localhost:3000${p.imageUrl}`} alt="post" />
            )}
            {p.text && <div className="post-text">{p.text}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
