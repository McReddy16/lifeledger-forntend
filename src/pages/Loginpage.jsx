import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authenticationApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("userName", response.username);

      if (onLoginSuccess) {
        onLoginSuccess(response);
      }

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="signin-page">

      {/* LEFT SIDE - IMAGE */}
      <div className="signin-left"></div>

      {/* RIGHT SIDE - FORM */}
      <div className="signin-right">

        <div className="signin-card">

          {/* Title moved inside card */}
          <h1 className="card-title">LIFE LEDGER</h1>

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

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="signin-input"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>

          <Link to="/register" className="switch-link">
            Don't have an account? Register
          </Link>

        </div>

      </div>
    </div>
  );
}