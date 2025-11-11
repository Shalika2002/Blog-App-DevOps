import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/signup", formData);
      navigate("/dashboard");
    } catch (error) {
      alert(error)
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-flex">
        <div className="signup-card">
          <div className="signup-title">Create your SnapLink account</div>
          <div className="signup-quote">
            "Share your journey, inspire your community. Every post is a new connection—make yours count!"
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;