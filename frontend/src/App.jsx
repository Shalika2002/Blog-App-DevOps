import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import Home from "./Home";
import SignIn from "./signin";
import SignUp from "./signup";
import Dashboard from "./Dashboard";
import { AuthProvider, useAuth } from "./AuthContext";
import "./Navbar.css";

const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <NavLink className="nav-logo" to="/" onClick={closeMenu}>
            SnapLink
          </NavLink>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {user ? (
              <>
                <div className="nav-user-info">
                  <span className="nav-user-avatar">{user.username.slice(0, 1).toUpperCase()}</span>
                  <span className="nav-user-name">{user.username}</span>
                </div>
                <button className="nav-logout" onClick={() => { logout(); closeMenu(); }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " nav-link-active" : ""}`
                  }
                  to="/signin"
                  onClick={closeMenu}
                >
                  Sign In
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link nav-link-primary${isActive ? " nav-link-active" : ""}`
                  }
                  to="/signup"
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <span>© {currentYear} SnapLink.</span>
          <span>Crafted for vibrant communities.</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
