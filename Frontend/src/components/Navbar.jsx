import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../utils css/Navbar.css";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        My Blog
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/create-post">Create Post</Link>
        </li>

        {isAuthenticated ? (
          <>
            {user.role === "admin" ? (
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link to="/my-posts">Your Posts</Link>
              </li>
            )}

            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
