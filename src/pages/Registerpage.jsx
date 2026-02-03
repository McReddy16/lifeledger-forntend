import { useState, useRef } from "react";
import { signupUser } from "../api/authenticationApi";
import "../styles/register.css";
import { Link, useNavigate } from "react-router-dom"; // ✅ UPDATED

export default function Register() { // ❌ removed goToLogin prop
  const navigate = useNavigate(); // ✅ ADDED

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const emailRef = useRef(null);

  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isStrongPassword = (password) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  async function handleRegister() {
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

      navigate("/login"); // ✅ UPDATED (replaces goToLogin())
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setError("Email already registered. Please login.");
        emailRef.current?.focus();
      } else {
        setError(err.message || "Unable to create account. Please try again.");
      }
    }
  }

  return (
    <div className="register-page">
      <div className="register-overlay">
        <h1 className="register-title">
          Life <span>Ledger</span>
        </h1>

        <div className="register-card">
          <h2 className="register-heading">Create Account</h2>

          {error && <p className="error-text">{error}</p>}

          <input
            type="text"
            placeholder="Full name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <div className="input-wrapper">
            <input
              ref={emailRef}
              type="email"
              placeholder="Email address"
              className={
                error && error.toLowerCase().includes("email")
                  ? "input-error"
                  : ""
              }
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setError("");
              }}
            />
            {error && error.toLowerCase().includes("email") && (
              <span className="error-icon">!</span>
            )}
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              className={
                error &&
                (error.toLowerCase().includes("password") ||
                  error.toLowerCase().includes("character"))
                  ? "input-error"
                  : ""
              }
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {error &&
              (error.toLowerCase().includes("password") ||
                error.toLowerCase().includes("character")) && (
                <span className="error-icon">!</span>
              )}
          </div>

          <button onClick={handleRegister}>Register</button>

          <Link to="/login" className="switch">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
