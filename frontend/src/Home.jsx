import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/posts");
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
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

  const highlightPost = useMemo(() => posts[0] || null, [posts]);
  const momentCount = useMemo(() => Math.max(posts.length * 12, 1280), [posts]);
  const formattedMoments = useMemo(() => {
    if (momentCount >= 1000) {
      return `${(momentCount / 1000).toFixed(1)}K`;
    }
    return momentCount.toString();
  }, [momentCount]);

  return (
    <section className="home">
      <div className="home-hero">
        <div className="home-hero-copy">
          <span className="home-pill">Vibrant communities • Real voices</span>
          <h1>Share stories that spark conversations</h1>
          <p>
            SnapLink gives you a calm, modern space to publish quick updates, share photos, and keep your friends in the loop. Join a creative community that celebrates every win and supports every idea.
          </p>
          <div className="home-actions">
            <Link to="/signup" className="home-cta">Create your account</Link>
            <Link to="/signin" className="home-secondary">Sign in</Link>
          </div>
          <dl className="home-stats">
            <div>
              <dt>Daily creators</dt>
              <dd>500+</dd>
            </div>
            <div>
              <dt>Moments shared</dt>
              <dd>{formattedMoments}</dd>
            </div>
            <div>
              <dt>Uptime</dt>
              <dd>99.9%</dd>
            </div>
          </dl>
        </div>

        <div className="home-hero-panel">
          {highlightPost ? (
            <article className="highlight-card">
              <header>
                <div>
                  <strong>{highlightPost.username || "Anonymous"}</strong>
                  <span>@snaplink</span>
                </div>
                <time>{new Date(highlightPost.createdAt).toLocaleDateString()}</time>
              </header>
              {highlightPost.imageUrl && (
                <img src={`http://localhost:3000${highlightPost.imageUrl}`} alt="Highlighted community post" />
              )}
              {highlightPost.text && <p>{highlightPost.text}</p>}
            </article>
          ) : (
            <div className="highlight-placeholder">
              <h3>Your story could be here</h3>
              <p>Publish a post from the dashboard to light up the community feed.</p>
            </div>
          )}
        </div>
      </div>

      <div className="home-feed">
        <div className="home-feed-header">
          <h2>Community feed</h2>
          {!loading && !error && <span>{posts.length} live posts</span>}
        </div>

        {loading && <div className="feed-info">Loading posts…</div>}
        {error && <div className="feed-error">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="feed-info">No posts yet. Be the first from the Dashboard!</div>
        )}

        <div className="feed">
          {posts.map((p) => (
            <article className="post-card" key={p._id}>
              <header className="post-header">
                <div className="post-user">
                  <span className="post-avatar" aria-hidden="true">{(p.username || "Anonymous").slice(0, 1).toUpperCase()}</span>
                  <div>
                    <strong>{p.username || "Anonymous"}</strong>
                    <time>{new Date(p.createdAt).toLocaleString()}</time>
                  </div>
                </div>
              </header>
              {p.imageUrl && (
                <img className="post-image" src={`http://localhost:3000${p.imageUrl}`} alt="Community post" />
              )}
              {p.text && <p className="post-text">{p.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
