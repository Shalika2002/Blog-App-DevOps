import { useState } from "react";
import axios from "axios";
import "./Signin.css";

function SignIn() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/signin", formData);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="signin-bg">
            <div className="signin-flex">
                <div className="signin-card">
                    <div className="signin-title">Sign in to SnapLink</div>
                    <div className="signin-quote">
                        "Welcome back! Connect with your friends and share your story."
                    </div>
                    <form className="signin-form" onSubmit={handleSubmit}>
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
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
