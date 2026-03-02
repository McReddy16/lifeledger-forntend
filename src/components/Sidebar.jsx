import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaLayerGroup,
  FaTasks,
  FaChartLine,
  FaWallet,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";
import "../styles/dashboard.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse state
  const [mobileOpen, setMobileOpen] = useState(false); // mobile slide state

  // auto-close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // toggle logic (mobile slide OR desktop collapse)
  const handleToggle = () => {
    if (window.innerWidth < 900) {
      setMobileOpen((prev) => !prev); // mobile slide toggle
    } else {
      setCollapsed((prev) => !prev); // desktop collapse toggle
    }
  };

  return (
    <>
      {/* overlay only for mobile mode */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)} // close when clicking outside
        />
      )}

      <aside
        className={`sidebar 
          ${collapsed ? "collapsed" : ""} 
          ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* header section */}
        <div className="sidebar-header">
          {/* hide logo when collapsed */}
          {!collapsed && (
            <div className="sidebar-logo">Life Ledger</div>
          )}

          {/* horizontal hamburger button */}
          <button
            className="hamburger-btn" // removed rotate class
            onClick={handleToggle}
          >
            <FaBars />
          </button>
        </div>

        {/* navigation items */}
        <nav className="sidebar-nav">
         <NavItem
  to="/dashboard"
  icon={<FaLayerGroup />}
  label="Foundation"
  collapsed={collapsed}
/>
          <NavItem
            to="/tasks"
            icon={<FaTasks />}
            label="Tasks"
            collapsed={collapsed}
          />
          <NavItem
            to="/calendar"
            icon={<FaCalendarAlt />}
            label="Calendar"
            collapsed={collapsed}
          />
          <NavItem
            to="/performance"
            icon={<FaChartLine />}
            label="Performance"
            collapsed={collapsed}
          />
          <NavItem
            to="/finance"
            icon={<FaWallet />}
            label="Finance"
            collapsed={collapsed}
          />
        </nav>
      </aside>
    </>
  );
};

// single navigation item component
const NavItem = ({ to, icon, label, collapsed }) => (
  <NavLink to={to} className="nav-item">
    <div className="icon-wrapper">
      {icon}
      {/* show tooltip only in collapsed mode */}
      {collapsed && <div className="tooltip">{label}</div>}
    </div>

    {/* hide label when collapsed */}
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;