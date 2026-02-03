import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { loginUser } from "../api/authenticationApi";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin() {
    setError("");

    try {
      const response = await loginUser(form);

      // ✅ STORE AUTH DATA 
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("userName", response.username);

      // Optional callback
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }

      // ✅ Navigate after successful login
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-overlay">
        <h1 className="app-title">
          Life <span>Ledger</span>
        </h1>

        <div className="signin-card">
          <h2 className="signin-heading">LOGIN</h2>

          {error && <p className="error-text">{error}</p>}

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="signin-input"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signin-input"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>

          <Link to="/register" className="switch">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
