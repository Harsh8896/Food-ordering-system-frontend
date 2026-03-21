import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaStore,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // localStorage se restaurant info lo
  const restaurantName = localStorage.getItem("restaurantName") || "Admin";
  const ownerEmail = localStorage.getItem("ownerEmail") || "";

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

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("ownerEmail");
    navigate("/admin-login");
  };

  // Restaurant name se initials nikalo (e.g. "Spice Garden" → "SG")
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
        {!isCollapsed && (
          <div className="d-flex align-items-center gap-2">
            <FaStore className="text-warning" />
            <h5 style={{ margin: 0, fontSize: "15px" }}>Restaurant Panel</h5>
          </div>
        )}
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* PROFILE — Restaurant Owner Info */}
      {!isCollapsed && (
        <div style={{ textAlign: "center", padding: "16px 10px" }}>
          {/* Avatar — initials se */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            {getInitials(restaurantName)}
          </div>
          <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
            {restaurantName}
          </h6>
          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", marginBottom: 0 }}>
            {ownerEmail}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "6px",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              fontSize: "10px",
              padding: "2px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            ● Online
          </span>
        </div>
      )}

      {/* Collapsed avatar */}
      {isCollapsed && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "14px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            {getInitials(restaurantName)}
          </div>
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
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            transition: "0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
        >
          <FaSignOutAlt />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;


// ================= COMPONENTS =================

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

const Dropdown = ({ icon, text, open, toggle, children, collapsed }) => {
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