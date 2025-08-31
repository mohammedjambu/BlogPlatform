import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../config/apiService";
import "../utils css/LoginPage.css";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.post("/auth/register", {
        username,
        password,
      });

      const { token, data } = response.data;
      login(data.user, token);

      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Create an Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <Link to="/admin/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
