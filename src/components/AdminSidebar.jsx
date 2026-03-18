import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaChevronDown,
  FaUtensils,
  FaListUl,
  FaShoppingCart,
  FaSearch,
  FaFileAlt,
  FaStar,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [openMenus, setOpenMenus] = useState({
    category: false,
    food: false,
    orders: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: isCollapsed ? "80px" : "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #0f172a, #020617)",
        position: "fixed",
        left: 0,
        top: 0,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        boxShadow: "2px 0 20px rgba(0,0,0,0.4)",
        zIndex: 9999,
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && <h5 style={{ margin: 0 }}>Admin</h5>}
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* PROFILE */}
      {!isCollapsed && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <img
            src="/img/admin.png"
            alt="admin"
            style={{
              width: "55px",
              borderRadius: "50%",
              marginBottom: "8px",
            }}
          />
          <h6 style={{ margin: 0 }}>Harsh Admin</h6>
          <p style={{ fontSize: "12px", color: "#64748b" }}>
            Super Admin
          </p>
        </div>
      )}

      {/* MENU */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          scrollBehavior: "smooth",
        }}
      >
        <SidebarItem
          icon={<FaThLarge />}
          text="Dashboard"
          to="/admin-dashboard"
          active={isActive("/admin-dashboard")}
          collapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FaUsers />}
          text="Users"
          to="/manage_users"
          active={isActive("/manage_users")}
          collapsed={isCollapsed}
        />

        <Dropdown
          icon={<FaListUl />}
          text="Categories"
          open={openMenus.category}
          toggle={() => toggleMenu("category")}
          collapsed={isCollapsed}
        >
          <SubItem to="/add-category" text="Add New" />
          <SubItem to="/manage-category" text="Manage List" />
        </Dropdown>

        <Dropdown
          icon={<FaUtensils />}
          text="Food Menu"
          open={openMenus.food}
          toggle={() => toggleMenu("food")}
          collapsed={isCollapsed}
        >
          <SubItem to="/add-food" text="Add Food" />
          <SubItem to="/manage-food" text="Manage Food" />
        </Dropdown>

        <Dropdown
          icon={<FaShoppingCart />}
          text="Orders"
          open={openMenus.orders}
          toggle={() => toggleMenu("orders")}
          collapsed={isCollapsed}
        >
          <SubItem to="/order-not-confirmed" text="Not Confirmed" />
          <SubItem to="/confirm-order" text="Confirmed" />
          <SubItem to="/order-delivered" text="Delivered" />
        </Dropdown>

        <SidebarItem
          icon={<FaSearch />}
          text="Search Order"
          to="/search-order"
          active={isActive("/search-order")}
          collapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FaFileAlt />}
          text="Sales Report"
          to="/order-report"
          active={isActive("/order-report")}
          collapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FaStar />}
          text="Reviews"
          to="/manage-review"
          active={isActive("/manage-review")}
          collapsed={isCollapsed}
        />
      </div>

      {/* LOGOUT */}
      <div style={{ padding: "10px" }}>
        <button
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          <FaSignOutAlt /> {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;





// ================= COMPONENTS =================

// Sidebar Item
const SidebarItem = ({ icon, text, to, active, collapsed }) => {
  return (
    <Link
      to={to}
      title={collapsed ? text : ""}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 14px",
        borderRadius: "12px",
        color: active ? "#fff" : "#94a3b8",
        background: active ? "rgba(59,130,246,0.15)" : "transparent",
        textDecoration: "none",
        marginBottom: "8px",
        transition: "all 0.25s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.transform = "translateX(4px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "translateX(0)";
        }
      }}
    >
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            height: "60%",
            width: "4px",
            background: "#3b82f6",
            borderRadius: "4px",
          }}
        />
      )}

      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
};

// Dropdown
const Dropdown = ({
  icon,
  text,
  open,
  toggle,
  children,
  collapsed,
}) => {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div
        onClick={toggle}
        title={collapsed ? text : ""}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 14px",
          cursor: "pointer",
          borderRadius: "12px",
          color: "#94a3b8",
          transition: "0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", gap: "14px" }}>
          <span style={{ fontSize: "1.1rem" }}>{icon}</span>
          {!collapsed && text}
        </div>

        {!collapsed && (
          <FaChevronDown
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s ease",
            }}
          />
        )}
      </div>

      {!collapsed && (
        <div
          style={{
            maxHeight: open ? "200px" : "0px",
            overflow: "hidden",
            transition: "all 0.3s ease",
            marginLeft: "10px",
            borderLeft: open
              ? "2px solid rgba(59,130,246,0.3)"
              : "2px solid transparent",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Sub Item
const SubItem = ({ to, text }) => {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "8px 12px 8px 20px",
        color: "#64748b",
        fontSize: "13px",
        textDecoration: "none",
        borderRadius: "6px",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#3b82f6";
        e.currentTarget.style.background = "rgba(59,130,246,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#64748b";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {text}
    </Link>
  );
};