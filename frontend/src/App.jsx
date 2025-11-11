import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import SignIn from "./signin";
import SignUp from "./signup";
import Dashboard from "./Dashboard";
import "./Navbar.css";


function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link className="nav-logo" to="/">SnapLink</Link>
        <div className="nav-links">
          <Link className="nav-link" to="/signin">Sign In</Link>
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
