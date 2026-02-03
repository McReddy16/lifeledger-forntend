import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

const DashboardLayout = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // ✅ READ username stored during login
    const storedUserName = localStorage.getItem("userName");

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar userName={userName} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
