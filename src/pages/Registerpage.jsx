import { useState, useRef } from "react";
import { signupUser } from "../api/authenticationApi";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isStrongPassword = (password) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  async function handleRegister() {
    if (!form.name.trim()) {
      setError("Enter your full name");
      return;
    }

    if (!isValidGmail(form.email)) {
      setError("Enter a valid Gmail address");
      emailRef.current?.focus();
      return;
    }

    if (form.password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    if (!isStrongPassword(form.password)) {
      setError("Password must include at least one special character");
      return;
    }

    try {
      setError("");

      await signupUser({
        ...form,
        email: form.email.toLowerCase().trim(),
      });

      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setError("Email already registered. Please login.");
        emailRef.current?.focus();
      } else {
        setError("Unable to create account. Please try again.");
      }
    }
  }

  return (
    <div className="register-page">

      {/* LEFT IMAGE */}
      <div className="register-left"></div>

      {/* RIGHT SIDE */}
      <div className="register-right">

        <div className="register-card">

          {/* Title moved inside card */}
          <h1 className="card-title">Life Ledger</h1>

          <h2 className="register-heading">Create Account</h2>

          {error && <p className="error-text">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            ref={emailRef}
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={handleRegister}>Register</button>

          <Link to="/login" className="switch-link">
            Already have an account? Login
          </Link>

        </div>

      </div>
    </div>
  );
}