import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  loginUser,
  forgotPassword,
  resetPassword
} from "../api/authenticationApi";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/login.css";

export default function Login({ onLoginSuccess }) {

  const navigate = useNavigate();

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // Step controls UI flow (login / forgot / reset)
  const [step, setStep] = useState("login");

  // OTP reset flow state
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);


  // ================= INPUT HANDLER =================
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  // ================= LOGIN =================
  async function handleLogin() {

    // Simple client validation
    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {

      const res = await loginUser(form);

      // Store auth data
      localStorage.setItem("authToken", res.token);
      localStorage.setItem("userEmail", res.email);
      localStorage.setItem("userName", res.username);

      toast.success("Login successful");

      if (onLoginSuccess) {
        onLoginSuccess(res);
      }

      navigate("/dashboard");

    } catch (err) {

      // Always show backend message
      const message =
        err.message ||
        "Unable to login. Please try again.";

      toast.error(message);
    }
  }


  // ================= FORGOT PASSWORD =================
  async function handleForgotPassword() {

    if (!form.email) {
      toast.error("Please enter your email first");
      return;
    }

    try {

      const response = await forgotPassword(form.email);

      const token =
        typeof response === "string"
          ? response
          : response?.otpToken;

      setOtpToken(token);

      toast.success("OTP sent to your email");

      setStep("reset");

    } catch (err) {

      const message =
        err?.message ||
        "Unable to send OTP";

      toast.error(message);
    }
  }


  // ================= RESET PASSWORD =================
  async function handleResetPassword() {

    if (otp.trim().length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    if (!newPassword) {
      toast.error("Enter new password");
      return;
    }

    try {

      await resetPassword({
        email: form.email,
        otp: otp.trim(),
        otpToken: otpToken,
        newPassword: newPassword
      });

      toast.success("Password changed successfully");

      setStep("login");
      setOtp("");
      setNewPassword("");

    } catch (err) {

      const message =
        err?.message ||
        "Invalid or expired OTP";

      toast.error(message);
    }
  }


  // ================= UI =================
  return (
    <div className="signin-page">

      {/* Toast UI container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="signin-left"></div>

      <div className="signin-right">

        <div className="signin-card">

          <h1 className="card-title">LIFE LEDGER</h1>


          {/* ================= LOGIN VIEW ================= */}
          {step === "login" && (
            <>
              <h2 className="signin-heading">LOGIN</h2>

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

              <p
                className="forgot-link"
                onClick={() => setStep("forgot")}
              >
                Forgot password?
              </p>

              <button
                className="btn-login"
                onClick={handleLogin}
              >
                Login
              </button>

              <Link to="/register" className="switch-link">
                Don't have an account? Register
              </Link>
            </>
          )}


          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {step === "forgot" && (
            <>
              <h2 className="signin-heading">Forgot Password</h2>

              <input
                type="email"
                placeholder="Enter your email"
                className="signin-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <button
                className="btn-login"
                onClick={handleForgotPassword}
              >
                Send OTP
              </button>

              <p
                className="forgot-link"
                onClick={() => setStep("login")}
              >
                Back to Login
              </p>
            </>
          )}


          {/* ================= RESET PASSWORD VIEW ================= */}
          {step === "reset" && (
            <>
              <h2 className="signin-heading">Reset Password</h2>

              <input
                type="text"
                placeholder="Enter OTP"
                maxLength="6"
                className="signin-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <input
                type="password"
                placeholder="New Password"
                className="signin-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                className="btn-login"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>

              <p
                className="forgot-link"
                onClick={() => setStep("login")}
              >
                Back to Login
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}