import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Topbar = ({ userName }) => {
 

  /* ------------------------------
     STATE MANAGEMENT
     ------------------------------ */
  const [open, setOpen] = useState(false);

  /* ------------------------------
     ROUTER HOOKS
     ------------------------------ */
  const location = useLocation();
  const navigate = useNavigate();

  /* ------------------------------
     PAGE TITLE BASED ON ROUTE
     ------------------------------ */
  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/tasks":
        return "Tasks";
      case "/calendar":
        return "Calendar";
      case "/performance":
        return "Performance";
      case "/finance":
        return "My Finance";
      default:
        return "";
    }
  };

  /* ------------------------------
     USER INITIAL (AVATAR LETTER)
     ------------------------------ */
  const userInitial = userName
    ? userName.charAt(0).toUpperCase()
    : "?";

  /* ------------------------------
     LOGOUT HANDLER
     ------------------------------ */
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      {/* LEFT: PAGE TITLE */}
      <div className="topbar-title">{getTitle()}</div>

      {/* RIGHT: USER INFO */}
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
                navigate("/profile");
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
    </header>
  );
};

export default Topbar;
