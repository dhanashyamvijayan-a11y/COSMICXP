import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token for this demo integration.
      // For production, prefer a secure HttpOnly cookie.
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      navigate("/profile"); 

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert(error.message || "Cannot connect to server");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">
          COSMIC<span>XP</span>
        </Link>

        <p className="login-tagline">
          ENTER THE GAMING UNIVERSE
        </p>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Login to continue your adventure.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-button" type="submit">
            LOGIN NOW
          </button>
        </form>

        <p className="signup-text">
          New to CosmicXP?{" "}
          <Link to="/signup">Create an account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}