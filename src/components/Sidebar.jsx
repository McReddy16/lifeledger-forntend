import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaChartLine,
  FaWallet,
  FaCalendarAlt,
} from "react-icons/fa";
import "../styles/dashboard.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Life Ledger</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className="nav-item">
          <FaTasks />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/calendar" className="nav-item">
          <FaCalendarAlt />
          <span>Calendar</span>
        </NavLink>

        <NavLink to="/performance" className="nav-item">
          <FaChartLine />
          <span>Performance</span>
        </NavLink>

        <NavLink to="/finance" className="nav-item">
          <FaWallet />
          <span>Finance</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
