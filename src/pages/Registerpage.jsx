import { useState, useRef } from "react";
import { signupUser, verifyOtp, resendOtp } from "../api/authenticationApi";

import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/register.css";

export default function Register() {

  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [showOtpCard, setShowOtpCard] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isStrongPassword = (password) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(password);


  // ================= REGISTER =================
  async function handleRegister() {

    if (!form.name.trim()) {
      toast.error("Enter your full name");
      return;
    }

    if (!isValidGmail(form.email)) {
      toast.error("Enter valid Gmail address");
      emailRef.current?.focus();
      return;
    }

    if (form.password.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    if (!isStrongPassword(form.password)) {
      toast.error("Password must contain a special character");
      return;
    }

    try {

      const res = await signupUser({
        ...form,
        email: form.email.toLowerCase().trim()
      });

      setOtpToken(res.otpToken);

      toast.success(res.message || "OTP sent to email");

      setShowOtpCard(true);

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        "Unable to register";

      toast.error(message);
    }
  }


  // ================= VERIFY OTP =================
  async function handleVerifyOtp() {

    if (otp.trim().length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {

      await verifyOtp({
        email: form.email,
        otp: otp.trim(),
        otpToken: otpToken
      });

      toast.success("Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        "Invalid OTP";

      toast.error(message);
    }
  }


  // ================= RESEND OTP =================
  async function handleResendOtp() {

    try {

      const res = await resendOtp(form.email);

      setOtpToken(res.otpToken);

      toast.success("OTP resent successfully");

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        "Unable to resend OTP";

      toast.error(message);
    }
  }


  return (
    <div className="register-page">

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="register-left"></div>

      <div className="register-right">

        <div className="register-card">

          <h1 className="card-title">Life Ledger</h1>

          {!showOtpCard ? (
            <>
              <h2>Create Account</h2>

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

              <button onClick={handleRegister}>
                Register
              </button>

              <Link to="/login">
                Already have an account? Login
              </Link>
            </>
          ) : (
            <>
              <h2>Verify OTP</h2>

              <input
                type="text"
                maxLength="6"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button onClick={handleVerifyOtp}>
                Verify OTP
              </button>

              <p className="resend-otp" onClick={handleResendOtp}>
                Resend OTP
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}