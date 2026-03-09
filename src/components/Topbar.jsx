import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../api/authenticationApi";

import "react-toastify/dist/ReactToastify.css";
import "../styles/dashboard.css";

const Topbar = ({ userName }) => {

  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  /* ===============================
     LOGIN SUCCESS TOAST
  =============================== */

  useEffect(() => {

    const token = localStorage.getItem("authToken");

    // if (token && !sessionStorage.getItem("loginToastShown")) {

    //   toast.success("Login successful");

    //   sessionStorage.setItem("loginToastShown", "true");
    // }

  }, []);

  /* ===============================
     PAGE TITLE
  =============================== */

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "FOUNDATION";
      case "/tasks":
        return "TASKS";
      case "/calendar":
        return "CALENDAR";
      case "/performance":
        return "PERFORMANCE";
      case "/finance":
        return "MY FINANCE";
      default:
        return "";
    }
  };

  const userInitial = userName
    ? userName.charAt(0).toUpperCase()
    : "?";

  /* ===============================
     LOGOUT
  =============================== */

  const handleLogout = () => {

    localStorage.clear();
    sessionStorage.clear();

    // toast.success("Logout successful");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1200);
  };

  /* ===============================
     CHANGE PASSWORD
  =============================== */

  const handleChangePassword = async () => {

    if (!currentPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (currentPassword === newPassword) {
      toast.warning("New password cannot be same as current password");
      return;
    }

    try {

      await changePassword({
        currentPassword,
        newPassword
      });

      toast.success("Password updated successfully");

      setShowSecurity(false);

      setCurrentPassword("");
      setNewPassword("");

      toast.info("Please login again with your new password");

      setTimeout(() => {

        localStorage.clear();
        sessionStorage.clear();

        navigate("/login");

      }, 2000);

    } catch (err) {

      toast.error(err.message || "Current password incorrect");

    }
  };

  return (
    <header className="topbar">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        theme="colored"
      />

      <div className="topbar-title">{getTitle()}</div>

      <div className="profile-wrapper">

        <span className="username">{userName}</span>

        <div
          className="avatar"
          onClick={() => setOpen(!open)}
        >
          {userInitial}
        </div>

        {open && (
          <div className="profile-menu">

            <button
              onClick={() => {
                setOpen(false);
                setShowProfile(true);
              }}
            >
              Profile
            </button>

            <button
              className="logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

      {/* PROFILE MODAL */}

      {showProfile && (
        <div className="modal-overlay">
          

          <div className="modal-boxy">
             <button
                className="closing-btn"
                onClick={() => setShowProfile(false)}
              >
                X
              </button>

            <h3>User Profile</h3>

        <div>
              <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>

            <div className="modal-actions">

              <button
                className="btn-primary"
                onClick={() => {
                  setShowProfile(false);
                  setShowSecurity(true);
                }}
              >
                Update Password
              </button>

             

            </div>

          </div>

        </div>
      )}

      {/* SECURITY MODAL */}

      {showSecurity && (
        <div className="modal-overlay">

          <div className="modal-boxy">

            <h3>Change Password</h3>

            <div className="password-field">

              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <span
                className="toggle-eye"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>

            <div className="password-field">

              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <span
                className="toggle-eye"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>

            <div className="modal-actions">

              <button
                onClick={handleChangePassword}
                className="btn-primary"
              >
                Update
              </button>

              <button
                onClick={() => setShowSecurity(false)}
                className="btn-secondary cancle-sec-btn"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </header>
  );
};

export default Topbar;