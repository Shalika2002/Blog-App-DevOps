import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./Signup.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post("http://localhost:3000/signup", formData);
      login(formData.username);
      setStatus("Account created! Redirecting to dashboard…");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      setStatus("We couldn't create your account. Please try again.");
    }
  };

  return (
    <section className="signup-layout">
      <div className="signup-intro">
        <span className="signup-tag">Create. Curate. Celebrate.</span>
        <h1>Let your voice resonate with SnapLink</h1>
        <p>
          Start sharing moments and ideas with a supportive community that values authenticity. Design your space, schedule posts, and highlight your best work with powerful tools built for creators.
        </p>
        <ul className="signup-benefits">
          <li>
            <strong>Instant publishing</strong>
            <span>Post text and visuals with sleek formatting in seconds.</span>
          </li>
          <li>
            <strong>Collaborative feedback</strong>
            <span>Engage with people who cheer your ideas forward.</span>
          </li>
          <li>
            <strong>Smart insights</strong>
            <span>Understand what resonates using real-time post highlights.</span>
          </li>
        </ul>
      </div>

      <div className="signup-card">
        <h2>Create your SnapLink account</h2>
        <p className="signup-quote">
          "Share your journey, inspire your community. Every post is a new connection—make yours count!"
        </p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            name="username"
            placeholder="yourname"
            required
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <button type="submit">Create account</button>
        </form>
        {status && <div className="signup-status">{status}</div>}
        <p className="signup-footer">
          Already part of SnapLink? <Link to="/signin">Sign in instead</Link>
        </p>
      </div>
    </section>
  );
}

export default SignUp;