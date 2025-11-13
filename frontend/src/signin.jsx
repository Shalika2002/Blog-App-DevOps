import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Signin.css";

function SignIn() {
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
            await axios.post("http://localhost:3000/signin", formData);
            login(formData.username);
            navigate("/dashboard");
        } catch (error) {
            setStatus("We could not sign you in. Please check your details.");
        }
    };

    return (
        <section className="signin-bg">
            <div className="signin-illustration" aria-hidden="true">
                <svg viewBox="0 0 320 320" role="presentation">
                    <defs>
                        <linearGradient id="signinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <circle cx="160" cy="160" r="140" fill="url(#signinGradient)" opacity="0.3" />
                    <circle cx="110" cy="130" r="58" fill="#2563eb" opacity="0.65" />
                    <circle cx="210" cy="210" r="48" fill="#60a5fa" opacity="0.7" />
                    <rect x="120" y="170" width="80" height="90" rx="18" fill="#0f172a" opacity="0.2" />
                    <rect x="110" y="120" width="100" height="110" rx="20" fill="#1d4ed8" opacity="0.25" />
                </svg>
            </div>

            <div className="signin-card">
                <h1 className="signin-title">Sign in to SnapLink</h1>
                <p className="signin-quote">
                    "Welcome back! Pick up where you left off and keep your circle in the loop."
                </p>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <button type="submit">Sign in</button>
                </form>
                {status && <div className="signin-status">{status}</div>}
                <p className="signin-footer">
                    New to SnapLink? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </section>
    );
}

export default SignIn;
